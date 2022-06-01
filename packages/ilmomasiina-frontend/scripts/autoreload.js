try {
  const url = `${window.location.protocol.replace('http', 'ws')}//${window.location.host}/dev-server`;
  const ws = new WebSocket(url);
  ws.addEventListener('open', () => {
    console.info('Connected to dev server');
  });
  ws.addEventListener('message', (e) => {
    if (e.data === 'reload') {
      window.location.reload();
    }
  });
  ws.addEventListener('close', (e) => {
    if (!e.wasClean) {
      console.error('Connection to dev server closed', e.reason);
    }
  });
} catch (err) {
  console.error('Connection to dev server failed', err);
}
