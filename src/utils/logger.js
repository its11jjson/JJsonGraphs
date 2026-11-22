'use strict';

function log(level, message, meta = {}) {
  const entry = { time: new Date().toISOString(), level, message, ...meta };
  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (process.env.NODE_ENV !== 'test') console.log(line);
}

module.exports = {
  info: (msg, meta) => log('info', msg, meta),
  error: (msg, meta) => log('error', msg, meta),
};
