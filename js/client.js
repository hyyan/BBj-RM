; (() => {
  const socket = io("ws://localhost:[port]")

  socket.on("reload css", name => {
    const links = document.getElementsByTagName("link");
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      if (link.rel !== "stylesheet") continue;

      const filename = link.href.split('/').pop().split('#')[0].split('?')[0]
      if (filename === name) {
        const g = link.href.replace(/(&|\?)bbj-rm=\d+/, '');
        link.href = g + (g.match(/\?/) ? '&' : '?');
        link.href += 'bbj-rm=' + (new Date().valueOf());
      }
    }
  })

  socket.on("reload page", () => {
    location.reload();
  })
})();