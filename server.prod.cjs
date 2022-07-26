// @ts-check
const fs = require('fs')
const path = require('path')
const express = require('express')
const resolve = (p) => path.resolve(__dirname, p)

const manifest = require('./dist/client/ssr-manifest.json')

const app = express()

/**
 * @type {import('vite').ViteDevServer}
 */
app.use(require('compression')())
app.use(
  "/mobile-assets",
  express.static(path.join(__dirname, "./dist/client", "mobile-assets"))
);


app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace('/mobile/', '/');

    const template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    const render = require('./dist/node/entry-server.js').render

    const [appHtml, preloadLinks] = await render(url, manifest)

    const html = template
      .replace(`<!--preload-links-->`, preloadLinks)
      .replace(`<!--ssr-outlet-->`, appHtml)

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
