exports.findFather = (person, electors) => {
  const father = electors.find(elector => elector.name.toLowerCase() === person.fatherName.toLowerCase())
  return father || { name: person.fatherName }
}

exports.findMother = (father, electors) => {
  return electors.find(elector => elector.husbandName.toLowerCase() === father.name.toLowerCase())
}

exports.findPaternalGrandFather = (father, electors) => {
  const grandFather = electors.find(elector => elector.name.toLowerCase() === father.fatherName.toLowerCase())
  return grandFather || { name: father.fatherName }
}

exports.findPaternalGrandMother = (grandFather, electors) => {
  return electors.find(elector => elector.husbandName.toLowerCase() === grandFather.name.toLowerCase())
}

exports.findSiblings = (father, person, electors) => {
  return electors.filter(elector => elector.fatherName.toLowerCase() === father.name.toLowerCase() && elector.name.toLowerCase() !== person.name.toLowerCase())
}

exports.findHusband = (person, electors) => {
  const husband = electors.find(elector => elector.name.toLowerCase() === person.husbandName.toLowerCase())
  return husband || { name: person.husbandName }
}

exports.findWife = (person, electors) => {
  return electors.find(elector => elector.husbandName.toLowerCase() === person.name.toLowerCase())
}

exports.findChildren = (person, electors) => {
  return electors.filter(elector => elector.fatherName.toLowerCase() === person.name.toLowerCase())
}

exports.findFatherInLaw = (husband, electors) => {
  return electors.find(elector => elector.name.toLowerCase() === husband.fatherName.toLowerCase())
}

exports.findMotherInLaw = (fatherInLaw, electors) => {
  return electors.find(elector => elector.husbandName.toLowerCase() === fatherInLaw.name.toLowerCase())
}

exports.findGrandChildren = (children, electors) => {
  let grandchildren = []

  children.forEach(child => {
    const arr = electors.filter(elector => elector.fatherName.toLowerCase() === child.name.toLowerCase())
    grandchildren = [...grandchildren, ...arr]
  })

  return grandchildren
}