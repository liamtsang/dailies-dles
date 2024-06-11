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
    <div x-data="{ handle: (item, position) => {console.log(item + ' ' + position)}}">
      <ul id="linksContainer" x-sort="handle"
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
      <input id="userLinkInput"></input>
      <button id="userLinkButton" type="button" onclick="addLink()">Submit</button>
    </form>
    <form>
      <button id="clearButton" type="button" onclick="clearAll()">Clear</button>
    </form>
    <form>
      <button id="openLinksButton" type="button" onclick="openLinks()">Open Links</button>
    </form>

    <form>
      <input 
          type="search"
          name="search"
          placeholder='Search'
          hx-post="/search"
          hx-trigger="input changed delay:100ms, search"
          hx-target="#search-results"
      ></input>
    </form>
    <table id="search-results">
      <tr>
          <th>Name</th>
          <th>Link</th>
          <th>Category</th>
          <th>Link</th>
      </tr>
    </table>
    </>
  )
})

app.post('/search', async(c) => {
  const key = await c.req.parseBody()
  try {
    const [columns, ...rows] = await 
      c.env.DB.prepare('SELECT * FROM games WHERE name LIKE ?1 LIMIT 10')
      .bind(key.search + '%')
      .raw({columnNames: true})
    console.log('columns: ' + columns)
    console.log('rows: ' + rows)
    let htmlReturn = '<tr><th>Name</th><th>Link</th><th>Category</th><th>Link</th></tr>'
    rows.map((game) => {
      // 0 Title 1 Link 2 Category 3 Icon 
      let htmlRow = html`
        <tr>
          <td><img src="${game[3]}" style="height: 1rem"></img></td>
          <td>${game[0]}</td>
          <td><a href='${game[1]}'>Link</a></td>
          <td>${game[2]}</td>
          <td><button onclick="addLinkFromSearch('${game[1]}')">Save Game</button></td>
        </tr>
      `
      htmlReturn += htmlRow
    })
    return c.html(htmlReturn)
  } catch(error) {
    console.error('error: '+error)
    return c.text('Error')
  }
})

export default app
