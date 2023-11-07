import {Router} from 'express'
// Importa los controladores necesarios
import postWorkAssignment from '../controllers/assignment.controller.js';
const router = Router()

// Rutas para la gestión de asignaciones de trabajo
router.post('/WorkAssignment', postWorkAssignment);

export default router;

// import {register, login, logout, verifyToken, profile} from '../controllers/auth.controller.js'
// import { authRequired } from '../middlewares/validateToken.js'
// import {validateSchema} from '../middlewares/validator.middleware.js'
// import {registerSchema, loginSchema} from '../schemas/auth.schema.js'

// const router = Router()

// router.post('/register', register)
// router.post('/login', validateSchema(loginSchema), login)
// router.post('/logout', logout)
// router.get('/verify', verifyToken)
// router.get('/profile', authRequired, profile)

// export default router