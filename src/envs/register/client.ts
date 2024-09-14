import ReactServerDomClientBrowser from "react-server-dom-webpack/client.browser"

export function clientManifest() {
  return new Proxy<ClientManifest>(
    {},
    {
      get(_, key) {
        if (typeof key !== "string") {
          throw new Error('clientManifest "key" is not a string');
        }
        const [id, name] = key.split("#");
        return { id, name, chunks: [] };
      },
    }
  );
}

export function createServerReference(id: string, name: string) {
  id = id + "#" + name;
  //console.log(ReactServerDomClientBrowser)
  // return ReactServerDomClientBrowser.createServerReference(
  //   id,
  //   () => {}
  //   //globalThis.$$callServer
  // );
}
