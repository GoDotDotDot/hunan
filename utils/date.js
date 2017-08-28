function parseDateString (str) {
  const year = String.prototype.substr.call(str, 0, 4)
  const month = String.prototype.substr.call(str, 4, 2)
  const day = String.prototype.substr.call(str, 6, 2)
  const hour = String.prototype.substr.call(str, 8, 2)
  const minute = String.prototype.substr.call(str, 10, 2)
  const secend = String.prototype.substr.call(str, 12, 2)
  const date = new Date(year, month, day, hour, minute, secend)
  return date
}
export default parseDateString
