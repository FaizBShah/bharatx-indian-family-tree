require('dotenv').config()
const puppeteer = require("puppeteer")
const captcha = require("async-captcha")
const anticaptcha = new captcha(process.env.CAPTCHA_KEY, 2, 10)
const createOcrPdf = require('./createOcrPdf')
const downloadPdf = require('./downloadPdf')
const readPDF = require('./readPDF')
const formatText = require('./formatText')
const getDistrictId = require('./getDistrictId')
const {
  findFather,
  findMother,
  findHusband,
  findWife,
  findSiblings,
  findPaternalGrandFather,
  findPaternalGrandMother,
  findFatherInLaw,
  findMotherInLaw,
  findChildren,
  findGrandChildren
} = require('./findFamilyUtils')
const generateFamilyTree = require('./generateFamilyTree')

async function automateProcess(name, relativeName, age, state) {
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
  const electors = formatText(text)

  const person = electors.find(elector => elector.name.toLowerCase() === name.toLowerCase())
  const father = person.fatherName === '' ? null : findFather(person, electors)
  const mother = father && findMother(father, electors)
  const paternalGrandFather = father?.fatherName && findPaternalGrandFather(father, electors)
  const paternalGrandMother = paternalGrandFather && findPaternalGrandMother(paternalGrandFather, electors)
  const siblings = father && findSiblings(father, person, electors)
  const husband = person.husbandName === '' ? null : findHusband(person, electors)
  const wife = findWife(person, electors)
  const children = findChildren(husband || person, electors)
  const fatherInLaw = husband?.fatherName && findFatherInLaw(husband, electors)
  const motherInLaw = fatherInLaw && findMotherInLaw(fatherInLaw, electors)
  const grandChildren = children && children.length > 0 && findGrandChildren(children, electors)

  const familyTree = generateFamilyTree(
    person,
    father,
    mother,
    paternalGrandFather,
    paternalGrandMother,
    siblings,
    husband,
    wife,
    children,
    fatherInLaw,
    motherInLaw,
    grandChildren
  )

  await browser.close()

  return { persons: familyTree }
}

module.exports = automateProcess