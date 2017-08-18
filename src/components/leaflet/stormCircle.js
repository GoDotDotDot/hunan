function drawTyphoonCirleByCanvas (container, data, color) {
  const max = findMax(data)
  const canvas = container
  canvas.width = 2 * max
  canvas.height = 2 * max
  const context = canvas.getContext('2d')

  function findMax (data) {
    const temp = []
    for (let i = 0; i < data.length; i++) {
      let element = data[i]
      for (let j = 0; j < element.length; j++) {
        let _element = element[j]
        temp.push(_element)
      }
    }
    return temp.sort((a, b) => b - a)[0]
  }

  function drawTyphoonCirle (data, color) {
    context.beginPath()
    if (data.length > 1) {
      for (var i = 1; i < data.length; i++) {
        var element = data[i]
        var index = i - 1
        context.arc(max, max, element, 0.5 * index * Math.PI, (0.5 * index + 0.5) * Math.PI, false)
      }
    }
    context.arc(max, max, data[0], 1.5 * Math.PI, 2 * Math.PI, false)
    context.fillStyle = color
    context.lineWidth = 2
    context.strokeStyle = '#00C853'
    context.closePath()
    context.fill()
    context.stroke()
  }
  for (let j = 0; j < data.length; j++) {
    let element = data[j]
    drawTyphoonCirle(element, `rgba(0, 230, 118,0.5)`)
  }
  return canvas
}
export default drawTyphoonCirleByCanvas
