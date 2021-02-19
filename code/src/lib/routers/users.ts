import { Router } from 'express'
import controllers from '../controllers/users'

const router = Router()

router.post(`/users`, controllers.create)
router.get(`/users/:id`, controllers.get)
router.put(`/users/:id`, controllers.put)
router.get(`/users/:id/balance`, controllers.balance.get)
router.post(`/users/:id/bitcoins`, controllers.bitcoins.action)
router.post(`/users/:id/usd`, controllers.usd.action)

export default router
