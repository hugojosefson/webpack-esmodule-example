import {resolve} from './async-component.mjs'
import {createState, onCleanup} from 'solid-js'
import Image from './image.jsx'

export default async () => {
  const Greeting = await resolve(import('./greeting.jsx'))
  return () => {
    const [state, setState] = createState({count: 0})
    const t = setInterval(() => setState('count', c => c + 1), 1000)

    // remove interval when Component destroyed:
    onCleanup(() => clearInterval(t));

    return () => <main>
      <a href="https://picsum.photos/"><Image src="https://picsum.photos/300/200?grayscale"
                                              title="images via https://picsum.photos/"/></a>
      <Greeting whom={() => state.count}/>
      <p>Welcome. This is a short paragraph; others are not.</p>
      <Greeting whom="corporate ipsum" type="h2"/>
      <p><i>poem from <a href="https://www.cipsum.com/">cipsum.com</a>.</i></p>
      {/*<p>Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to*/}
      {/*  corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the*/}
      {/*  holistic world view of disruptive innovation via workplace diversity and empowerment.</p>*/}
      <p>Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going
        forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud
        solution. User generated content in real-time will have multiple touchpoints for offshoring.</p>
      <div>{state.count}</div>
    </main>

  }
}
