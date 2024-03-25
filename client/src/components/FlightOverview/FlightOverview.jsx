import React from 'react'
import './FlightOverview.scss'
import durationTimeString from '../../utils/formattingHelpers'
const FlightOverview = ({ segment }) => {
  const departureTime = new Date(segment.departure.at)
  const arrivalTime = new Date(segment.arrival.at)
  function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  function capitalizeFirstLetter(str) {
    return str
      ? str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
          return match.toUpperCase()
        })
      : ''
  }
  return (
    <div className="segment" key={segment.id}>
      <div className="details">
        <div className="details__item">
          <div className="details__item__airport">
            {segment.departure.iataCode}
          </div>
          <div className="details__item__time">{formatTime(departureTime)}</div>
        </div>
        <div className="details__item">
          <div className="details__item__airport">
            {segment.arrival.iataCode}
          </div>
          <div className="details__item__time">{formatTime(arrivalTime)}</div>
        </div>
      </div>
      <div className="segment__line"></div>
      <div className="segment__about">
        <div className="segment__about__time">
          {durationTimeString(segment.duration)}
        </div>
        <div className="segment__about__airline">
          {localStorage.getItem(segment.carrierCode) &&
            capitalizeFirstLetter(localStorage.getItem(segment.carrierCode))}
        </div>
      </div>
    </div>
  )
}

export default FlightOverview
