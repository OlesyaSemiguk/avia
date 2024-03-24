import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { fetchAirline, fetchTicket } from '../../http/ticketAPI'
import TicketCard from '../TicketCard/TicketCard'
import './TicketList.scss'
import { DatePicker, Select, Spin } from 'antd'
import { Context } from '../../App'
import SearchTicket from '../SearchTicket/SearchTicket'
import SortFilterTicket from '../SortFilterTicket/SortFilterTicket'

const TicketList = () => {
  const { tickets, isLoading } = useContext(Context)
  const [selectedTickets, setSelectedTickets] = useState([])

  useEffect(() => {
    if (tickets && tickets.length) {
      setSelectedTickets([...tickets])

      const uniqueCarrierCodes = new Set()
      const fetchAirlineData = async (airlineCode) => {
        try {
          const savedAirline = localStorage.getItem(airlineCode)
          if (!savedAirline || savedAirline === 'undefined') {
            const airlineName = await fetchAirline(airlineCode)
            localStorage.setItem(airlineCode, airlineName)
          }
        } catch (error) {
          console.error('Error fetching airline data:', error)
        }
      }

      tickets.forEach((ticketItem) => {
        if (ticketItem.itineraries[0].segments) {
          ticketItem.itineraries[0].segments.forEach((segment) => {
            uniqueCarrierCodes.add(segment.carrierCode)
          })
        }
      })

      const uniqueCarrierCodesArray = Array.from(uniqueCarrierCodes)

      uniqueCarrierCodesArray.forEach((carrierCode) => {
        fetchAirlineData(carrierCode)
      })
    } else {
      setSelectedTickets([])
    }
  }, [tickets])

  return (
    <div className="ticket-list">
      <SearchTicket />

      <SortFilterTicket
        data={selectedTickets}
        sortFunction={setSelectedTickets}
      />
      <div className="ticket-list__count">
        Количество результатов {selectedTickets.length}
      </div>
      {isLoading ? <Spin className="ticket-list__spin" size="large" /> : ''}
      {selectedTickets.length === 0 && !isLoading ? (
        <div className="ticket-list__error">
          Билетов нет, попробуте изменить параметры поиска
        </div>
      ) : (
        <div className="ticket-list__tickets">
          {selectedTickets.map((ticket) => {
            return <TicketCard data={ticket} key={ticket.id} />
          })}
        </div>
      )}
    </div>
  )
}

export default TicketList
