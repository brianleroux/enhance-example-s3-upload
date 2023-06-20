import arc from '@architect/functions'

export async function get (req) {
  // notify a Lambda we wrote to S3
  await arc.events.publish({
    name: 'upload',
    payload: req.query
  })
  // share the query params w the page store
  return { json: req.query }
}
