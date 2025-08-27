import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const form = new IncomingForm()
  form.uploadDir = path.join(process.cwd(), 'public/uploads/videos')
  
  // Создаем директорию если её нет
  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir, { recursive: true })
  }

  try {
    const { fields, files } = await form.parse(req)
    const videoFile = Array.isArray(files.video) ? files.video[0] : files.video

    if (!videoFile) {
      return res.status(400).json({ message: 'No video file provided' })
    }

    // Генерируем уникальное имя файла
    const fileExtension = path.extname(videoFile.originalFilename || '.mp4')
    const fileName = `video-${Date.now()}${fileExtension}`
    const filePath = path.join(form.uploadDir, fileName)

    // Перемещаем файл в постоянное место
    fs.renameSync(videoFile.filepath, filePath)

    // Возвращаем публичную ссылку
    const publicUrl = `/uploads/videos/${fileName}`

    res.status(200).json({ 
      url: publicUrl,
      fileName: videoFile.originalFilename,
      size: videoFile.size
    })

  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ message: 'Upload failed' })
  }
}