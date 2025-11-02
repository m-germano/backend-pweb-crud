import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler'
import { createCountry, deleteCountry, getCountry, listCountries, updateCountry } from '../controllers/country_controller'


const router = Router()
router.get('/', asyncHandler(listCountries))
router.get('/:id', asyncHandler(getCountry))
router.post('/', asyncHandler(createCountry))
router.put('/:id', asyncHandler(updateCountry))
router.delete('/:id', asyncHandler(deleteCountry))
export default router