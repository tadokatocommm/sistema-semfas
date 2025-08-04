import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const unitTypes = await prisma.unitType.findMany({
      orderBy: {
        name: 'asc', 
      },
    });
    return res.status(200).json(unitTypes);
  } catch (error) {
    console.error('Falha ao buscar tipos de unidade:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  } finally {
    await prisma.$disconnect();
  }
}
