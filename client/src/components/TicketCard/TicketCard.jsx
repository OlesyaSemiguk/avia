import React, { useEffect, useState } from 'react'
import './TicketCard.scss'
import { NavLink } from 'react-router-dom'
import FlightOverview from '../FlightOverview/FlightOverview'
import durationTimeString from '../../utils/formattingHelpers'
import { transfer } from '../../utils/dictionary'
const TicketCard = ({ data: ticket }) => {
  const [countTransfer, setCountTransfer] = useState()

  useEffect(() => {
    setCountTransfer(ticket.itineraries[0].segments.length - 1)
  }, [ticket])

  return (
    <NavLink to={'/ticket/' + ticket.id}>
      <div className="ticket-card">
        <div className="ticket-card__flight">
          <div className="ticket-card__flight__overview">
            {ticket.itineraries[0].segments.map((segment, index) => {
              return <FlightOverview segment={segment} key={segment.id} />
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
                  {durationTimeString(ticket.itineraries[0].duration)}
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
            <div className="ticket-card__price__content__date">
              Дата вылета{' '}
              {ticket.itineraries[0].segments[0].departure.at.slice(0, 10)}
            </div>
            <div className="ticket-card__price__content__available">
              Доступно мест для бронирования: {ticket.numberOfBookableSeats}
            </div>
            <div className="ticket-card__price__content__price">
              {ticket.price.total} {ticket.price.currency}
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  )
}

export default TicketCard
