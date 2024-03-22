import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { fetchAirline, fetchTicket } from '../../http/ticketAPI'
import TicketCard from '../TicketCard/TicketCard'
import './TicketList.scss'
const TicketList = () => {
  const [ticket, setTiket] = useState([])
  const [airlineCache, setAirlineCache] = useState({})

  useEffect(() => {
    //localStorage.clear()
    const fetchData = async () => {
      try {
        const data = await fetchTicket()
        setTiket(() => data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="ticket-list">
      {ticket.map((ticket) => {
        return <TicketCard data={ticket} key={ticket.id} />
      })}
    </div>
  )
}

export default TicketList
