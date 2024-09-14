import ReactServerDomServerEdge from "react-server-dom-webpack/server.edge"


export function registerClientReference(id: string, exportName: string) {
  const reference = ReactServerDomServerEdge.registerClientReference({}, id, exportName)
  return Object.defineProperties(
    {},
    {
      ...Object.getOwnPropertyDescriptors(reference),
      $$async: { value: true },
    },
  )
}

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

export function registerServerReference(
    action: Function,
    id: string,
    name: string,
) {
    if (typeof action !== "function") {
        return action;
    }
    return ReactServerDomServerEdge.registerServerReference(action, id, name);
}
