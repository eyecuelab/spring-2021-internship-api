if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
  console.log('loading env', process.env.NODE_ENV);
  // eslint-disable-next-line
  require('./LoadEnv'); // Must be the first import
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
