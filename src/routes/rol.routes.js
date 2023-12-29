import { Router } from "express";
import { getPlaceServiceByUserId } from "../controllers/service.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import * as rolController from "../controllers/rol.controller.js";
const router = Router();

router.post(
  "/roles",

  rolController.createRol
);
router.get('/roles', rolController.getAllRoles);

router.put(
    '/roles/:id',
    
    rolController.updateRol
  );

  router.delete('/roles/:id', authRequired, rolController.deleteRol);

export default router;
