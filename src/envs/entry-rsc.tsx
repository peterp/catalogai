import { renderToReadableStream } from 'react-server-dom-webpack/server.edge'
import { clientManifest, rscActionHandler } from './register/rsc.js'

export async function rscHandler({ req, Page }: { req: Request; Page: any }) {
  let actionResult: unknown
  if (req.method === 'POST') {
    actionResult = await rscActionHandler(req)
  }

  const stream = renderToReadableStream(<Page />, clientManifest())
  return { stream, actionResult }
}
