import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const units = await prisma.unit.findMany({
          orderBy: { name: 'asc' },
          include: {
            unitType: {
              select: { name: true }, 
            },
          },
        });
        res.status(200).json(units);
      } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar unidades', error });
      }
      break;

    case 'POST':
      // Criar uma nova unidade
      try {
        const { name, unitTypeId } = req.body;
        if (!name || !unitTypeId) {
          return res.status(400).json({ message: 'Nome e Tipo de Unidade são obrigatórios.' });
        }
        const newUnit = await prisma.unit.create({
          data: { name, unitTypeId },
        });
        res.status(201).json(newUnit);
      } catch (error) {
        res.status(500).json({ message: 'Erro ao criar unidade', error });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
