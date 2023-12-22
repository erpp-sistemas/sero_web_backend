import {Router} from 'express'
import * as processController from '../controllers/process.controller.js';
import { authRequired } from '../middlewares/validateToken.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import {registerSchema, loginSchema} from '../schemas/auth.schema.js'

const router = Router()

router.get('/PlaceServiceProcessByUserId/:user_id', processController.getPlaceServiceProcessByUserId)
// Ruta para crear un nuevo proceso
router.post('/processes', processController.createProcess);

export default router