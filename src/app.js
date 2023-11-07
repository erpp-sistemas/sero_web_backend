import express from 'express'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import menuRoutes from './routes/menu.routes.js'
import placeRoutes from './routes/place.routes.js'
import serviceRoutes from './routes/service.routes.js'
import processRoutes from './routes/process.routes.js'
import mapRoutes from './routes/map.routes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express()

/* app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})); */

const locationPath = process.env.LOCATION_PATH;

app.use(cors());

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser());

app.use(`${locationPath}/api`, authRoutes)
app.use(`${locationPath}/api`, menuRoutes)
app.use(`${locationPath}/api`, placeRoutes)
app.use(`${locationPath}/api`, serviceRoutes)
app.use(`${locationPath}/api`, processRoutes)
app.use(`${locationPath}/api`, mapRoutes)

export default app