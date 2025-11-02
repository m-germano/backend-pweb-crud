import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler'
import { enrichCountry, getWeather } from '../controllers/integrations_controller'


const router = Router()
router.post('/countries/enrich', asyncHandler(enrichCountry))
router.get('/weather', asyncHandler(getWeather))
export default router