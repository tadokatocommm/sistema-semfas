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
        const { name } = req.body;
        if (!name) {
          return res.status(400).json({ message: 'O nome é obrigatório.' });
        }
        const updatedUnitType = await prisma.unitType.update({
          where: { id },
          data: { name },
        });
        res.status(200).json(updatedUnitType);
      } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar tipo de unidade', error });
      }
      break;

    case 'DELETE':
      try {
        const units = await prisma.unit.count({ where: { unitTypeId: id } });
        if (units > 0) {
          return res.status(400).json({ message: 'Não é possível apagar. Existem unidades associadas a este tipo.' });
        }
        await prisma.unitType.delete({ where: { id } });
        res.status(204).end(); // No Content
      } catch (error) {
        res.status(500).json({ message: 'Erro ao apagar tipo de unidade', error });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
