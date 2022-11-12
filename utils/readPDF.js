const fs = require('fs')
const path = require('path')
const { PdfData } = require('pdfdataextract')

async function readPDF() {
  const fileStream = fs.readFileSync(path.resolve(__dirname, 'result.pdf'))

  const data = await PdfData.extract(fileStream)

  return data.text
}

module.exports = readPDF