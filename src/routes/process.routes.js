import {Router} from 'express'
import * as processController from '../controllers/process.controller.js';
import { authRequired } from '../middlewares/validateToken.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import {registerSchema, loginSchema} from '../schemas/auth.schema.js'

const router = Router()

router.get('/PlaceServiceProcessByUserId/:user_id', processController.getPlaceServiceProcessByUserId)
// Ruta para crear un nuevo proceso
router.post('/processes', processController.createProcess);
// Ruta para obtener todos los procesos
router.get('/processes', processController.getAllProcesses);
// Ruta para actualizar un proceso por su ID
router.put('/processes/:id', processController.updateProcess);
export default router