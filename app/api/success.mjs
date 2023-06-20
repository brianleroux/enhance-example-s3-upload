export async function get (req) {
  // share the query params w the page store
  return { json: req.query }
}
