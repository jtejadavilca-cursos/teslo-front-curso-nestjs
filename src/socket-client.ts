import { Manager, Socket } from 'socket.io-client';


let socket: Socket;
export const connectToServer = (token: string) => {

    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
        extraHeaders: {
            authentication: token
        }
    });

    socket?.removeAllListeners();
    socket = manager.socket('/');

    addListeners();

};

const addListeners = () => {

    const serverStatus = document.querySelector('#server-status')!;
    const clientListHtml = document.querySelector('#client-list')!;

    socket.on('connect', () => {
        serverStatus.innerHTML = 'online - ' + socket.id;
    });

    socket.on('disconnect', () => {
        serverStatus.innerHTML = 'offline';
    });

    socket.on('clients-updated', (clientList) => {
        //serverStatus.innerHTML = 'offline';
        let clientsHtml = '';
        clientList.forEach((client: string) => {
            clientsHtml += `<li>${client}</li>`;
        });
        clientListHtml.innerHTML = clientsHtml;
    });

    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('SUBMIT: messageInput.value / socket.id', messageInput.value, socket.id);
        if(messageInput.value.trim() !== '') {
            socket.emit('message-from-client', {
                id: socket.id,
                message: messageInput.value
            });
            messageInput.value = '';
        }
    });

    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;
    socket.on('message-from-server', (payload: {fullName: string, message:string}) => {
        const newMessage = `<li>
            <strong>${payload.fullName}:</strong>
            <span>${payload.message}</span>
        </li>`;

        messagesUl.innerHTML += newMessage;
    });


    socket.on('wrong-token', (msg) => {
        alert(msg.message);
        socket.disconnect();
    });

}