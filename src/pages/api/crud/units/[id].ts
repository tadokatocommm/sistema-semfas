import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'ID inválido.' });
  }

  switch (req.method) {
    case 'PUT':
      try {
        const { name, unitTypeId } = req.body;
        if (!name || !unitTypeId) {
          return res.status(400).json({ message: 'Nome e Tipo de Unidade são obrigatórios.' });
        }
        const updatedUnit = await prisma.unit.update({
          where: { id },
          data: { name, unitTypeId },
        });
        res.status(200).json(updatedUnit);
      } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar unidade', error });
      }
      break;

    case 'DELETE':
      try {
        const users = await prisma.user.count({ where: { unitId: id } });
        if (users > 0) {
          return res.status(400).json({ message: 'Não é possível apagar. Existem utilizadores associados a esta unidade.' });
        }
        await prisma.unit.delete({ where: { id } });
        res.status(204).end(); 
      } catch (error) {
        res.status(500).json({ message: 'Erro ao apagar unidade', error });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
