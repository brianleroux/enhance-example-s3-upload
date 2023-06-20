import data from '@begin/data'

export async function get (req) {
  let table = 'traces'
  let key = req.params.har
  let trace = await data.get({table, key})
  let html = trace.html || 'Still processing; refresh in a few seconds'
  return { json: { html } }
}

