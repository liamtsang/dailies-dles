import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link href='/static/style.css' rel='stylesheet' />
        <title>Your Page Title</title>
        <link
          rel='stylesheet'
          href='https://unpkg.com/pollen-css@4.0.0/pollen.css'
        />
        <script defer src='/static/client.js'></script>
        <script defer src='/static/draggable.js'></script>
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

        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');
        </style>

        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  )
})
