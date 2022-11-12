const getTamilDistrictId = (district) => {
  const districts = {
    'thiruvallur': 1,
    'chennai': 2,
    'kanchipuram': 3,
    'vellore': 4,
    'krishnagiri': 5,
    'dharmapuri': 6,
    'thiruvannamalai': 7,
    'vigilance': 8,
    'salem': 9,
    'namakkal': 10,
    'erode': 11,
    'nilgiris': 12,
    'coimbatore': 13,
    'dindigul': 14,
    'karur': 15,
    'tiruchirappalli': 16,
    'perambalur': 17,
    'cuddalore': 18,
    'nagapattinam': 19,
    'tiruvarur': 20,
    'thanjavur': 21,
    'pudukottai': 22,
    'sivaganga': 23,
    'madurai': 24,
    'honey': 25,
    'virudhunagar': 26,
    'ramanathapuram': 27,
    'tuticorin': 28,
    'tirunelveli': 29,
    'kanyakumari': 30,
    'ariyalur': 31,
    'tirupur': 32,
    'forgery': 33,
    'tenkasi': 34,
    'bricked': 35,
    'tirupattur': 36,
    'ranippet': 37,
    'mayiladuthurai': 38
  }

  return districts[district]
}

module.exports = getTamilDistrictId