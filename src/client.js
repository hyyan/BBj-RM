; (() => {
  "use strict";
  const ws = new WebSocket("ws://localhost:[port]");
  const log = (msg, type = "info") => {
    const date = new Date();
    const prefix = `[${date.toLocaleString()}]`;
    const types = {
      info: 'background-color: #5555FF; color: white; border: 1px solid #5555FF; border-radius: 3px; padding: 2px 5px;',
      success: 'background-color: #00AA00; color: white; border: 1px solid #55FF55; border-radius: 3px; padding: 2px 5px;',
      warning: 'background-color: #AA5500; color: white; border: 1px solid #FFAA55; border-radius: 3px; padding: 2px 5px;',
      error: 'background-color: #AA0000; color: white; border: 1px solid #FF5555; border-radius: 3px; padding: 2px 5px;',
    }
    console.log(`%c${prefix}: bbj-rm\x1B[m ${msg}`, types[type]);
  }

  ws.onopen = function (e) {
    log('Connected to bbj-rm server', 'success');
  };

  ws.onclose = function (event) {
    if (event.wasClean) {
      log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`, 'warning');
    } else {
      log('Connection died', 'error');
    }
  };

  ws.onmessage = function (event) {
    const payload = JSON.parse(event.data);
    const action = payload.action;
    const data = payload.data;

    if (action === "reload page") {
      window.location.reload();
    }

    if (action === "reload css") {
      const links = document.getElementsByTagName("link");
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.rel !== "stylesheet") continue;

        const filename = link.href.split('/').pop().split('#')[0].split('?')[0]
        if (filename === data.path) {
          const g = link.href.replace(/(&|\?)bbj-rm=\d+/, '');
          link.href = g + (g.match(/\?/) ? '&' : '?');
          link.href += 'bbj-rm=' + (new Date().valueOf());
        }
      }
    }
  };
})();