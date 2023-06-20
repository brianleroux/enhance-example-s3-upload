export default function trace ({html, state}) {
  return html`
    <p>${ state.store.html }</p>
    <debug-element></debug-element>
  `
}
