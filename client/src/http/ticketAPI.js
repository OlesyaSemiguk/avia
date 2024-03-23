export const fetchTicket = async () => {
  const response = await fetch('http://localhost:5000/shopping/flight-offers')
  return response.json()
}
export const fetchAirline = async (airlineCode) => {
  try {
    const resultPromise = await fetch(
      `http://localhost:5000/reference-data/airlines?airlineCodes=${airlineCode}`
    )

    const result = await resultPromise.json()
    console.log('result', result)
    return result.data[0].businessName
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
