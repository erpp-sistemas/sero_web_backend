import {Router} from 'express'
import {getMenusUserId} from '../controllers/menu.controller.js'
import { authRequired } from '../middlewares/validateToken.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import {registerSchema, loginSchema} from '../schemas/auth.schema.js'
import * as menuController from '../controllers/menu.controller.js';

const router = Router()

/**
 * Rutas para crud menu.
 * @route DELETE /menus/{id}
 * @group Menús - Operaciones relacionadas con Menús
 * @returns {object} 200 - Menú eliminado exitosamente.
 * @returns {Error} 404 - Menú no encontrado.
 * @returns {Error} 500 - Error interno del servidor.
 */

router.get('/MenusUserId/:user_id', menuController.getMenusUserId)
router.post('/menus', menuController.createMenu);
router.get('/menus', menuController.getAllMenus);
router.put('/menus/:id', menuController.updateMenu);
router.delete('/menus/:id', menuController.deleteMenu);
router.get('/menuByUserAndRol/:user_id/:rol_id', menuController.getMenuByUserAndRol);
router.post('/menusByRolAndUsuario', menuController.createMenuByRolAndUsuario);

//


export default router