import React from 'react'
import { useParams } from 'react-router-dom'

const TicketPage = () => {
  const { id } = useParams()
  console.log(id)
  return <div>{id}sada</div>
}

export default TicketPage
