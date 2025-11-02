import { Router } from 'express'
import continentRoutes from './continent_routes'
import countryRoutes from './country_routes'
import cityRoutes from './city_routes'
import integrationsRoutes from './integrations_routes'


const router = Router()


router.use('/continents', continentRoutes)
router.use('/countries', countryRoutes)
router.use('/cities', cityRoutes)
router.use('/integrations', integrationsRoutes)


export default router