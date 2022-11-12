const express = require('express')
const router = express.Router()
const HTTPError = require('../../utils/errorHandler')
const automateProcess = require('../../utils/automateProcess')

router.get('/familytree', async (req, res) => {
  try {
    const { name, relativeName, age, state } = req.query

    if (!name) throw new HTTPError(400, 'Name missing')

    if (!relativeName) throw new HTTPError(400, "Relative's Name missing")

    if (!age) throw new HTTPError(400, 'Age missing')

    if (!state) throw new HTTPError(400, 'State missing')

    const data = await automateProcess(name, relativeName, age, state)

    res.status(200).json(data)
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to fetch the family tree' })
  }
})

module.exports = router