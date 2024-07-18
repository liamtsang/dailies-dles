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

      <section>
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
          ></ul>
        </div>
        <form>
          <button id='openLinksButton' type='button' onclick='openLinks()'>
           Open Links <img src="/static/icon.svg"></img>
          </button>
        </form>
      </section>

      <section>
        <form>
          <input id='userLinkInput' placeholder='link'></input>
          <input id='userTitleInput' placeholder='Title'></input>
          <button id='userLinkButton' type='button' onclick='addLink()'>
            Submit
          </button>
        </form>
        <form>
          <button id='clearButton' type='button' onclick='clearAll()'>
            Clear
          </button>
        </form>
        <form>
          <input
            type='search'
            name='search'
            placeholder='Search'
            hx-post='/search'
            hx-trigger='input changed delay:100ms, search'
            hx-target='#search-results'
          ></input>
          <input style='display: none'></input>
        </form>
        <table id='search-results'></table>
      </section>

      </main>
    </>
  )
})

app.post('/search', async (c) => {
  const key = await c.req.parseBody()
  try {
    const [_columns, ...rows] = await c.env.DB.prepare(
      'SELECT * FROM games WHERE name LIKE ?1 LIMIT 10'
    )
      .bind(key.search + '%')
      .raw({ columnNames: true })
    console.log("Debug data:")
    console.log(_columns)
    console.log(rows)
    let htmlReturn =
      '<tr><th></th><th>Name</th><th>Category</th><th>Save</th></tr>'
    rows.map((game) => {
      // 0 Title 1 Link 2 Category 3 Icon
      let htmlRow = html`
        <tr>
          <td><img src="${game[3]}" style="height: 1rem"></img></td>
          <td><a href='${game[1]}'>${game[0]}</a></td>
          <td>${game[2]}</td>
          <td><button onclick="addLinkFromSearch('${game[1]}', '${game[0]}', '${game[3]}')">Save Game</button></td>
        </tr>
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
