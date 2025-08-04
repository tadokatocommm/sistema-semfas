import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const unitTypes = await prisma.unitType.findMany({ orderBy: { name: 'asc' } });
        res.status(200).json(unitTypes);
      } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar tipos de unidade', error });
      }
      break;

    case 'POST':
      try {
        const { name } = req.body;
        if (!name) {
          return res.status(400).json({ message: 'O nome é obrigatório.' });
        }
        const newUnitType = await prisma.unitType.create({
          data: { name },
        });
        res.status(201).json(newUnitType);
      } catch (error) {
        res.status(500).json({ message: 'Erro ao criar tipo de unidade', error });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
