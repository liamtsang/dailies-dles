import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link href='/static/style.css' rel='stylesheet' />
        <title>Dailies & Dles</title>
        <link
          rel='stylesheet'
          href='https://unpkg.com/pollen-css@4.0.0/pollen.css'
        />
        <script defer src='/static/client.js'></script>
        <script defer src='/static/draggable.js'></script>
        <script src='https://unpkg.com/htmx.org@1.9.12'></script>
        <link rel="apple-touch-icon" sizes="180x180" href="/static/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon-16x16.png"/>
        <link rel="manifest" href="/static/site.webmanifest"/>
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

      </head>
      <body>
        {children}
        <footer>
          made by: <a href="https://www.liamtsang.com" target='_blank'>@liamtsang</a> // submit games to liamtsang@gmail.com
        </footer>
      </body>
    </html>
  )
})
