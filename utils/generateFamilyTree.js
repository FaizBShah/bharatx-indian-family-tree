const generateFamilyTree = (
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
) => {
  let relations = []

  relations.push({ name: person.name, relation: 'self' })

  if (father) {
    relations.push({ name: father.name, relation: 'father' })
  }

  if (mother) {
    relations.push({ name: mother.name, relation: 'mother' })
  }

  if (paternalGrandFather) {
    relations.push({ name: paternalGrandFather.name, relation: 'paternal grandfather' })
  }

  if (paternalGrandMother) {
    relations.push({ name: paternalGrandMother.name, relation: 'paternal grandmother' })
  }

  if (siblings?.length > 0) {
    relations = [...relations, ...siblings.map(sibling => ({ name: sibling.name, relation: 'sibling' }))]
  }

  if (husband) {
    relations.push({ name: husband.name, relation: 'husband' })
  }

  if (wife) {
    relations.push({ name: wife.name, relation: 'wife' })
  }

  if (children?.length > 0) {
    relations = [...relations, ...children.map(child => ({ name: child.name, relation: 'child' }))]
  }

  if (fatherInLaw) {
    relations.push({ name: fatherInLaw.name, relation: 'father-in-law' })
  }

  if (motherInLaw) {
    relations.push({ name: motherInLaw.name, relation: 'mother-in-law' })
  }

  if (grandChildren?.length > 0) {
    relations = [...relations, ...grandChildren.map(grandchild => ({ name: grandchild.name, relation: 'grandchild' }))]
  }

  return relations
}

module.exports = generateFamilyTree