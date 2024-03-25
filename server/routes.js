const express = require('express')
const Amadeus = require('amadeus')
const router = express.Router()

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
})

//полеты из originLocationCode в destinationLocationCode
router.get('/shopping/flight-offers', async (req, res) => {
  try {
    const { origin, destination, departureDate, adults } = req.query
    const data = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: adults,
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
