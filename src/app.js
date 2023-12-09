import express from 'express'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import menuRoutes from './routes/menu.routes.js'
import placeRoutes from './routes/place.routes.js'
import serviceRoutes from './routes/service.routes.js'
import processRoutes from './routes/process.routes.js'
import mapRoutes from './routes/map.routes.js'
import assignmentRoutes from './routes/assignment.routes.js'
import accountHistoryRoutes from './routes/accounthistory.routes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express()

/**
 * Esta variable permite ejecutar la aplicacion en el 
 * dominio de digital Ocean erpp.center/sero-web
 * donde /sero-web indica el puerto donde está ejecutandose,
 * cuando locationPath se corre desde local, toma un valor indefinido.
 */
const locationPath = process.env.LOCATION_PATH;

//Estas lineas se usan cuando se esta trabajando el proyecto a modo local 
//y se comentan cuando se va a subir a produccion
app.use(cors({
    origin: process.env.BASE_URL_FRONT,
    credentials: true
}));

//Estas linas se descomentan cuando se va subir a produccion
// app.use(cors()); 

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser());

app.use(`${locationPath}/api`, authRoutes)
app.use(`${locationPath}/api`, menuRoutes)
app.use(`${locationPath}/api`, placeRoutes)
app.use(`${locationPath}/api`, accountHistoryRoutes)
app.use(`${locationPath}/api`, serviceRoutes)
app.use(`${locationPath}/api`, processRoutes)
app.use(`${locationPath}/api`, mapRoutes)
app.use(`${locationPath}/api`, assignmentRoutes)

export default app