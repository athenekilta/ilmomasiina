try {
  const url = `${window.location.protocol.replace('http', 'ws')}//${window.location.host}/dev-server`;
  const ws = new WebSocket(url);
  ws.addEventListener('open', () => {
    console.info('Connected to dev server');
  });
  ws.addEventListener('message', (e) => {
    const data = JSON.parse(e.data);
    if (data.reload) {
      window.location.reload();
      return;
    }
    if (data.error) {
      console.error('Build failed!');
    }
    if (data.build) {
      data.build.errors?.forEach((error) => {
        console.error(error.text.replace(/\x1b\[.+?m/g, ''));
      });
      data.build.warnings?.forEach((warning) => {
        console.warn(warning.text.replace(/\x1b\[.+?m/g, ''));
      });
      if (!data.build.errors?.length && !data.build.warnings?.length) {
        console.info('No errors!');
      }
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
