/* eslint-disable */
const ws = new WebSocket('ws://localhost:3000');
console.log(ws);
const ports = [];

const state = {}

ws.addEventListener('message', ({ data }) => {
  ports.forEach(port => {
    port.postMessage(JSON.parse(data))
  })
});

onconnect = event => {
  console.log(event)
  const port = event.ports[0]

  port.onmessage = ({ data }) => {
    ws.send(JSON.stringify({
      event: data.event,
      data: data.payload
    }));
  }

  ports.push(port);
  
}
