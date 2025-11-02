import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler'
import { createCity, deleteCity, getCity, listCities, updateCity } from '../controllers/city_controller'


const router = Router()
router.get('/', asyncHandler(listCities))
router.get('/:id', asyncHandler(getCity))
router.post('/', asyncHandler(createCity))
router.put('/:id', asyncHandler(updateCity))
router.delete('/:id', asyncHandler(deleteCity))
export default router