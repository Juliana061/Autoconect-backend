require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { startAlertScheduler } = require('./services/alertScheduler');

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  startAlertScheduler();
  app.listen(PORT, () => console.log(`Servidor AutoConnect corriendo en http://localhost:${PORT}`));
}

start();
