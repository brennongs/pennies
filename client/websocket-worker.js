/* eslint-disable */
onconnect = event => {
  const ws = new WebSocket('ws://localhost:3000');
  const port = event.ports[0];

  port.onmessage = ({ data }) => {
    ws.send(JSON.stringify({
      event: data.event,
      data: data.payload
    }));
  }
  
  ws.addEventListener('message', ({ data }) => {
    port.postMessage(JSON.parse(data))
  });
}
