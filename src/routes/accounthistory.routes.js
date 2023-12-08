import {Router} from 'express'
import {getAccountHistoryByCount} from '../controllers/acounthistory.controller.js'
import { authRequired } from '../middlewares/validateToken.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import {registerSchema, loginSchema} from '../schemas/auth.schema.js'
import { duplicatePhoto, getAccountHistoryByParameters, getTaskCatalogData, getUsersByPlaceId, insertPhoto, updateStatePhoto } from '../controllers/accountSearchInformation.controller.js'

const router = Router()

router.get('/AccountHistoryByCount/:plaza/:account/', getAccountHistoryByCount)
router.get('/AccountHistoryByParameters/:plaza/:account/:owner_name/:street/:cologne', getAccountHistoryByParameters)
router.get('/GetTaskCatalog',getTaskCatalogData)
router.post('/InsertPhoto/:plaza/',insertPhoto)
router.get('/GetUsersByPlaceId',getUsersByPlaceId)
router.patch('/UpdatePhotoState',updateStatePhoto)
router.post('/DuplicatePhoto/:plaza/',duplicatePhoto)
export default router