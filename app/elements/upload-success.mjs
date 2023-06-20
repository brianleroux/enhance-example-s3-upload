export default function uploadSuccess ({ html, state }) {
  let key = state.store.key.replace('raw/', '').replace('.har', '')
  return `Processing <a href=/trace/${key}>${key}</a>.`
}
