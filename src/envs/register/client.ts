import ReactDomClient from "react-server-dom-webpack/client.browser";

export function createServerReference(id: string, name: string) {
  id = id + "#" + name;
  return ReactDomClient.createServerReference(id, globalThis.__rsc_callServer);
}
