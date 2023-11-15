import app from './app.js'

const port = 3000

app.listen(port, () => {
    console.log(`Server on port ${port}`);
  });
// import {connectDB} from './db.js'

// connectDB()
// app.listen(3000)
// console.log('Server on port', 3000)
