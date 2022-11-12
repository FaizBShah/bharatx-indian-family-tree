function formatText(pdf) {
  text = []
  pdf.forEach((page) => {
    const arr = page.split('\n')
    text = [...text, ...arr]
  })
  const persons = []
  n = text.length
  let i = 0
  let count = 1

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

      if (fatherIndex !== -1) {
        name = str.substring(0, fatherIndex).split(':')[1].trim()
        fatherName = str.substring(fatherIndex).indexOf(':') !== -1 ? str.substring(fatherIndex).split(':')[1].trim() : str.substring(fatherIndex).split('Name')[1].trim()
      }

      if (husbandIndex !== -1) {
        name = str.substring(0, husbandIndex).split(':')[1].trim()
        husbandName = str.substring(husbandIndex).indexOf(':') !== -1 ? str.substring(husbandIndex).split(':')[1].trim() : str.substring(husbandIndex).split('Name')[1].trim()
      }

      name = name.replace(/\s+/g, ' ').trim()
      fatherName = fatherName.replace(/\s+/g, ' ').trim()
      husbandName = husbandName.replace(/\s+/g, ' ').trim()
      console.log(count, name)
      count++

      persons.push({ name, fatherName, husbandName })
      
      i = j
    }

    i++;
  }

  return persons
}

module.exports = formatText