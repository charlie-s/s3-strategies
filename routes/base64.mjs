import { Upload } from '@aws-sdk/lib-storage'
import express from 'express'
import mime from 'mime'
import s3client from '../s3client.mjs'

const router = express.Router()

router.post('/base64', express.json({ limit: '8MB' }), async (req, res) => {
  const { filename, data } = req.body

  const upload = new Upload({
    client: s3client,
    params: {
      Bucket: process.env.BUCKET,
      Key: `${process.env.PREFIX}${filename}`,
      ContentType: mime.getType(filename.split('.').pop().toLowerCase()),
      Body: Buffer.from(data.split(';base64,').pop(), 'base64')
    }
  })

  const s3Result = await upload.done()
  return res.json(s3Result)
})

export default router
