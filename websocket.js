import io from 'socket.io-client';

const socket = io('https://socket-nest.onrender.com', {
    transports: ['websocket'],
});
export default socket;
