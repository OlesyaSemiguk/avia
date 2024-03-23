import React from 'react'
import { Route, Routes } from 'react-router-dom'
import App from '../App'
import TicketPage from '../page/TicketPage'
import TicketList from '../components/TicketList/TicketList'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/ticket/:id" element={<TicketPage />} />
      <Route path="/" element={<TicketList />} exact />
    </Routes>
  )
}

export default AppRouter
