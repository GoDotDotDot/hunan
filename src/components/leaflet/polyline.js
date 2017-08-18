import L from 'leaflet'

const renderPolyline = (positions, type) => {
  const option = {color: '#F44336', weight: 2 }
  type === 'truth' ? null : option.dashArray = [5, 5]
  const polyline = L.polyline(positions, option)
  return polyline
}

export {renderPolyline}
