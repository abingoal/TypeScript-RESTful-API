import * as debug from 'debug';
import * as http from 'http';

import App from '../app';

const debugging = debug('gameapi:server');

const port = normalizePort(process.env.PORT || 3000);
App.set('port', port);

const server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * 标准化端口号
 *
 * @param {(number|string)} val 端口号
 * @returns {(number|string|boolean)} 返回值
 */
function normalizePort(val: number|string): number|string|boolean {
  const normalizeport: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(normalizeport)) {
    return val;
  } else if (normalizeport >= 0) {
    return normalizeport;
  }else {
    return false;
  }
}
/**
 * 错误处理
 *
 * @param {NodeJS.ErrnoException} error 抛出异常
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} 需要提升权限`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} 已经在使用中`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * 监听端口
 *
 */
function onListening(): void {
  const addr = server.address();
  const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  debugging(`Listening on ${bind}`);
}
