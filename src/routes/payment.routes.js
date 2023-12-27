import {Router} from 'express'
import {getValidPayment} from '../controllers/payment.controller.js'
import { authRequired } from '../middlewares/validateToken.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import {registerSchema, loginSchema} from '../schemas/auth.schema.js'

const router = Router()

router.get('/ValidPayment/:place_id/:service_id/:process_ids/:valid_days/:start_date/:finish_date/:type', getValidPayment)

export default router