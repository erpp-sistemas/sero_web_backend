import { Router } from "express";
import { getPlaceServiceByUserId } from "../controllers/service.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import * as submenuController from "../controllers/submenus.controller.js";
const router = Router();

// Create a new sub-menu
router.post("/submenus", submenuController.createSubMenu);

// Get all sub-menus
router.get("/submenus", submenuController.getAllSubMenus);

// Update a specific sub-menu by ID
router.put("/submenus/:id", submenuController.updateSubMenu);

// Delete a specific sub-menu by ID
router.delete("/submenus/:id", submenuController.deleteSubMenu);

//
router.post("/submenusByRolAndUsuario", submenuController.createSubMenuByRolAndUsuario);

export default router;
