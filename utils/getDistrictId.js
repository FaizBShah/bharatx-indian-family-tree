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

module.exports = getDistrictId