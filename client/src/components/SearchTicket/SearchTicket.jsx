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
    console.log(date)
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
    console.log(value)
  }
  const changeDestination = (value) => {
    setSearchParams((searchParams) => {
      return {
        ...searchParams,
        destination: value,
      }
    })
    console.log(value)
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
    console.log('changed', value)
  }
  return (
    <div className="ticket-list__search">
      <Select
        showSearch
        style={{
          width: 200,
        }}
        placeholder="Search to Select"
        disabled={isLoading}
        defaultValue={['BOS']}
        optionFilterProp="children"
        onChange={changeOrigin}
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
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
      <ArrowRightOutlined />
      <Select
        showSearch
        style={{
          width: 200,
        }}
        placeholder="Search to Select"
        disabled={isLoading}
        defaultValue={['CHI']}
        optionFilterProp="children"
        onChange={changeDestination}
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
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
      <DatePicker
        onChange={onChange}
        disabled={isLoading}
        disabledDate={disabledDate}
        defaultValue={dayjs('2024-04-20', dateFormat)}
      />
      <InputNumber
        min={1}
        disabled={isLoading}
        max={10}
        defaultValue={1}
        status={statusInputNum}
        onChange={onChangeInput}
      />
    </div>
  )
}

export default SearchTicket
