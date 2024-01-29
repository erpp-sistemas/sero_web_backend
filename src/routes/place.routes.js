import { Router } from "express";
import * as placeController from '../controllers/place.controller.js';

const router = Router();

router.get("/PlaceByUserId/:user_id", placeController.getPlaceByUserId);
router.get("/PlaceById/:place_id", placeController.getPlaceById);
router.get('/PlaceServiceByUserId/:user_id/:place_id', placeController.getPlaceServiceByUserId);
router.get('/getProcessesByUserPlaceAndServiceId/:user_id/:place_id/:service_id', placeController.getProcessesByUserPlaceAndServiceId);
router.get('/places/user/:user_id', placeController.getPlaceByUserId);
router.get('/places/:place_id', placeController.getPlaceById);
router.post('/places', placeController.createPlaza);
router.delete('/places/:id', placeController.deletePlaza);
router.get('/places', placeController.getAllPlazas);
router.put('/places/:id', placeController.updatePlaza);
router.post("/userPlazaServiceProcess", placeController.createUserPlazaServiceProcess);

export default router;
