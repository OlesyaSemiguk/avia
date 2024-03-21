const express = require('express')
const Amadeus = require('amadeus')
const router = express.Router()

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
})

//полеты из originLocationCode в destinationLocationCode
router.get('/getFlightDestinations', async (req, res) => {
  try {
    const data = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: 'BOS',
      destinationLocationCode: 'CHI',
      departureDate: '2024-04-20',
      adults: '1',
    })
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

//авиакомпания по коду
router.get('/reference-data/airlines', async (req, res) => {
  try {
    const airlineCode = req.query.airlineCodes
    const data = await amadeus.referenceData.airlines.get({
      airlineCodes: airlineCode,
    })
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router
