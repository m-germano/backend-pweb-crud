import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler'
import { createContinent, deleteContinent, getContinent, listContinents, updateContinent } from '../controllers/continent_controller'


const router = Router()
router.get('/', asyncHandler(listContinents))
router.get('/:id', asyncHandler(getContinent))
router.post('/', asyncHandler(createContinent))
router.put('/:id', asyncHandler(updateContinent))
router.delete('/:id', asyncHandler(deleteContinent))
export default router