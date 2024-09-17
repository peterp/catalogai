import path from "node:path";

import multer from "multer";
import { ulid } from "ulid";

import { createMiddleware, DecoratedRequest } from "@hattip/adapter-node";
import vitePluginReact from "@vitejs/plugin-react";
import { init, parse } from "es-module-lexer";
import type { DevEnvironment } from "vite";
import {
  createServerModuleRunner,
  createServer as createViteServer,
  type PluginOption,
  type Plugin,
} from "vite";
import type { ModuleRunner } from "vite/module-runner";
import express from "express";

// TODO(jgmw): We must set the env var so this function picks up the mock project directory
process.env["RWJS_CWD"] = path.join(import.meta.dirname, "../__example__/");

let viteEnvRunnerRSC: ModuleRunner;
let viteEnvRunnerSSR: ModuleRunner;

export function vitePluginSSR(): PluginOption {
  const plugin: Plugin = {
    name: vitePluginSSR.name,
    configEnvironment(name) {
      if (name !== "ssr") {
        return;
      }

      return {};
    },
    async configureServer(server) {
      const envs = server.environments as Record<
        "ssr" | "client" | "react-server",
        DevEnvironment
      >;
      if (!envs["ssr"]) {
        throw new Error('"ssr" environment is undefined.');
      }
      viteEnvRunnerSSR = createServerModuleRunner(envs["ssr"]);
    },
  };
  return [plugin];
}

function vitePluginRSC(): PluginOption {
  const setupEnvironmentPlugin: Plugin = {
    name: vitePluginRSC.name + ":setupEnvironment",
    config(config, _env) {
      config.environments = config.environments ?? {};
      config.environments["react-server"] = {
        resolve: {
          conditions: ["react-server"],
          noExternal: true,
        },
        dev: {
          optimizeDeps: {
            include: [
              "react",
              "react/jsx-runtime",
              "react/jsx-dev-runtime",
              "react-server-dom-webpack/server.edge",
            ],
          },
        },
      };
    },
    async configureServer(server) {
      // TODO: Determine what's wrong with the "server.environments" type. Report to Vite team?
      const envs = server.environments as Record<
        "ssr" | "client" | "react-server",
        DevEnvironment
      >;
      if (!envs["react-server"]) {
        throw new Error('"react-server" environment is undefined.');
      }
      viteEnvRunnerRSC = createServerModuleRunner(envs["react-server"]);
    },
    hotUpdate(_ctx) {
      // TODO: Implement later.
    },
  };

  return [
    setupEnvironmentPlugin,
    vitePluginRSC_UseClient(),
    vitePluginRSC_UseServer(),
  ];
}

function vitePluginRSC_UseClient(): PluginOption {
  return [
    {
      name: vitePluginRSC_UseClient.name + ":transform",
      async transform(code, id) {
        if (this.environment.name !== "react-server") {
          return;
        }

        if (code.includes('"use client"') || code.includes("'use client'")) {
          // await init;
          let c =
            'import { registerClientReference } from "/src/envs/register/rsc.ts";';
          const [_, exports] = parse(code);
          for (const e of exports) {
            c += `export const ${e.ln} = registerClientReference(${JSON.stringify(id)}, ${JSON.stringify(e.ln)});`;
          }
          return c;
        }
      },
    },
  ];
}

function vitePluginRSC_UseServer(): PluginOption {
  return [
    {
      name: vitePluginRSC_UseServer.name + ":transform",
      async transform(code, id) {
        if (id.includes(".vite/deps")) {
          return;
        }

        if (code.includes('"use server"') || code.includes("'use server'")) {
          if (this.environment.name === "react-server") {
            // TODO: Rewrite the code, but register the "function" against
            let newCode = `\
            import { registerServerReference } from "/src/envs/register/rsc.ts";
          `;
            const [_, exports] = parse(code);
            for (const e of exports) {
              newCode += `\
              registerServerReference(${e.ln}, ${JSON.stringify(id)}, ${JSON.stringify(e.ln)});
            `;
            }

            return `\
            ${code}
            ${newCode}
          `;
          } else if (this.environment.name === "ssr") {
            let newCode = `\
            import { createServerReference } from "/src/envs/register/ssr.ts";
         `;
            const [_, exports] = parse(code);
            for (const e of exports) {
              newCode += `\
              export const ${e.ln} = createServerReference(${JSON.stringify(id)}, ${JSON.stringify(e.ln)})
            `;
            }
            return newCode;
          } else if (this.environment.name === "client") {
            let newCode = `\
            import { createServerReference } from "/src/envs/register/client.ts";
          `;
            const [_, exports] = parse(code);
            for (const e of exports) {
              newCode += `\
              export const ${e.ln} = createServerReference(${JSON.stringify(id)}, ${JSON.stringify(e.ln)})
            `;
            }
            return newCode;
          }
        }
      },
    },
  ];
}

