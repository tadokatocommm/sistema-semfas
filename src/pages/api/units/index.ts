import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { typeId } = req.query;

  if (!typeId) {
    return res.status(400).json({ message: 'O ID do tipo de unidade é obrigatório.' });
  }

  try {
    const units = await prisma.unit.findMany({
      where: {
        unitTypeId: typeId as string,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return res.status(200).json(units);
  } catch (error) {
    console.error('Falha ao buscar unidades:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  } finally {
    await prisma.$disconnect();
  }
}
