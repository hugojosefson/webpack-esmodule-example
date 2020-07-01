import {resolve} from './async-component.mjs'
import {render} from 'solid-js/dom'

(async () => {
  const App = await (await resolve(import('./app.jsx')))()
  render(() => <App/>, document.getElementById('root'))
})()
