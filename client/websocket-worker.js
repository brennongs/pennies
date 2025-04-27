/* eslint-disable */
const ws = new WebSocket('ws://localhost:3000');
const ports = [];

const state = {}

ws.addEventListener('message', ({ data }) => {
  console.log(data);
  ports.forEach(port => {
    port.postMessage(JSON.parse(data))
  })
});

onconnect = event => {
  const port = event.ports[0]

  if (state.sessionId && state.userId) {
    ws.send(JSON.stringify({
      event: 'user.join',
      payload: {
        sessionId: state.sessionId,
        userId: state.userId
      }
    }));
  }

  port.onmessage = ({ data }) => {
    if (data.event === 'state.save') {
      Object.entries(data.payload).forEach(([key, value]) => {
        state[key] = value
      });
      return;
    };

    ws.send(JSON.stringify({
      event: data.event,
      data: data.payload
    }));
  }

  ports.push(port);
  
}
