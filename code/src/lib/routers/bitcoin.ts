import { Router } from 'express'
import controllers from '../controllers/bitcoin'

const router = Router()

router.put(`/bitcoin`, controllers.put)
router.get(`/bitcoin`, controllers.get)

export default router
