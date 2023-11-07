import app from './app.js'
import { PORT } from './config/env.js';

const port = PORT

app.listen(port, () => {
    console.log(`Server on port ${port}`);
  });
// import {connectDB} from './db.js'

// connectDB()
// app.listen(3000)
// console.log('Server on port', 3000)
