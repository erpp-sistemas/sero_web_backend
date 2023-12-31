import {Router} from 'express'
import {getPlaceServiceByUserId} from '../controllers/service.controller.js'
import { authRequired } from '../middlewares/validateToken.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import {registerSchema, loginSchema} from '../schemas/auth.schema.js'
import * as serviceController from '../controllers/service.controller.js'
const router = Router()

router.get('/PlaceServiceByUserId/:user_id/:place_id', serviceController.getPlaceServiceByUserId)
// Ruta para crear un nuevo servicio
router.post('/services', serviceController.createService);
// Ruta para obtener todas los servicios
router.get('/services', serviceController.getAllServices);
// Ruta para actualizar un servicio por su ID
router.put('/service/:id', serviceController.updateService);
// Ruta para eliminar un servicio por su ID
router.delete('/services/:id', serviceController.deleteService);

export default router