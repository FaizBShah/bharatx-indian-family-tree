const express = require('express')
const familyTreeRouter = require('./routes/api/familyTree')

const app = express()

app.use('/api', familyTreeRouter)

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));