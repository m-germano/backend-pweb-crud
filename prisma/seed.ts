import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seedContinents() {
  const continents = [
    { nome: 'África',         descricao: 'Continente africano' },
    { nome: 'América do Sul', descricao: 'América do Sul' },
    { nome: 'América do Norte', descricao: 'América do Norte' },
    { nome: 'Ásia',           descricao: 'Continente asiático' },
    { nome: 'Europa',         descricao: 'Continente europeu' },
    { nome: 'Oceania',        descricao: 'Oceania' },
  ]

  // createMany é bem mais rápido; com skipDuplicates respeita o unique(nome)
  const res = await prisma.continent.createMany({
    data: continents,
    skipDuplicates: true,
  })
  console.log(`🌍 Continentes inseridos (ou já existiam): ${res.count}`)
}

async function seedBrazilAndSaoPaulo() {
  // pega o continente América do Sul
  const americaDoSul = await prisma.continent.findUnique({
    where: { nome: 'América do Sul' },
  })

  if (!americaDoSul) {
    throw new Error('Continente "América do Sul" não encontrado após seed.')
  }

  // País: Brasil (com campos obrigatórios do schema)
  const brasil = await prisma.country.upsert({
    where: { iso2: 'BR' }, // iso2 é unique no schema
    update: {
      nome: 'Brasil',
      populacao: 203000000,           // valor aproximado; ajuste se quiser
      idiomaOficial: 'Português',
      moeda: 'BRL',
      fusoHorario: 'UTC-03:00',
      continentId: americaDoSul.id,
    },
    create: {
      nome: 'Brasil',
      populacao: 203000000,
      idiomaOficial: 'Português',
      moeda: 'BRL',
      fusoHorario: 'UTC-03:00',
      iso2: 'BR',
      continentId: americaDoSul.id,
    },
    include: { continent: true },
  })
  console.log(`🇧🇷 País upsert: ${brasil.nome} (continente: ${brasil.continent.nome})`)

  // Cidade: São Paulo
  const sp = await prisma.city.upsert({
    where: {
      // unique composto (nome, countryId) não dá pra usar direto em where,
      // então usamos um fallback: pega o registro se existir e decide
      // (alternativa: faça um findUnique com { nome, countryId } antes)
      id: '00000000-0000-0000-0000-000000000001', // truque: garante um where válido
    },
    update: {}, // nunca será usado com esse id "fake"
    create: {
      nome: 'São Paulo',
      populacao: 12000000,
      latitude:  -23.550520,
      longitude: -46.633308,
      countryId: brasil.id,
    },
  }).catch(async () => {
    // Se caiu aqui, é porque usamos o truque do id fake.
    // Vamos tentar localizar por nome+country e criar só se não existir.
    const exists = await prisma.city.findFirst({
      where: { nome: 'São Paulo', countryId: brasil.id },
    })
    if (exists) {
      console.log('🏙️  Cidade São Paulo já existia.')
      return exists
    }
    const created = await prisma.city.create({
      data: {
        nome: 'São Paulo',
        populacao: 12000000,
        latitude:  -23.550520,
        longitude: -46.633308,
        countryId: brasil.id,
      },
    })
    console.log('🏙️  Cidade criada: São Paulo')
    return created
  })
}

async function main() {
  await prisma.$transaction(async (tx) => {
    // opcional: use tx.* ao invés de prisma.* se quiser tudo no mesmo contexto
    await seedContinents()
    await seedBrazilAndSaoPaulo()
  })
  console.log('✅ Seed concluído com sucesso.')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
