// import express from 'express';
// import morgan from 'morgan';
// import authRoutes from './routes/auth.routes.js';
// import menuRoutes from './routes/menu.routes.js';
// import placeRoutes from './routes/place.routes.js';
// import serviceRoutes from './routes/service.routes.js';
// import processRoutes from './routes/process.routes.js';
// import mapRoutes from './routes/map.routes.js';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// //import connectDB from './config/db.config.js';

// const app = express();
// const port = 3000; // Puedes configurar el puerto como desees

// // Configura CORS
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }));

// app.use(morgan('dev'));
// app.use(express.json());
// app.use(cookieParser());

// // Conecta a la base de datos (puedes manejar múltiples bases de datos aquí)
// connectDB()
//   .then(() => {
//     // Agrega tus rutas
//     app.use('/api', authRoutes);
//     app.use('/api', menuRoutes);
//     app.use('/api', placeRoutes);
//     app.use('/api', serviceRoutes);
//     app.use('/api', processRoutes);
//     app.use('/api', mapRoutes);

//     // Inicia el servidor una vez que la conexión a la base de datos esté establecida
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error('Database connection error:', error);
//   });

// export default app;

import express from 'express'
import morgan from 'morgan'
import authRoutes from './routes/auth.routes.js'
import menuRoutes from './routes/menu.routes.js'
import placeRoutes from './routes/place.routes.js'
import serviceRoutes from './routes/service.routes.js'
import processRoutes from './routes/process.routes.js'
import mapRoutes from './routes/map.routes.js'
import assignmentRoutes from './routes/assignment.routes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { LOCATION_PATH } from './config/env.js'

const app = express()

/* app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})); */

const locationPath = LOCATION_PATH;
console.log(locationPath);
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
app.use(`${locationPath}/api`, assignmentRoutes)

export default app