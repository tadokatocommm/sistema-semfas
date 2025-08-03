import { PrismaClient } from '../src/generated/prisma'; 
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seeding...');


  console.log('Limpando dados antigos...');
  await prisma.user.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.unitType.deleteMany();
  console.log('Dados antigos limpos com sucesso.');

  console.log('Criando Tipos de Unidade...');
  const abrigoType = await prisma.unitType.create({
    data: { name: 'ABRIGO' },
  });

  const crasType = await prisma.unitType.create({
    data: { name: 'CRAS' },
  });

  const creasType = await prisma.unitType.create({
    data: { name: 'CREAS' },
  });
  console.log('Tipos de Unidade criados:', abrigoType.name, crasType.name, creasType.name);

  console.log('Criando Unidades Específicas...');
  const abrigoNubia = await prisma.unit.create({
    data: {
      name: 'ABRIGO NÚBIA MARQUES',
      unitTypeId: abrigoType.id, 
    },
  });

  const crasCentro = await prisma.unit.create({
    data: {
      name: 'CRAS CENTRO',
      unitTypeId: crasType.id, 
    },
  });
  console.log('Unidades Específicas criadas:', abrigoNubia.name, crasCentro.name);

  console.log('Criando usuário administrador...');
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('admin_password', salt); 
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@shelter.com',
      passwordHash: adminPasswordHash,
      unitId: abrigoNubia.id, 
    },
  });

  console.log('Usuário administrador criado:', adminUser.email);
  console.log('Seeding finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Ocorreu um erro durante o seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
