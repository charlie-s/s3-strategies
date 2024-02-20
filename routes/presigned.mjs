import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import express from 'express'
import s3client from '../s3client.mjs'

// Define file extensions that are allowed. Alternatively, you could have a
// list of mime types.
const ALLOWED_EXTENSIONS = ['jpg', 'png']

// Define max allowed file size.
const MAX_BYTES = 8 * 1024 * 1024

const router = express.Router()

router.get('/presigned', async (req, res) => {
  const { filename } = req.query

  // Define allowed extensions.
  const ext = filename.split('.').pop().toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext.replace('.', ''))) {
    throw new Error(`Extension ${ext} not allowed.`)
  }

  // Generate a "presigned" request for the given filename.
  const presigned = await createPresignedPost(client, {
    Bucket: process.env.BUCKET,
    Key: `${process.env.PREFIX}${filename}`,
    Conditions: [['content-length-range', 100, MAX_BYTES]],
    Fields: { 'Content-Type': mime.getType(ext) },
    Expires: 3600
  })

  res.json(presigned)
})

export default router
