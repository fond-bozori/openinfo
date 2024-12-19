export function financial(x) {
  if (x) {
    return Number.parseFloat(x).toFixed(2)
  } else {
    return '0.00'
  }
}
export function divideByMillion(number) {
  if (isNaN(number) || number === null || number === undefined) {
    return '0,00'
  }
  return (number / 1000000).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function getYear(dateString) {
  if (!dateString) {
    return '-'
  }
  return new Date(dateString).getFullYear()
}
