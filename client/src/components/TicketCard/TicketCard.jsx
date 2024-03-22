import React, { useEffect, useState } from 'react'
import './TicketCard.scss'
import { fetchAirline } from '../../http/ticketAPI'
const TicketCard = ({ data: ticket }) => {
  const [airline, setAirline] = useState([])
  const countTransfer = ticket.itineraries[0].segments.length - 1
  const transfer = {
    1: 'пересадка',
    2: 'пересадки',
    3: 'пересадки',
    4: 'пересадки',
    5: 'пересадок',
  }
  function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }
  function durationTime(time) {
    const hoursIndex = time.indexOf('H')
    const minutesIndex = time.indexOf('M')
    const hours = time.slice(2, hoursIndex)
    const minutes = time.slice(hoursIndex + 1, minutesIndex)
    return `${hours}ч ${minutes}мин`
  }
  function capitalizeFirstLetter(str) {
    return str
      ? str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
          return match.toUpperCase()
        })
      : ''
  }
  useEffect(() => {
    const fetchAirlineData = async (airlineCode) => {
      try {
        const savedAirline = localStorage.getItem(airlineCode)
        if (!savedAirline) {
          const airlineName = await fetchAirline(airlineCode)
          localStorage.setItem(airlineCode, airlineName)
          console.log('asdlk', airlineCode)
        }
      } catch (error) {
        console.error('Error fetching airline data:', error)
      }
    }
    const fetchDataAndSaveToLocalStorage = async () => {
      if (ticket.itineraries[0].segments) {
        ticket.itineraries[0].segments.forEach((segment) => {
          fetchAirlineData(segment.carrierCode)
          console.log(segment.carrierCode)
        })
      }
    }

    fetchDataAndSaveToLocalStorage()
  }, [])

  return (
    <div className="ticket-card">
      <div className="ticket-card__flight">
        <div className="ticket-card__flight__overview">
          {ticket.itineraries[0].segments.map((segment, index) => {
            const departureTime = new Date(segment.departure.at)
            const arrivalTime = new Date(segment.arrival.at)
            return (
              <div className="ticket-card__flight__segment" key={segment.id}>
                <div className="ticket-card__flight__details">
                  <div className="ticket-card__flight__details__item">
                    <div className="ticket-card__flight__details__item__airport">
                      {segment.departure.iataCode}
                    </div>
                    <div className="ticket-card__flight__details__item__time">
                      {formatTime(departureTime)}
                    </div>
                  </div>
                  <div className="ticket-card__flight__details__item">
                    <div className="ticket-card__flight__details__item__airport">
                      {segment.arrival.iataCode}
                    </div>
                    <div className="ticket-card__flight__details__item__time">
                      {formatTime(arrivalTime)}
                    </div>
                  </div>
                </div>
                <div className="ticket-card__flight__segment__line"></div>
                <div className="ticket-card__flight__segment__about">
                  <div className="ticket-card__flight__segment__about__time">
                    {durationTime(segment.duration)}
                  </div>
                  <div className="ticket-card__flight__segment__about__airline">
                    {localStorage.getItem(segment.carrierCode) &&
                      capitalizeFirstLetter(
                        localStorage.getItem(segment.carrierCode)
                      )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {countTransfer ? (
          <div className="ticket-card__flight__total">
            <div className="ticket-card__flight__total__transfer">
              {countTransfer} {transfer[countTransfer]}
            </div>
            <div className="ticket-card__flight__total__time">
              Общее время перелета{' '}
              <span className="ticket-card__flight__total__time__number">
                {durationTime(ticket.itineraries[0].duration)}
              </span>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="ticket-card__price">
        <div className="ticket-card__price__line"></div>
        <div className="ticket-card__price__content">
          <div className="ticket-card__price__content__available">
            Доступно мест для бронирования: {ticket.numberOfBookableSeats}
          </div>
          <div className="ticket-card__price__content__price">
            {ticket.price.total} {ticket.price.currency}
          </div>
        </div>
      </div>
      {/* <div> id {ticket.id} </div> */}
    </div>
  )
}

export default TicketCard
