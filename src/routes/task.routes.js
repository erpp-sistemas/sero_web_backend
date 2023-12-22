import {Router} from 'express'
import {getPlaceServiceByUserId} from '../controllers/service.controller.js'
import { authRequired } from '../middlewares/validateToken.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import {registerSchema, loginSchema} from '../schemas/auth.schema.js'
import * as taskController from '../controllers/task.controller.js';
const router = Router()

router.post('/task', taskController.createTask);
router.get('/tasks', taskController.getAllTasks);
// Ruta para actualizar una tarea por su ID
router.put('/tasks/:id', taskController.updateTask);


export default router