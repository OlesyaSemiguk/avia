import { BrowserRouter } from 'react-router-dom'
import TicketList from './components/TicketList/TicketList'
import './main.scss'
import AppRouter from './routing/AppRouter'
import { createContext, useEffect, useState, useRef } from 'react'
import { fetchTicket } from './http/ticketAPI'

export const Context = createContext()

function App() {
  const [tickets, setTickets] = useState([])
  const [searchParams, setSearchParams] = useState({
    origin: 'BOS',
    destination: 'CHI',
    departureDate: '2024-04-20',
    adults: '1',
  })
  const [isLoading, setIsLoading] = useState(true)
  const fetchInProgress = useRef(false)

  useEffect(() => {
    console.log('seart', searchParams)
    console.log('effect')

    // Если запрос уже выполняется, не делаем новый запрос
    if (fetchInProgress.current) return

    const queryParams = new URLSearchParams(searchParams)
    setIsLoading(true)
    fetchInProgress.current = true

    const fetchData = async () => {
      console.log('fetching data')
      try {
        const data = await fetchTicket(queryParams)
        setTickets(data.data)
        console.log('tickets', tickets)
        setIsLoading(false)
      } catch (error) {
        setTickets([])
        console.error(error)
      } finally {
        fetchInProgress.current = false
      }
    }

    fetchData()

    return () => {
      console.log('return effect')
    }
  }, [searchParams])

  return (
    <BrowserRouter>
      <Context.Provider
        value={{
          tickets,
          setTickets,
          searchParams,
          setSearchParams,
          isLoading,
        }}
      >
        <AppRouter />
      </Context.Provider>
    </BrowserRouter>
  )
}

export default App
