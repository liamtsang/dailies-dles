import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
        <link href='/static/style.css' rel='stylesheet' />
        <link rel="stylesheet" href="https://unpkg.com/pollen-css@4.0.0/pollen.css" />
        <script defer src='/static/client.js'></script>
        <script src='https://unpkg.com/htmx.org@1.9.12'></script>
        <script
          defer
          src='https://cdn.jsdelivr.net/npm/@alpinejs/persist@3.x.x/dist/cdn.min.js'
        ></script>
        <script
          defer
          src='https://cdn.jsdelivr.net/npm/@alpinejs/sort@3.x.x/dist/cdn.min.js'
        ></script>
        <script
          defer
          src='https://cdn.jsdelivr.net/npm/alpinejs@3.13.8/dist/cdn.min.js'
        ></script>
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  )
})
