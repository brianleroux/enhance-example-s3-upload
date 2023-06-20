import arc from '@architect/functions'

export async function get (req) {
  let services = await arc.services()
  return { json: { bucket: services.upload.bucket }}
}
