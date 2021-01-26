export default ({ whom, type = 'h1' }) => (
  // eslint-disable-next-line react/jsx-no-undef
  <Dynamic component={type}>Hello, {whom}!</Dynamic>
)
