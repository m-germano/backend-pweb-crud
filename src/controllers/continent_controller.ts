import { Request, Response } from 'express'
import { prisma } from '../models/prisma'


export const createContinent = async (req: Request, res: Response) => {
const { nome, descricao } = req.body
const created = await prisma.continent.create({ data: { nome, descricao } })
res.status(201).json(created)
}


export const listContinents = async (req: Request, res: Response) => {
const page = Number(req.query.page ?? 1)
const pageSize = Number(req.query.pageSize ?? 10)
const search = String(req.query.search ?? '')


const where = search
? { nome: { contains: search, mode: 'insensitive' as const } }
: undefined


const [items, total] = await Promise.all([
prisma.continent.findMany({
where,
orderBy: { nome: 'asc' },
skip: (page - 1) * pageSize,
take: pageSize,
}),
prisma.continent.count({ where }),
])


res.json({ items, page, pageSize, total })
}


export const getContinent = async (req: Request, res: Response) => {
const { id } = req.params
const item = await prisma.continent.findUnique({ where: { id } })
if (!item) return res.status(404).json({ message: 'Continent not found' })
res.json(item)
}


export const updateContinent = async (req: Request, res: Response) => {
const { id } = req.params
const { nome, descricao } = req.body
const updated = await prisma.continent.update({ where: { id }, data: { nome, descricao } })
res.json(updated)
}


export const deleteContinent = async (req: Request, res: Response) => {
const { id } = req.params
await prisma.continent.delete({ where: { id } })
res.status(204).send()
}