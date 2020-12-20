import { ws } from '../index';

ws.on('connection', () => {
  console.log('connected');
});
