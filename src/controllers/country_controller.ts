import { Request, Response } from 'express'
import { prisma } from '../models/prisma'


export const createCountry = async (req: Request, res: Response) => {
const { nome, populacao, idiomaOficial, moeda, fusoHorario, iso2, continentId } = req.body
const created = await prisma.country.create({
data: { nome, populacao, idiomaOficial, moeda, fusoHorario, iso2, continentId },
})
res.status(201).json(created)
}


export const listCountries = async (req: Request, res: Response) => {
const page = Number(req.query.page ?? 1)
const pageSize = Number(req.query.pageSize ?? 10)
const search = String(req.query.search ?? '')
const continentId = req.query.continentId ? String(req.query.continentId) : undefined


const where: any = {}
if (continentId) where.continentId = continentId
if (search) where.nome = { contains: search, mode: 'insensitive' }


const [items, total] = await Promise.all([
prisma.country.findMany({
where,
orderBy: { nome: 'asc' },
include: { continent: true },
skip: (page - 1) * pageSize,
take: pageSize,
}),
prisma.country.count({ where }),
])


res.json({ items, page, pageSize, total })
}


export const getCountry = async (req: Request, res: Response) => {
const { id } = req.params
const item = await prisma.country.findUnique({ where: { id }, include: { continent: true } })
if (!item) return res.status(404).json({ message: 'Country not found' })
res.json(item)
}


export const updateCountry = async (req: Request, res: Response) => {
const { id } = req.params
const { nome, populacao, idiomaOficial, moeda, fusoHorario, iso2, continentId } = req.body
const updated = await prisma.country.update({
where: { id },
data: { nome, populacao, idiomaOficial, moeda, fusoHorario, iso2, continentId },
})
res.json(updated)
}


export const deleteCountry = async (req: Request, res: Response) => {
const { id } = req.params
await prisma.country.delete({ where: { id } })
res.status(204).send()
}