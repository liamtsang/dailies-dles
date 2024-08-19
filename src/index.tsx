import { Hono } from 'hono'
import { html } from 'hono/html'
import { renderer } from './renderer'

type Bindings = {
  DB: D1Database
  USERNAME: string
  PASSWORD: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(renderer)

app.get('/', (c) => {
  return c.render(
    <>
      <main>
        <section id='saved-links-section'>
          <div id='saved-links-key'>
            <h4>SAVED</h4>
          </div>
          <div x-data="{ handle: (item, position) => {console.log(item + ' ' + position)}}">
            <ul
              id='savedGamesContainer'
              x-sort='handle'
              x-sort:config="{
        group: 'localStorage-example',
        store: {
          get: function (sortable) {
            console.log('DOM items got from x-sort')
            var order = localStorage.getItem(sortable.options.group.name);
            return order ? order.split('|') : [];
          },

          set: function (sortable) {
            var order = sortable.toArray();
            localStorage.setItem(sortable.options.group.name, order.join('|'));
            console.log('DOM items got from x-sort')
          }
        }}"
            >
            </ul>
          </div>
          <form>
            <button id='openLinksButton' type='button' onclick='openLinks()'>
              Open All
            </button>
          </form>
        </section>

        <hr></hr>

        <section id='category-section'>
          <div id='category-section-key'>
            <h4 id='purple-key' onclick='selectColor("purple")'>
              WORDS<span>⬤</span>
            </h4>
            <h4 id='red-key' onclick='selectColor("red")'>
              GEOGRAPHY<span>⬤</span>
            </h4>
            <h4 id='cyan-key' onclick='selectColor("cyan")'>
              TRIVIA<span>⬤</span>
            </h4>
            <h4 id='orange-key' onclick='selectColor("orange")'>
              MOVIES<span>⬤</span>
            </h4>
            <h4 id='yellow-key' onclick='selectColor("yellow")'>
              MUSIC<span>⬤</span>
            </h4>
            <h4 id='blue-key' onclick='selectColor("blue")'>
              VIDEO GAMES<span>⬤</span>
            </h4>
            <h4 id='green-key' onclick='selectColor("green")'>
              OTHER<span>⬤</span>
            </h4>
          </div>
          <div
            id='category-gallery'
            hx-get='/all-categories'
            hx-trigger='load'
          ></div>
        </section>
      </main>
    </>
  )
})

function category_to_color(category: String) {
  switch (category) {
    case 'Geography':
      return 'red-category-button'
    case 'Movies':
      return 'orange-category-button'
    case 'Music':
      return 'yellow-category-button'
    case 'Trivia':
      return 'cyan-category-button'
    case 'Video Games':
      return 'blue-category-button'
    case 'Word':
      return 'purple-category-button'
    default:
      return 'green-category-button'
  }
}

let htmlReturnCache: string 

app.get('/all-categories', async (c) => {
  if (htmlReturnCache) {
    console.log('returned cache')
    return c.html(htmlReturnCache)
  }
  try {
    const [...rows] = await c.env.DB.prepare(
      'SELECT * FROM games ORDER BY category'
    ).raw()
    console.log(rows)
    let htmlReturn = ''
    let i = 0
    rows.map((game) => {
      // 0 Title 1 Link 2 Category 3 Icon
      i++
      const css = category_to_color(game[2] as string)
      let htmlRow = html`
        <div data-link='${game[1]}' draggable='true' class="category-game-item draggable ${css}" style='--i: ${i}'>
          <img src="http://www.google.com/s2/favicons?domain=${game[1]}&sz=256"></img>
          <a data-link='${game[1]}'>${game[0]}</a>
          <button id='save-game-button' onclick="addLinkFromSearch('${game[1]}', '${game[0]}', '${game[3]}')">+</button>
        </div>
      `
      htmlReturn += htmlRow
    })
    htmlReturnCache = htmlReturn
    return c.html(htmlReturn)
  } catch (error) {
    console.log('test' + error)
    return c.text('Error' + error)
  }
})

app.get('/category/:cat', async (c) => {
  const category = c.req.param('cat')
  try {
    const [...rows] = await c.env.DB.prepare(
      'SELECT * FROM games WHERE LOWER(category) LIKE LOWER(?1)'
    )
      .bind(category.trim())
      .raw()
    console.log(rows)
    let htmlReturn = ''
    let i = 0
    rows.map((game) => {
      i++
      // 0 Title 1 Link 2 Category 3 Icon
      let htmlRow = html`
        <div class="category-game-item" style='--i: ${i}'>
          <img src="${game[3]}"></img>
          <a href='${game[1]}' target='_blank'>${game[0]}</a>
          <button id='save-game-button' onclick="addLinkFromSearch('${game[1]}', '${game[0]}', '${game[3]}')">+</button>
        </div>
      `
      htmlReturn += htmlRow
    })
    return c.html(htmlReturn)
  } catch (error) {
    console.log('test' + error)
    return c.text('Error' + error)
  }
})

app.get('/category-other', async (c) => {
  try {
    const [_columns, ...rows] = await c.env.DB.prepare(
      "SELECT * FROM games WHERE category NOT LIKE '%Geography%' AND category NOT LIKE '%Movies%' AND category NOT LIKE '%Music%' AND category NOT LIKE '%Trivia%'  AND category NOT LIKE '%Video Games%' AND category NOT LIKE '%Word%'"
    ).raw()
    let htmlReturn = ''
    rows.map((game) => {
      // 0 Title 1 Link 2 Category 3 Icon
      let htmlRow = html`
        <div class="category-game-item">
          <img src="${game[3]}"></img>
          <a href='${game[1]}' target='_blank'>${game[0]}</a>
          <button id='save-game-button' onclick="addLinkFromSearch('${game[1]}', '${game[0]}', '${game[3]}')">+</button>
        </div>
      `
      htmlReturn += htmlRow
    })
    return c.html(htmlReturn)
  } catch (error) {
    console.log('test' + error)
    return c.text('Error' + error)
  }
})

app.post('/search', async (c) => {
  const key = await c.req.parseBody()
  try {
    const [_columns, ...rows] = await c.env.DB.prepare(
      'SELECT * FROM games WHERE name LIKE ?1'
    )
      .bind(key.search + '%')
      .raw({ columnNames: true })
    console.log('Debug data:')
    console.log(_columns)
    console.log(rows)
    let htmlReturn =
      '<tr><th></th><th>Name</th><th>Category</th><th>Save</th></tr>'
    rows.map((game) => {
      // 0 Title 1 Link 2 Category 3 Icon
      let htmlRow = html`
        <div class="category-game-item">
          <img src="${game[3]}" style="height: 1rem"></img>
          <a href='${game[1]}' target='_blank'>${game[0]}</a>
          <h4>${game[2]}</h4>
          <button id='save-game-button' onclick="addLinkFromSearch('${game[1]}', '${game[0]}', '${game[3]}')">Save</button>
        </div>
      `
      htmlReturn += htmlRow
    })
    return c.html(htmlReturn)
  } catch (error) {
    console.error('error: ' + error)
    return c.text('Error')
  }
})

export default app
