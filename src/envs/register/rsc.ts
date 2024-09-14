import ReactDomServer from "react-server-dom-webpack/server.edge"

export function registerClientReference(id: string, exportName: string) {
  const reference = ReactDomServer.registerClientReference({}, id, exportName)
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
    return ReactDomServer.registerServerReference(action, id, name);
}

export async function rscActionHandler(req: Request) {
  const url = new URL(req.url)
  const body = await req.text()
  const args = await ReactDomServer.decodeReply(body)

  const actionId = url.searchParams.get('__rsc_action_id')
  if (!actionId) {
      throw new Error('"__rsc_action_id" is undefined.')
  }
  
  const [file, name] = actionId.split('#')
  const module = await import(/* @vite-ignore */ file!)
  const result = await module[name!](...args)
  return result
}