function vitePluginRedwood_Router_NotFoundPage(): PluginOption {
  const virtualModuleId = "virtual:redwoodjs-not-found-page";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  return [
    {
      name: vitePluginRedwood_Router_NotFoundPage.name,
      async resolveId(source) {
        if (source !== virtualModuleId) {
          return undefined;
        }

        // Extract the routes from the AST of the Routes.tsx file
        const { getProjectRoutes } = await import("@redwoodjs/internal");
        const routes = getProjectRoutes();

        // Find the not found route
        const notFoundRoute = routes.find((route) => route.isNotFound);
        if (!notFoundRoute) {
          return resolvedVirtualModuleId;
        }

        // Extract the pages from the project structure
        // TODO(jgmw): Not thrilled about using the deprecated function
        const { processPagesDir } = await import("@redwoodjs/project-config");
        const pages = processPagesDir();

        const notFoundPage = pages.find(
          (page) => page.constName === notFoundRoute.pageIdentifier
        );
        if (!notFoundPage) {
          return resolvedVirtualModuleId;
        }

        // We return the path to page the user specified to handle 404s
        return notFoundPage.path;
      },
      // Load provides a fallback to a default 404 page
      load(id) {
        if (id !== resolvedVirtualModuleId) {
          return undefined;
        }
        // This is the most basic 404 page
        return 'export default () => "404"';
      },
    },
  ];
}

function vitePluginRedwood_LoadPageForRoute(): PluginOption {
  const virtualModuleId = "virtual:redwoodjs-load-page-for-route";
  return [
    {
      name: vitePluginRedwood_LoadPageForRoute.name,
      async resolveId(source) {
        if (!source.startsWith(virtualModuleId)) {
          return undefined;
        }

        // Get the route from the pathname
        const searchParams = new URLSearchParams(
          source.substring(virtualModuleId.length)
        );
        const pathname = searchParams.get("pathname");
        if (!pathname) {
          throw new Error("No pathname provided");
        }

        // Extract the routes from the AST of the Routes.tsx file
        // only use routes.js so internal doesn't run generate on its own
        const { getProjectRoutes } = await import(
          "@redwoodjs/internal/dist/routes.js"
        );
        const routes = getProjectRoutes();

        const { processPagesDir } = await import("@redwoodjs/project-config");
        const pages = processPagesDir();

        const { matchPath } = await import("@redwoodjs/router");

        for (const route of routes) {
          // TODO(jgmw): Handle route params
          const { match } = matchPath(route.pathDefinition, pathname);
          if (match) {
            const page = pages.find(
              (page) => page.constName === route.pageIdentifier
            );
            if (!page) {
              throw new Error(
                `Could not find page for route: ${route.pageIdentifier}`
              );
            }

            return page.path;
          }
        }

        // Fallback to switching the id to the not-found page module
        return this.resolve("virtual:redwoodjs-not-found-page");
      },
    },
  ];
}

async function createServer() {
  await init;

  const app = express();

  const vite = await createViteServer({
    appType: "custom",
    server: {
      middlewareMode: true,
    },
    base: "/",
    clearScreen: false,
    plugins: [
      vitePluginReact(),
      vitePluginRSC(),
      vitePluginSSR(),
      vitePluginRedwood_LoadPageForRoute(),
      vitePluginRedwood_Router_NotFoundPage(),
    ],
    environments: {
      ssr: {},
      "react-server": {},
      client: {},
    },
  });

  app.use(vite.middlewares);

  // setup multer disk storage for file uploads
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/uploads/");
    },
    filename: function (req, file, cb) {
      // using a ULID to avoid conflicts
      // see: https://www.npmjs.com/package/ulid
      const id = ulid();
      const extension = file.originalname.split(".").pop();
      const newFilename = `${file.fieldname}-${id}.${extension}`;
      cb(null, newFilename);
    },
  });

  // setup multer middleware for file uploads
  const upload = multer({ storage });

  // setup endpoint for file uploads
  app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const { originalname, mimetype, size, filename } = req.file;
    console.log(originalname, mimetype, size, filename, "File information");

    // send a response to the client to confirm the file was uploaded
    // and provide a link to the file
    res.send(`
      <html>
        <body>
          <h2>File uploaded successfully!</h2>
          <p>File: ${originalname}</p>
          <p>Type: ${mimetype}</p>
          <p>Size: ${size} bytes</p>
          <p>Saved as: <a href="/uploads/${filename}" target="_blank">${filename}</a></p>
        </body>
      </html>
    `);
  });

  const { ssrHandler } = await viteEnvRunnerSSR.import(
    "/src/envs/entry-ssr.tsx"
  );
  const handler = createMiddleware((ctx) => {
    return ssrHandler({ req: ctx.request, viteEnvRunnerRSC });
  });
  app.use("*", (req, res, next) => {
    req.url = req.originalUrl;
    handler(req as DecoratedRequest, res, next);
  });

  app.listen(8910);
  console.log("Listening on http://localhost:8910");
}

createServer();
