import app from './app.js'
import { PORT } from './config/env.js';

const port = PORT;

app.listen(port, () => {
  console.log(`Server on port ${port}`);
})