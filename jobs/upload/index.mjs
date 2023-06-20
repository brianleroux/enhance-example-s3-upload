//import arc from '@architect/functions'
//import data from '@begin/data'

// export let handler = arc.events.subscribe(fn)

export async function handler (event) {
  console.log('invoked by s3?', event)
  // TODO: process har file and save generated html into dynamodb
  // TODO: read har file and log output
  //let Bucket = event.bucket
  //let Key = event.key

  // save to ddb
  //let table = 'traces'
  //let key = event.key.replace('raw/', '').replace('.har', '')
  //await data.set({ table, key, html: 'file received; processing!' })
}
