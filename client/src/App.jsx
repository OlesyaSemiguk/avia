import { BrowserRouter } from 'react-router-dom'
import TicketList from './components/TicketList/TicketList'
import './main.scss'
import AppRouter from './routing/AppRouter'
import { createContext, useEffect, useState } from 'react'
import { fetchTicket } from './http/ticketAPI'

export const Context = createContext()
function App() {
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTicket()
        setTickets(data.data)
        console.log(tickets)
      } catch (error) {
        console.error(error)
      }
    }

    if (tickets.length === 0) {
      fetchData()
    }
  }, [])

  return (
    <BrowserRouter>
      <Context.Provider value={tickets}>
        <AppRouter />
      </Context.Provider>
    </BrowserRouter>
  )
}

export default App
