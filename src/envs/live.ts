import http from 'node:http'

globalThis.LIVE_CLIENTS = []

export function sendReloadEvent() {
  for (const c of globalThis.LIVE_CLIENTS) {
    if (typeof c !== 'undefined') {
      c.write('event: reload\n')
      c.write('data: \n\n')
    }
  }  
}

export function createLiveServer() {
  http
    .createServer(async (_req, res) => {
      globalThis.LIVE_CLIENTS.push(res)
      res.writeHead(200, {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        connection: "keep-alive",
        "access-control-allow-origin": "*",
      });

      console.log("⚡️ Connected", globalThis.LIVE_CLIENTS.length);
    })
    .listen(8913);
    console.log("⚡️ Listening on http://localhost:8913");
}
