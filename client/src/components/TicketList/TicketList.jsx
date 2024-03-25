import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { fetchAirline } from '../../http/ticketAPI'
import TicketCard from '../TicketCard/TicketCard'
import './TicketList.scss'
import { Spin } from 'antd'
import { Context } from '../../App'
import SearchTicket from '../SearchTicket/SearchTicket'
import SortFilterTicket from '../SortFilterTicket/SortFilterTicket'

const TicketList = () => {
  const { tickets, isLoading } = useContext(Context)
  const [selectedTickets, setSelectedTickets] = useState([])
  const [filterTickets, setFilterTickets] = useState([])
  const [airlineNamesLoaded, setAirlineNamesLoaded] = useState(false)

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
          setTimeout(async () => {
            await fetchAirlineData(airlineCode)
          }, 1000)
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
      const fetchAirlineNames = async () => {
        for (const carrierCode of uniqueCarrierCodesArray) {
          await fetchAirlineData(carrierCode)
        }
        setAirlineNamesLoaded(true)
      }

      fetchAirlineNames()
    } else {
      setSelectedTickets([])
    }
    console.log('selectedTickets', selectedTickets)
  }, [tickets])
  useEffect(() => {}, [airlineNamesLoaded])
  return (
    <div className="ticket-list">
      <SearchTicket />

      <SortFilterTicket data={filterTickets} sortFunction={setFilterTickets} />
      <div className="ticket-list__count">
        Количество результатов {filterTickets.length}
      </div>
      {isLoading ? <Spin className="ticket-list__spin" size="large" /> : ''}
      {filterTickets.length === 0 && !isLoading ? (
        <div className="ticket-list__error">
          Билетов нет, попробуте изменить параметры поиска
        </div>
      ) : (
        <div className="ticket-list__tickets">
          {filterTickets.map((ticket) => {
            return <TicketCard data={ticket} key={ticket.id} />
          })}
        </div>
      )}
    </div>
  )
}

export default TicketList
