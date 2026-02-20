import socket from 'socket.io-client';


let socketInstance = null;


export const initializeSocket = (projectId) => {

    socketInstance = socket("http://localhost:3000/", {
        auth: {
            token: localStorage.getItem('token')
        },
        query: {
            projectId
        }
    });
    console.log("CONNECTION ESTABLISTED 200");
    return socketInstance;

}

export const receiveMessage = (eventName, cb) => {
    socketInstance.on(eventName, cb);
}

export const sendMessage = (eventName, data) => {
    console.log(`${eventName}, ${data}`);
    socketInstance.emit(eventName, data);
    console.log("MESSAGE SENT 200");
}