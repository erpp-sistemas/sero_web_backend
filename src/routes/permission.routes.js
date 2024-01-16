import {Router} from 'express'
import {getPlaceServiceByUserId} from '../controllers/service.controller.js'
import { authRequired } from '../middlewares/validateToken.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import {registerSchema, loginSchema} from '../schemas/auth.schema.js'
import * as permissionController from '../controllers/permission.controller.js';


const router = Router()



// Sub_Menu_Rol Routes
router.post('/sub_menu_rol', permissionController.createSubMenuRol);
router.get('/sub_menu_rol', permissionController.getAllSubMenuRol);
router.put('/sub_menu_rol/:id', permissionController.updateSubMenuRol);
router.delete('/sub_menu_rol/:id', permissionController.deleteSubMenuRol);
router.get('/sub_menu_rol/rol/:id', permissionController.getSubMenuRolByIdRol);

// Menu_Rol Routes
router.post('/menu_rol', permissionController.createMenuRol);
router.get('/menu_rol', permissionController.getAllMenuRol);
router.put('/menu_rol/:id', permissionController.updateMenuRol);
router.delete('/menu_rol/:id', permissionController.deleteMenuRol);
router.get('/menu_rol/rol/:id', permissionController.getMenuRolByIdRol);

// Menu_Rol_Usuario Routes
router.post('/menu_rol_usuario', permissionController.createMenuRolUsuario);
router.get('/menu_rol_usuario', permissionController.getAllMenuRolUsuario);
router.put('/menu_rol_usuario/:id', permissionController.updateMenuRolUsuario);
router.delete('/menu_rol_usuario/:id', permissionController.deleteMenuRolUsuario);
router.get("/menu-rol-usuario/by-user/:id_usuario",permissionController.getMenuRolUsuarioByUserId);

// Sub_Menu_Rol_Usuario Routes
router.post('/sub_menu_rol_usuario', permissionController.createSubMenuRolUsuario);
router.get('/sub_menu_rol_usuario', permissionController.getAllSubMenuRolUsuario);
router.put('/sub_menu_rol_usuario/:id', permissionController.updateSubMenuRolUsuario);
router.delete('/sub_menu_rol_usuario/:id', permissionController.deleteSubMenuRolUsuario);





export default router