import crypto from 'crypto'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890ABCDEFGHJKLMNOPQRSTUVWXYZ', 6)

export default function s3form ({ html, state }) {
  let bukkit = 'beginappstaging-privatebucket-1fmhvc535fslv' || process.env.PRIVATE_BUCKET
  let action = `https://${ bukkit }.s3.${process.env.AWS_REGION}.amazonaws.com/`
  let key = `raw/${nanoid()}.har` 
  let redirect = process.env.OWNER_REDIRECT
  let accessKey = process.env.OWNER_KEY
  let secret = process.env.OWNER_SECRET 
  let policy = Buffer.from(JSON.stringify({ 
    expiration: new Date(Date.now() + 600000).toISOString(),
    conditions: [
      {"bucket": bukkit },
      ["starts-with", "$key", 'raw'],
      {"acl": "public-read"},
      {"success_action_redirect": redirect},
      ["starts-with", "$Content-Type", "application/"]
    ]
  })).toString('base64')
  let sig = crypto.createHmac('sha1', secret).update(policy).digest('base64')
  return `
    <form action="${action}" method=post enctype=multipart/form-data>
      <input type=hidden name=key value="${key}">
      <input type=hidden name=acl value=public-read>
      <input type=hidden name=success_action_redirect value="${redirect}">
      <input type=hidden name=Content-Type value=application/json>
      <input type=hidden name=AWSAccessKeyId value="${accessKey}">
      <input type=hidden name=Policy value="${policy}">
      <input type=hidden name=Signature value="${sig}">
      <input type=file name=file>
      <button>Upload</button>
    </form>
  `
}
