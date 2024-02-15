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
import taskRoutes from './routes/task.routes.js'
import cors from 'cors'
import paymentRoutes from './routes/payment.routes.js'
import rolRoutes from './routes/rol.routes.js'
import submenuRoutes from './routes/submenu.routes.js'
import permissionRoutes from './routes/permission.routes.js'
import userRoutes from './routes/user.routes.js'
import accessRoutes from './routes/access.route.js'
const app = express()

//Estas lineas se usan cuando se esta trabajando el proyecto a modo local 
//y se comentan cuando se va a subir a produccion
//app.use(cors({
  //  origin: 'http://localhost:5173',
    //credentials: true
//}));

//Estas linas se descomentan cuando se va subir a produccion
 app.use(cors()); 

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser());

app.use('/api', authRoutes)
app.use('/api', menuRoutes)
app.use('/api', placeRoutes)
app.use('/api', accountHistoryRoutes)
app.use('/api', serviceRoutes)
app.use('/api', processRoutes)
app.use('/api', mapRoutes)
app.use('/api', assignmentRoutes)
app.use('/api', taskRoutes)
app.use('/api', paymentRoutes)
app.use('/api', rolRoutes)
app.use('/api',submenuRoutes)
app.use('/api',permissionRoutes)
app.use('/api',userRoutes)
app.use('/api',accessRoutes)


export default app