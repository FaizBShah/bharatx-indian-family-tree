const fs = require('fs')
const path = require('path')
const axios = require('axios')

const generateURL = (DCID, ACID, PSID, state) => {
  if (state === 'West Bengal') {
    return `https://ceowestbengal.nic.in/DraftRoll?DCID=${DCID}%20&ACID=${ACID}&PSID=${PSID}`
  }

  if (ACID < 10) {
    ACID = '00' + ACID
  }
  else if (ACID < 100) {
    ACID = '0' + ACID
  }

  if (PSID < 10) {
    PSID = '00' + PSID
  }
  else if (PSID < 100) {
    PSID = '0' + PSID
  }

  return `https://www.elections.tn.gov.in/DRAFTROLL_EN_09112022/dt${DCID}/ac${ACID}/ac${ACID}${PSID}.pdf`
}

async function downloadPdf(DCID, ACID, PSID, state) {  
  const url = generateURL(DCID, ACID, PSID, state)
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