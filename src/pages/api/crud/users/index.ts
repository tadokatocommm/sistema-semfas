import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '../../../../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const users = await prisma.user.findMany({
          orderBy: { fullName: 'asc' }, 
          include: {
            unit: {
              select: { name: true, unitType: { select: { name: true } } },
            },
          },
        });
        const usersWithoutPassword = users.map(({ passwordHash, ...user }) => user);
        res.status(200).json(usersWithoutPassword);
      } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar utilizadores', error });
      }
      break;

    case 'POST':
      try {
        const { email, password, unitId, fullName, cpf, state, city } = req.body;
        if (!email || !password || !unitId || !fullName || !cpf || !state || !city) {
          return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password, salt);

        const newUser = await prisma.user.create({
          data: { email, passwordHash, unitId, fullName, cpf, state, city },
        });
        
        const { passwordHash: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
      } catch (error) {
        if ((error as any).code === 'P2002') {
            return res.status(409).json({ message: 'Email ou CPF já existem no sistema.' });
        }
        res.status(500).json({ message: 'Erro ao criar utilizador', error });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
