import { BrowserRouter } from 'react-router-dom'
import './main.scss'
import AppRouter from './routing/AppRouter'
import { createContext, useEffect, useState, useRef } from 'react'
import { fetchTicket } from './http/ticketAPI'
import { ConfigProvider } from 'antd'

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
  // useEffect(() => {
  //   localStorage.clear()
  // }, [])
  useEffect(() => {
    // Если запрос уже выполняется, не делаем новый запрос
    if (fetchInProgress.current) return

    const queryParams = new URLSearchParams(searchParams)
    setIsLoading(true)
    fetchInProgress.current = true

    const fetchData = async () => {
      try {
        const data = await fetchTicket(queryParams)
        setTickets(data.data)
        setIsLoading(false)
      } catch (error) {
        setTickets([])
        console.error(error)
      } finally {
        fetchInProgress.current = false
      }
    }

    fetchData()
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
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#3061c2',
              /* here is your global tokens */
            },
          }}
        >
          <AppRouter />
        </ConfigProvider>
      </Context.Provider>
    </BrowserRouter>
  )
}

export default App
