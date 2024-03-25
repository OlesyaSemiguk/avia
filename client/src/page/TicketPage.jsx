import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Context } from '../App'
import './TicketPage.scss'
import FlightOverview from '../components/FlightOverview/FlightOverview'
import { Button, Collapse, Form, Input, Spin, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import durationTimeString from '../utils/formattingHelpers'
import { transfer } from '../utils/dictionary'

const TicketPage = () => {
  const { tickets } = useContext(Context)
  const { id } = useParams()
  const ticketId = tickets[id - 1]
  const [messageApi, contextHolder] = message.useMessage()
  useEffect(() => {
    if (ticketId) {
      setCountTransfer(ticketId.itineraries[0].segments.length - 1)
    }
  }, [ticketId])

  const [countTransfer, setCountTransfer] = useState()

  function capitalizeFirstLetter(str) {
    return str
      ? str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
          return match.toUpperCase()
        })
      : ''
  }

  const onFinish = (values) => {
    messageApi.open({
      type: 'success',
      content: 'Данные успешно отправлены',
    })
    return false
  }
  if (!ticketId) {
    return (
      <div className="ticket-page">
        <Spin className="ticket-page__spin" size="large" />
      </div>
    )
  }

  return (
    <div className="ticket-page">
      <NavLink to={'/'}>
        <Button
          className="ticket-page__button"
          type="primary"
          icon={<ArrowLeftOutlined />}
        >
          Вернуться к списку билетов
        </Button>
      </NavLink>
      {contextHolder}

      <div className="ticket-page__flight-overview">
        {ticketId.itineraries[0]?.segments.map((segment, index) => {
          return <FlightOverview key={segment.id} segment={segment} />
        })}
      </div>
      <div className="ticket-page__info">
        <div className="ticket-page__info__item">
          <span className="ticket-page__info__item__label">Стоймость:</span>
          <span className="ticket-page__info__item__value">
            {ticketId.price.total} {ticketId.price.currency}
          </span>
        </div>
        <div className="ticket-page__info__item">
          <span className="ticket-page__info__item__label">
            Информация о пересадках:
          </span>
          <span className="ticket-page__info__item__value">
            {countTransfer} {transfer[countTransfer]}
          </span>
        </div>
        <div className="ticket-page__info__item">
          <span className="ticket-page__info__item__label">Авиакомпания:</span>
          <span className="ticket-page__info__item__value">
            {localStorage.getItem(
              ticketId?.itineraries[0]?.segments[0]?.carrierCode
            ) &&
              capitalizeFirstLetter(
                localStorage.getItem(
                  ticketId?.itineraries[0]?.segments[0]?.carrierCode
                )
              )}
          </span>
        </div>
        <div className="ticket-page__info__item">
          <span className="ticket-page__info__item__label">Время в пути:</span>
          <span className="ticket-page__info__item__value">
            {durationTimeString(ticketId.itineraries[0]?.duration)}
          </span>
        </div>
        <div className="ticket-page__info__item">
          <span className="ticket-page__info__item__label">Даты и время :</span>
          <span className="ticket-page__info__item__value">
            {ticketId?.itineraries[0]?.segments[0]?.departure?.at.replace(
              'T',
              ' '
            )}{' '}
            —{' '}
            {ticketId?.itineraries[0]?.segments[
              countTransfer
            ]?.departure?.at.replace('T', ' ')}
          </span>
        </div>
        <div className="ticket-page__info__item">
          <span className="ticket-page__info__item__label">
            Класс перелета:
          </span>
          <span className="ticket-page__info__item__value">
            {ticketId.travelerPricings[0]?.fareOption}
          </span>
        </div>
        <div className="ticket-page__info__item__flight">
          <span className="ticket-page__info__item__flight__label">
            Информация о перелетах:
          </span>
          <span className="ticket-page__info__item__flight__value">
            {ticketId.travelerPricings[0]?.fareDetailsBySegment.map(
              (segment, index) => {
                return (
                  <div
                    className="ticket-page__info__value__segment segment"
                    key={index}
                  >
                    <Collapse
                      size="small"
                      items={[
                        {
                          key: '1',
                          label: `Перелет: ${index + 1}`,
                          children: (
                            <div>
                              <div className="segment__cabin">
                                Класс обслуживания: {segment.cabin}
                              </div>
                              <ul className="segment__amenities">
                                Дополнительные услуги:
                                {segment.amenities.map((amenity, index) => {
                                  return (
                                    <li
                                      className="segment__amenities__item"
                                      key={index}
                                    >
                                      {amenity.description} —{' '}
                                      {amenity.isChargeable
                                        ? 'Платная'
                                        : 'Бесплатная'}
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                          ),
                        },
                      ]}
                    />
                  </div>
                )
              }
            )}
          </span>
        </div>
      </div>
      <div className="ticket-page__form">
        <div className="ticket-page__form__label">
          Для бронирования заполните форму
        </div>

        <Form
          className="ticket-page__form__form"
          name="submin"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: 'Please input your phone number!',
              },
            ]}
          >
            <Input
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Отправить
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default TicketPage
