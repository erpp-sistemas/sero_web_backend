import {Router} from 'express'
import {getPlaceServiceByUserId} from '../controllers/service.controller.js'
import { authRequired } from '../middlewares/validateToken.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import {registerSchema, loginSchema} from '../schemas/auth.schema.js'

const router = Router()

router.get('/PlaceServiceByUserId/:user_id/:place_id', getPlaceServiceByUserId)

export default router