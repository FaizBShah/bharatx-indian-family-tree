const fs = require('fs')
const path = require('path')
const FormData = require('form-data')
require('dotenv').config()
const axios = require('axios')

async function createOcrPdf() {
  const formData = new FormData()
  const filePath = path.resolve(__dirname, 'result.pdf')
  const writer = fs.createWriteStream(filePath)

  formData.append('instructions', JSON.stringify({
    parts: [
      {
        file: "scanned"
      }
    ],
    actions: [
      {
        type: "ocr",
        language: "english"
      }
    ]
  }))

  formData.append('scanned', fs.createReadStream(path.resolve(__dirname, 'example.pdf')))

  const response = await axios.post('https://api.pspdfkit.com/build', formData, {
    headers: formData.getHeaders({
        'Authorization': `Bearer ${process.env.OCR_KEY}`
    }),
    responseType: "stream"
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

module.exports = createOcrPdf