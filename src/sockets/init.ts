import { ws } from '../index';

ws.on('connection', (socket) => {
  console.log({ ...socket });
});
