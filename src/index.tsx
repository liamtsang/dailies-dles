import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

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
      <button id="clearButton" type="button" onclick="clearAll()">Submit</button>
    </form>
    </>
  )
})

export default app
