const fs = require('fs')
const path = require('path')
const FormData = require('form-data')

require('dotenv').config()

const axios = require('axios')
const puppeteer = require("puppeteer")
const captcha = require("async-captcha")
const anticaptcha = new captcha(process.env.CAPTCHA_KEY, 2, 10)
const { PdfData } = require('pdfdataextract')

const name = 'Keauty Goswami Goswami'
const relativeName = 'Beauty Goswami'
const age = 24

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

async function readPDF() {
  const fileStream = fs.readFileSync(path.resolve(__dirname, 'result.pdf'))

  const data = await PdfData.extract(fileStream)

  return data.text
}

function formatText(pdf) {
  text = []
  pdf.forEach((page) => {
    const arr = page.split('\n')
    text = [...text, ...arr]
  })
  const persons = []
  n = text.length
  let i = 0

  while (i < n) {
    if (text[i].startsWith('Name:')) {
      let str = ''
      let j = i;

      while (!text[j].startsWith('House')) {
        str += ' ' + text[j]
        j++
      }

      let name = '', fatherName = '', husbandName = ''

      const fatherIndex = str.indexOf("Father")
      const husbandIndex = str.indexOf("Husband")

      console.log(str)

      if (fatherIndex !== -1) {
        name = str.substring(0, fatherIndex).split(':')[1].trim()
        fatherName = str.substring(fatherIndex).indexOf(':') !== -1 ? str.substring(fatherIndex).split(':')[1].trim() : str.substring(fatherIndex).split('Name')[1].trim()
      }

      if (husbandIndex !== -1) {
        name = str.substring(0, husbandIndex).split(':')[1].trim()
        husbandName = str.substring(husbandIndex).indexOf(':') !== -1 ? str.substring(husbandIndex).split(':')[1].trim() : str.substring(husbandIndex).split('Name')[1].trim()
      }

      name = name.trim()
      fatherName = fatherName.trim()
      husbandName = husbandName.trim()

      persons.push({ name, fatherName, husbandName })
      
      i = j
    }

    i++;
  }

  return persons
}

const getDistrictId = (district) => {
  const districts = {
    'COOCHBEHAR': 1,
    'JALPAIGURI': 2,
    'DARJEELING': 3,
    'UTTAR DINAJPUR': 4,
    'DAKHSIN DINAJPUR': 5,
    'MALDA': 6,
    'MURSHIDABAD': 7,
    'NADIA': 8,
    'NORTH 24 PARGANAS': 9,
    'SOUTH 24 PARGANAS': 10,
    'KOLKATA SOUTH': 11,
    'KOLKATA NORTH': 12,
    'HOWRAH': 14,
    'HOOGHLY': 15,
    'PURBO MEDINIPUR': 16,
    'PASCHIM MEDINIPUR': 17,
    'PURULIA': 18,
    'BANKURA': 19,
    'PURBA BARDHAMAN': 20,
    'BIRBHUM': 21,
    'ALIPURDUAR': 22,
    'KALIMPONG': 23,
    'JHARGRAM': 24,
    'PASCHIM BARDHAMAN': 25
  }

  return districts[district]
}


async function run() {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.goto("https://electoralsearch.in/", { waitUntil: 'load' })

  const continueBtn = await page.$('#continue')
  await continueBtn.click()

  await page.type('#name1', name)
  await page.type('#txtFName', relativeName)
  await page.select('#ageList', `number:${age}`)
  await page.select('#nameStateList', 'S25')

  const captchaImg = await page.$('#captchaDetailImg')
  const base64String = await captchaImg.screenshot({ encoding: "base64" })
  const captchaCode = await anticaptcha.getResult(base64String)
  console.log(captchaCode)
  await page.type('#txtCaptcha', captchaCode)

  await page.evaluate(() => {
    document.getElementById('btnDetailsSubmit').click()
  })

  await page.waitForSelector('#resultsTable input[value="View Details"]')

  await page.evaluate(() => {
    document.querySelector('#resultsTable input[value="View Details"]').click()
  })

  await new Promise(resolve => setTimeout(resolve, 3000))

  const newPage = (await browser.pages())[2]

  const district = await page.evaluate(() => {
    return document.querySelector('#resultsTable tbody tr').children.item(6).innerText.trim()
  })

  const acId = await newPage.evaluate(() => {
    const textArr = document.getElementById('ac_name').nextElementSibling.innerText.trim().split('-')
    return textArr[textArr.length - 1].trim()
  })

  const partId = await newPage.evaluate(() => {
    return document.getElementById('part_no').nextElementSibling.innerText.trim()
  })

  const districtId = getDistrictId(district)

  console.log(district, districtId, acId, partId)

  const downloadPromise = await downloadPdf(districtId, acId, partId)
  await downloadPromise
  
  const ocrPromise = await createOcrPdf()
  await ocrPromise

  const text = await readPDF()
  const persons = formatText(text)

  console.log(persons)

  await browser.close()
}

run();
