import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { fetchAirline, fetchTicket } from '../../http/ticketAPI'
import TicketCard from '../TicketCard/TicketCard'
import './TicketList.scss'
import { Select } from 'antd'
import { Context } from '../../App'

const TicketList = () => {
  const tickets = useContext(Context)
  const [sortedTickets, setSortedTickets] = useState([...tickets])
  const uniqueCarrierCodes = new Set()

  useEffect(() => {
    setSortedTickets([...tickets])
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

  const filter = (value) => {
    console.log(`selected ${value}`)
  }
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
  const sort = (value) => {
    if (value === 'duration') {
      const sortedByDuration = [...tickets].sort((a, b) => {
        const durationA = durationTime(a.itineraries[0].duration)
        const durationB = durationTime(b.itineraries[0].duration)
        return durationA - durationB
      })

      setSortedTickets(sortedByDuration)
    }
    if (value === 'price') {
      setSortedTickets([...tickets])
    }
  }
  return (
    <div className="ticket-list__1">
      <div className="ticket-list__param">
        <div className="ticket-list__filter">
          <div className="ticket-list__filter__title">
            {' '}
            Количество пересадок
          </div>
          <Select
            className="ticket-list__filter__select"
            mode="multiple"
            allowClear
            style={{
              width: '100%',
            }}
            placeholder="Please select"
            defaultValue={['all']}
            onChange={filter}
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
            onChange={sort}
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
        {sortedTickets.map((ticket) => {
          return <TicketCard data={ticket} key={ticket.id} />
        })}
      </div>
    </div>
  )
}

export default TicketList
