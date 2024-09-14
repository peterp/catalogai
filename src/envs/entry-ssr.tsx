import React from 'react'

import memoize from 'lodash/memoize.js'
import { renderToReadableStream } from 'react-dom/server.edge'
import ReactClient from 'react-server-dom-webpack/client.edge'
import { injectRSCPayload } from 'rsc-html-stream/server'
// import NotFoundPage from 'virtual:redwoodjs-not-found-page'
import type { ModuleRunner } from 'vite/module-runner'

import { moduleMap } from './register/ssr.js'

export async function ssrHandler(opts: {
  req: Request
  viteEnvRunnerRSC: ModuleRunner
}) {
  const { req, viteEnvRunnerRSC } = opts
  globalThis.__webpack_require__ = memoize(
    (id: string) => import(/* @vite-ignore */ id),
  )

  // These are dynamic... so... it kinda makes things a bit tough...
  // Somehow during production we need to do things differently.
  // Expose these.

  // Get the page and response status from the URL
  const url = new URL(req.url)
  const { default: Page } = await viteEnvRunnerRSC.import(
    `virtual:redwoodjs-load-page-for-route?pathname=${url.pathname}`,
  )

  // This should be able to distinguish between development
  // and production, maybe this is a virtual module?

  // Let's just focus here. How do we get this file built?
  const { default: App } = await viteEnvRunnerRSC.import(
    'src/__example__/web/src/App.tsx',
  )

  const { rscHandler } = await viteEnvRunnerRSC.import('src/envs/entry-rsc.tsx')
  const rscResult = await rscHandler({
    req,
    Page: () => (
      <App>
        <Page />
      </App>
    ),
  })

  if (new URL(req.url).searchParams.has('__rsc')) {
    return new Response(rscResult.stream, {
      headers: { 'content-type': 'text/x-component; charset=utf-8' },
    })
  }

  const [rscStream1, rscStream2] = rscResult.stream.tee()
  let data: React.Usable<React.ReactNode>
  function Content() {
    data =
      data ??
      ReactClient.createFromReadableStream(rscStream1, {
        ssrManifest: {
          moduleMap: moduleMap(),
          moduleLoading: null,
        },
      })
    return React.use(data)
  }

  const htmlStream = await renderToReadableStream(<Content />)
  const html = htmlStream.pipeThrough(injectRSCPayload(rscStream2))
  return new Response(html, {
    headers: { 'content-type': 'text/html' },
    status: 200,
  })
}
