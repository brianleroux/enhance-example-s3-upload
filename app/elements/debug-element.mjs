export default function debugElement ({ html, state }) {
  return `<pre>${JSON.stringify(state, null , 2)}</pre>`
}
