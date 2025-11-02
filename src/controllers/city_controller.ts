import { Request, Response } from 'express'
import { prisma } from '../models/prisma'


export const createCity = async (req: Request, res: Response) => {
const { nome, populacao, latitude, longitude, countryId } = req.body
const created = await prisma.city.create({
data: { nome, populacao, latitude, longitude, countryId },
})
res.status(201).json(created)
}


export const listCities = async (req: Request, res: Response) => {
const page = Number(req.query.page ?? 1)
const pageSize = Number(req.query.pageSize ?? 10)
const search = String(req.query.search ?? '')
const countryId = req.query.countryId ? String(req.query.countryId) : undefined
const continentId = req.query.continentId ? String(req.query.continentId) : undefined


const where: any = {}
if (countryId) where.countryId = countryId
if (search) where.nome = { contains: search, mode: 'insensitive' }
if (continentId) {
where.country = { continentId }
}


const [items, total] = await Promise.all([
prisma.city.findMany({
where,
orderBy: { nome: 'asc' },
include: { country: { include: { continent: true } } },
skip: (page - 1) * pageSize,
take: pageSize,
}),
prisma.city.count({ where }),
])


res.json({ items, page, pageSize, total })
}


export const getCity = async (req: Request, res: Response) => {
const { id } = req.params
const item = await prisma.city.findUnique({
where: { id },
include: { country: { include: { continent: true } } },
})
if (!item) return res.status(404).json({ message: 'City not found' })
res.json(item)
}


export const updateCity = async (req: Request, res: Response) => {
const { id } = req.params
const { nome, populacao, latitude, longitude, countryId } = req.body
const updated = await prisma.city.update({
where: { id },
data: { nome, populacao, latitude, longitude, countryId },
})
res.json(updated)
}


export const deleteCity = async (req: Request, res: Response) => {
const { id } = req.params
await prisma.city.delete({ where: { id } })
res.status(204).send()
}