import { createState, onCleanup } from 'solid-js'
import html from 'solid-js/html'
import Image from './image.mjs'
import Greeting from './greeting.mjs'

export default () => {
  const [state, setState] = createState({ counter: 0 })
  const timer = setInterval(() => setState('counter', c => c + 1), 1000)
  onCleanup(() => clearInterval(timer))

  return html`
<main>
<a href="https://picsum.photos/"><${Image} src="https://picsum.photos/300/200?grayscale" title="images via https://picsum.photos/"><//></a>
<${Greeting} whom=${() => () => state.counter}/>
<p>Welcome. This is a short paragraph; others are not.</p>
<${Greeting} whom="corporate ipsum" type="h2"/>
<p><i>poem from${' '}<a href="https://www.cipsum.com/">cipsum.com</a>.</i></p>
<p>Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.</p>
<p>Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.</p>
<div>${() => state.counter}</div>
</main>
`
}
