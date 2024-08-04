import { connectToServer } from './socket-client'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h2>Websocket - Client</h2>

    <input id='jwt-token' placeholder='Json Web Token'></input>
    <button id='btn-connect'>Connect</button>

    <span id='server-status'>offline</span>

    <ul id="client-list"></ul>

    <form id="message-form">
      <input type="text" id="message-input" />
    </form>


    <h3>Messages</h3>
    <ul id="messages-ul">

    </ul>

  </div>
`

//connectToServer()

const jwtToken = document.querySelector<HTMLInputElement>('#jwt-token')!;
const btnConnect = document.querySelector<HTMLInputElement>('#btn-connect')!;

btnConnect.addEventListener('click', () => {
  const token = jwtToken.value.trim();

  if(token.length <= 0) {
    alert('Please provide a valid token');
    return;
  }

  connectToServer(token);

});