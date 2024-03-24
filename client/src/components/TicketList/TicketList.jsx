import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { fetchAirline, fetchTicket } from '../../http/ticketAPI'
import TicketCard from '../TicketCard/TicketCard'
import './TicketList.scss'
import { Select } from 'antd'
import { Context } from '../../App'

const TicketList = () => {
  const tickets = useContext(Context)
  const [selectedTickets, setSelectedTickets] = useState([...tickets])
  const [sort, setSort] = useState('price')

  useEffect(() => {
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
  }, [tickets])

  function durationTime(duration) {
    const hoursIndex = duration.indexOf('H')
    const minutesIndex = duration.indexOf('M')

    const hours =
      hoursIndex !== -1 ? parseInt(duration.slice(2, hoursIndex)) : 0
    const minutes =
      minutesIndex !== -1
        ? parseInt(duration.slice(hoursIndex + 1, minutesIndex))
        : 0

    return hours * 60 + minutes
  }

  const filterByTransfers = (values) => {
    // console.log('filterByTransfers', values)
    let filteredTickets = []
    if (values.includes('all') || values.length === 0) {
      filteredTickets = tickets
    } else {
      filteredTickets = tickets.filter((ticket) =>
        values.includes(ticket.itineraries[0].segments.length.toString())
      )
    }
    // console.log('filteredTickets', filteredTickets)
    sortTickets(sort, filteredTickets)
  }

  const sortTickets = (value, ticketsToSort) => {
    //console.log('sortTickets', value, ticketsToSort)
    let sortedTickets
    if (value === 'duration') {
      sortedTickets = [...(ticketsToSort || selectedTickets)].sort((a, b) => {
        const durationA = durationTime(a.itineraries[0].duration)
        const durationB = durationTime(b.itineraries[0].duration)
        return durationA - durationB
      })
    } else if (value === 'price') {
      sortedTickets = [...(ticketsToSort || selectedTickets)].sort((a, b) => {
        const priceA = a.price.total
        const priceB = b.price.total
        return priceA - priceB
      })
    }

    setSelectedTickets(sortedTickets)
  }
  const sortSelect = (value) => {
    setSort(value)
    sortTickets(value, selectedTickets)
  }
  return (
    <div className="ticket-list__1">
      <div className="ticket-list__param">
        <div className="ticket-list__filter">
          <div className="ticket-list__filter__title">Количество пересадок</div>
          <Select
            className="ticket-list__filter__select"
            mode="multiple"
            allowClear
            style={{
              width: '100%',
            }}
            placeholder="Please select"
            defaultValue={['all']}
            onChange={filterByTransfers}
            options={[
              {
                value: 'all',
                label: 'Все',
              },
              {
                value: '1',
                label: '1 пересадка',
              },
              {
                value: '2',
                label: '2 пересадки',
              },
              {
                value: '3',
                label: '3 пересадки',
              },
            ]}
          />
        </div>
        <div className="ticket-list__sort">
          <div className="ticket-list__sort__title"> Сортировать по</div>

          <Select
            className="ticket-list__sort__select"
            defaultValue="price"
            onChange={sortSelect}
            options={[
              {
                value: 'duration',
                label: 'Длительности',
              },
              {
                value: 'price',
                label: 'Стоимости',
              },
            ]}
          />
        </div>
      </div>
      <div className="ticket-list">
        {selectedTickets.map((ticket) => {
          return <TicketCard data={ticket} key={ticket.id} />
        })}
      </div>
    </div>
  )
}

export default TicketList
