import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../App'
import { Select } from 'antd'
import './SortFilterTicket.scss'
const SortFilterTicket = ({
  data: filterTickets,
  sortFunction: setFilterTickets,
}) => {
  const { tickets, isLoading } = useContext(Context)
  const [sort, setSort] = useState('price')
  const [filter, setFilter] = useState([])

  console.log(filter, sort)
  useEffect(() => {
    console.log('tickets', tickets)
    filterByTransfers(filter)
    console.log('filterTickets SortFilterTicket', filterTickets)
  }, [tickets])

  function durationTimeNum(duration) {
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
    setFilter(values)
    let filteredTickets = []
    if (values.length === 0) {
      filteredTickets = tickets
    } else if (tickets && tickets.length) {
      filteredTickets = tickets.filter((ticket) =>
        values.includes(ticket.itineraries[0].segments.length.toString())
      )
    }
    sortTickets(sort, filteredTickets)
    console.log('filteredTickets', filteredTickets)
  }

  const sortTickets = (value, ticketsToSort) => {
    let sortedTickets
    if (value === 'duration') {
      sortedTickets = [...ticketsToSort]?.sort((a, b) => {
        const durationA = durationTimeNum(a.itineraries[0].duration)
        const durationB = durationTimeNum(b.itineraries[0].duration)
        return durationA - durationB
      })
    } else if (value === 'price') {
      sortedTickets = [...ticketsToSort]?.sort((a, b) => {
        const priceA = a.price.total
        const priceB = b.price.total
        return priceA - priceB
      })
    }
    console.log('sortedTickets', sortedTickets)
    setFilterTickets(sortedTickets)
  }

  const sortSelect = (value) => {
    setSort(value)
    sortTickets(value, filterTickets)
  }
  return (
    <div>
      <div className="ticket-list__param">
        <div className="ticket-list__param__filter">
          <div className="ticket-list__filter__title">Количество пересадок</div>
          <Select
            className="ticket-list__param__filter__select"
            mode="multiple"
            allowClear
            style={{
              width: '100%',
            }}
            disabled={isLoading}
            placeholder="Please select"
            onChange={filterByTransfers}
            options={[
              {
                value: '1',
                label: 'без пересадок',
              },
              {
                value: '2',
                label: '1 пересадка',
              },
              {
                value: '3',
                label: '2 пересадки',
              },
            ]}
          />
        </div>
        <div className="ticket-list__param__sort">
          <div className="ticket-list__sort__title"> Сортировать по</div>

          <Select
            className="ticket-list__param__sort__select"
            defaultValue="price"
            onChange={sortSelect}
            disabled={isLoading}
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
    </div>
  )
}

export default SortFilterTicket
