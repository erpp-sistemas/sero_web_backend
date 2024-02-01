import {registerSchema, loginSchema} from '../schemas/auth.schema.js'
import * as accessController from '../controllers/access.controller.js';
import { Router } from 'express';

const router = Router()

router.get('/AccessUsers/:usuario', accessController.getUserById);
router.put('/updateAccessUserById/:id_acceso', accessController.updateAccesUserById);


export default router