import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '../../../../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'ID inválido.' });
  }

  switch (req.method) {
    case 'PUT':
      try {
        const { email, password, unitId, fullName, cpf, state, city } = req.body;
        if (!email || !unitId || !fullName || !cpf || !state || !city) {
          return res.status(400).json({ message: 'Todos os campos, exceto a password, são obrigatórios.' });
        }

        let passwordHash;
        if (password) {
          const salt = bcrypt.genSaltSync(10);
          passwordHash = bcrypt.hashSync(password, salt);
        }

        const updatedUser = await prisma.user.update({
          where: { id },
          data: {
            email,
            unitId,
            fullName,
            cpf,
            state,
            city,
            ...(passwordHash && { passwordHash }),
          },
        });

        const { passwordHash: _, ...userWithoutPassword } = updatedUser;
        res.status(200).json(userWithoutPassword);
      } catch (error) {
        if ((error as any).code === 'P2002') {
            return res.status(409).json({ message: 'Email ou CPF já existem no sistema.' });
        }
        res.status(500).json({ message: 'Erro ao atualizar utilizador', error });
      }
      break;

    case 'DELETE':
      try {
        await prisma.user.delete({ where: { id } });
        res.status(204).end(); 
      } catch (error) {
        res.status(500).json({ message: 'Erro ao apagar utilizador', error });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
