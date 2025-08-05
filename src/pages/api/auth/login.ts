import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '../../../generated/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'seu-segredo-super-secreto-para-desenvolvimento';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, unitId } = req.body;

  if (!email || !password || !unitId) {
    return res.status(400).json({ message: 'Unidade, e-mail e password são obrigatórios.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        unit: {
          include: {
            unitType: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    if (user.unitId !== unitId) {
      return res.status(403).json({ message: 'Utilizador não pertence à unidade selecionada.' }); 
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        unitName: user.unit.name,
        unitTypeName: user.unit.unitType.name,
      },
      SECRET_KEY,
      {
        expiresIn: '8h',
      }
    );

    return res.status(200).json({ token });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  } finally {
    await prisma.$disconnect();
  }
}
