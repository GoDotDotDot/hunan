import L from 'leaflet'
import {renderPolyline} from './polyline.js'
import {renderCircleMarker} from './marker.js'

const renderPolylineAndMarker = (data, type) => {
  const positions = []
  let polyline
  const markers = data.map((ele, index) => {
    const lnglat = [ ele.latitude, ele.longitude ]
    positions.push(lnglat)
    return renderCircleMarker(lnglat, ele)
  })
  polyline = renderPolyline(positions, type)
  return L.featureGroup([polyline, ...markers])
}

export {renderPolylineAndMarker, renderCircleMarker, renderPolyline}
