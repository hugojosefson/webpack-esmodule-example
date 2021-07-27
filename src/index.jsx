import './style.css'
import { resolve } from './async-component.mjs'
import { render } from 'solid-js/web'

const createDivAndAppendTo = parentElement => {
  const element = document.createElement('div')
  parentElement.appendChild(element)
  return element
}

;(async () => {
  const App = await (await resolve(import('./app.jsx')))()
  const root = createDivAndAppendTo(document.body)
  render(() => <App />, root)
})()
