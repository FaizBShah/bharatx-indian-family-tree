const fs = require('fs')
const path = require('path')
const axios = require('axios')

async function downloadPdf(DCID, ACID, PSID) {  
  const url = `https://ceowestbengal.nic.in/DraftRoll?DCID=${DCID}%20&ACID=${ACID}&PSID=${PSID}`
  const filePath = path.resolve(__dirname, 'example.pdf')
  const writer = fs.createWriteStream(filePath)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

module.exports = downloadPdf