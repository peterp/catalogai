import ReactServerDomClientBrowser from "react-server-dom-webpack/client.browser"



export function createServerReference(id: string, name: string) {
  id = id + "#" + name;

  

  return ReactServerDomClientBrowser.createServerReference(
    id,
    async () => {
      // TODO: Implement that call server functionality.
      console.log(id)
    }
    //globalThis.$$callServer
  );
}
