export default function durationTimeString(time) {
  const hoursIndex = time.indexOf('H')
  const minutesIndex = time.indexOf('M')
  const hours = time.slice(2, hoursIndex)
  const minutes =
    minutesIndex !== -1 ? time.slice(hoursIndex + 1, minutesIndex) : '00'
  return `${hours}ч ${minutes}мин`
}
