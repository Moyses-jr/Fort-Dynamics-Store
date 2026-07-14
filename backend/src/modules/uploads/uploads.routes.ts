// src/modules/uploads/uploads.routes.ts
import { Router, Request, Response } from 'express'
import multer from 'multer'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { uploadFile, deleteFile, validateFile } from './r2.provider'
import { AppError } from '../../shared/errors/AppError'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

export const uploadsRouter = Router()

uploadsRouter.use(authMiddleware)

uploadsRouter.post('/art', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) throw new AppError('Arquivo não enviado', 400, 'NO_FILE')

  const error = validateFile(req.file.mimetype, req.file.size)
  if (error) throw new AppError(error, 400, 'INVALID_FILE')

  const result = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype)

  res.status(201).json(result)
})

uploadsRouter.delete('/art', async (req: Request, res: Response) => {
  const { key } = req.body as { key?: string }
  if (!key) throw new AppError('Key não informada', 400, 'NO_KEY')

  // Segurança: apenas arquivos da pasta arts/
  if (!key.startsWith('arts/')) throw new AppError('Operação não permitida', 403, 'FORBIDDEN')

  await deleteFile(key)
  res.status(204).send()
})
