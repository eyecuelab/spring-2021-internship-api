if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  console.log('loading env', process.env.NODE_ENV);
  require('./LoadEnv'); // Must be the first import
  console.log(process.env.CLIENT_URL);
}
import app from './Server';
import logger from './shared/Logger';
import { initializeDB } from './db';

async function startSever() {
  // init database
  await initializeDB();

  // Start the server
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
  });
}

startSever();
