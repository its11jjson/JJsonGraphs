'use strict';

const { createApp } = require('./app');
const logger = require('./utils/logger');

const port = Number(process.env.PORT) || 3000;
createApp().listen(port, () => logger.info('server listening', { port }));
