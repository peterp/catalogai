import reactServerDomClientEdge from "react-server-dom-webpack/client.edge";

export function moduleMap() {
  return new Proxy(
    {},
    {
      get(_, id: string) {
        return new Proxy<ClientManifest>(
          {},
          {
            get(_, name) {
              return {
                id,
                name,
                chunks: [],
              }
            },
          },
        )
      },
    },
  )
}



export function createServerReference(id: string, name: string) {
  id = id + "#" + name;
  return reactServerDomClientEdge.createServerReference(id, (...args: unknown[]) => {
    throw new Error("unexpected callServer during SSR");
  });
}

