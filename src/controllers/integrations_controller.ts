import { Request, Response } from 'express'
import axios from 'axios'


// REST Countries: enrich country data by name
export const enrichCountry = async (req: Request, res: Response) => {
const { nome } = req.body
if (!nome) return res.status(400).json({ message: 'nome is required' })


// Try fullText match first, fallback to generic search
const urls = [
`https://restcountries.com/v3.1/name/${encodeURIComponent(nome)}?fullText=true`,
`https://restcountries.com/v3.1/name/${encodeURIComponent(nome)}`,
]


let data: any[] | null = null
for (const url of urls) {
try {
const resp = await axios.get(url)
data = resp.data
if (Array.isArray(data) && data.length) break
} catch (_e) { /* try next */ }
}


if (!data || !data.length) return res.status(404).json({ message: 'Country not found in REST Countries' })
const c = data[0]


const idiomaOficial = c.languages ? Object.values(c.languages)[0] : undefined
const moeda = c.currencies ? Object.keys(c.currencies)[0] : undefined
const populacao = c.population
const fusoHorario = Array.isArray(c.timezones) ? c.timezones[0] : undefined
const iso2 = c.cca2


res.json({ idiomaOficial, moeda, populacao, fusoHorario, iso2 })
}


// OpenWeatherMap: current weather via lat/lon
export const getWeather = async (req: Request, res: Response) => {
const { lat, lon } = req.query
if (!lat || !lon) return res.status(400).json({ message: 'lat and lon are required' })


const apiKey = process.env.OPENWEATHER_API_KEY
if (!apiKey) return res.status(500).json({ message: 'OPENWEATHER_API_KEY not configured' })


const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`
const { data } = await axios.get(url)
res.json(data)
}