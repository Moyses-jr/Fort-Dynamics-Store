// src/modules/uploads/r2.provider.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { env } from '../../config/env'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
})

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export function validateFile(mimetype: string, size: number) {
  if (!ALLOWED_TYPES.includes(mimetype)) {
    return 'Tipo de arquivo não permitido. Use PNG, JPG, SVG ou WebP.'
  }
  if (size > MAX_SIZE_BYTES) {
    return 'Arquivo muito grande. Máximo: 5MB.'
  }
  return null
}

export async function uploadFile(
  buffer: Buffer,
  originalName: string,
  mimetype: string,
  folder = 'arts',
): Promise<{ key: string; url: string }> {
  const ext = path.extname(originalName).toLowerCase()
  const key = `${folder}/${uuidv4()}${ext}`

  await r2.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
      CacheControl: 'public, max-age=31536000',
    }),
  )

  return {
    key,
    url: `${env.R2_PUBLIC_URL}/${key}`,
  }
}

export async function deleteFile(key: string): Promise<void> {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: env.R2_BUCKET,
      Key: key,
    }),
  )
}
