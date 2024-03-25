import { DatePicker, InputNumber, Select } from 'antd'
import React, { useContext, useState } from 'react'
import dayjs from 'dayjs'
import { Context } from '../../App'
import './SearchTicket.scss'
import { ArrowRightOutlined } from '@ant-design/icons'

const SearchTicket = () => {
  const { setSearchParams, isLoading } = useContext(Context)
  const [statusInputNum, setStatusInputNum] = useState('')
  const dateFormat = 'YYYY-MM-DD'

  const onChange = (date, dateString) => {
    if (!date) {
      const endDate = dayjs().endOf('day')
      const formattedDate = endDate.format(dateFormat)
      setSearchParams((searchParams) => ({
        ...searchParams,
        departureDate: formattedDate,
      }))
    } else {
      setSearchParams((searchParams) => ({
        ...searchParams,
        departureDate: dateString,
      }))
    }
  }
  const changeOrigin = (value) => {
    setSearchParams((searchParams) => {
      return {
        ...searchParams,
        origin: value,
      }
    })
  }
  const changeDestination = (value) => {
    setSearchParams((searchParams) => {
      return {
        ...searchParams,
        destination: value,
      }
    })
  }
  const disabledDate = (current) => {
    return current < dayjs().startOf('day')
  }
  const onChangeInput = (value) => {
    if (!value) {
      value = 1
      setStatusInputNum('error')
    } else {
      setStatusInputNum('')
    }
    setSearchParams((searchParams) => {
      return {
        ...searchParams,
        adults: value,
      }
    })
  }
  return (
    <div className="ticket-list__search">
      <div className="ticket-list__search__select-origin">
        <Select
          className="ticket-list__search__select-origin__select"
          showSearch
          placeholder="Search to Select"
          disabled={isLoading}
          defaultValue={['BOS']}
          optionFilterProp="children"
          onChange={changeOrigin}
          filterOption={(input, option) =>
            (option?.label ?? '').includes(input)
          }
          options={[
            {
              value: 'REK',
              label: 'Рейкьявик',
            },
            {
              value: 'CPT',
              label: 'Кейптаун',
            },
            {
              value: 'KTM',
              label: 'Катманду',
            },
            {
              value: 'RGL',
              label: 'Рио-Галлегос',
            },
            {
              value: 'ULN',
              label: 'Улан-Батор',
            },
            {
              value: 'BOS',
              label: 'Бостон',
            },
            {
              value: 'CHI',
              label: 'Чикаго',
            },
          ]}
        />
      </div>

      <ArrowRightOutlined className="ticket-list__search__icon" />
      <div className="ticket-list__search__select-des">
        <Select
          className="ticket-list__search__select-des__select"
          showSearch
          placeholder="Search to Select"
          disabled={isLoading}
          defaultValue={['CHI']}
          optionFilterProp="children"
          onChange={changeDestination}
          filterOption={(input, option) =>
            (option?.label ?? '').includes(input)
          }
          options={[
            {
              value: 'REK',
              label: 'Рейкьявик',
            },
            {
              value: 'CPT',
              label: 'Кейптаун',
            },
            {
              value: 'KTM',
              label: 'Катманду',
            },
            {
              value: 'RGL',
              label: 'Рио-Галлегос',
            },
            {
              value: 'ULN',
              label: 'Улан-Батор',
            },
            {
              value: 'BOS',
              label: 'Бостон',
            },
            {
              value: 'CHI',
              label: 'Чикаго',
            },
          ]}
        />
      </div>

      <DatePicker
        onChange={onChange}
        disabled={isLoading}
        disabledDate={disabledDate}
        defaultValue={dayjs('2024-04-20', dateFormat)}
      />
      <div className="ticket-list__search__input">
        <InputNumber
          className="ticket-list__search__input__input"
          min={1}
          disabled={isLoading}
          max={10}
          defaultValue={1}
          status={statusInputNum}
          onChange={onChangeInput}
        />
      </div>
    </div>
  )
}

export default SearchTicket
