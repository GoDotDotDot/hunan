import L from 'leaflet'

const CIRCLE_COLOR = ['#27da22', '#131aaf', '#f7ef3d', '#e48d38', '#ef74db', '#ea2929']
const TYPHOON_SPEED_CLASS = [17.2, 24.4, 32.6, 41.4, 50.9]

const getCircleColorBySpeed = (val) => {
  let flag = false
  if (isNaN(val)) return CIRCLE_COLOR[0]
  for (let i = 0; i < TYPHOON_SPEED_CLASS.length; i++) {
    if (val < TYPHOON_SPEED_CLASS[i]) {
      flag = true
      return CIRCLE_COLOR[i]
    }
  }
  if (!flag) return CIRCLE_COLOR[5]
}

const renderCircleMarker = (pos, data, call) => {
  const {move_speed} = data
  const criclleMarker = L.circleMarker(pos, {
    color: getCircleColorBySpeed(move_speed),
    fill: true,
    fillOpacity: 1,
    radius: 3
  })
  criclleMarker.bindPopup(truthPopup(data))
  criclleMarker.addEventListener('mouseover', (e) => {
    console.log('mouseover')
    if (!criclleMarker.isPopupOpen()) {
      criclleMarker.openPopup(e.latlng)
    //   L.popup().setContent(truthPopup(data)).setLatLng(e.latlng)
    }
  })
  return criclleMarker
}
const TROPICAL_CYCLONE_CLASS_EN_TO_CN = {
  'TD': '热带低压',
  'TS': '热带风暴',
  'STS': '超热带风暴',
  'TY': '台风',
  'STY': '强台风',
  'SuperTY': '超强台风'
}
const truthPopup = (data) => {
  const { radius_7, wind_power, radius_10, grade, move_speed, name_cn, longitude, latitude, datetime, datetimeLong, pressure, move_direction } = data
  const gradeToCN = TROPICAL_CYCLONE_CLASS_EN_TO_CN[grade]
  const template = `<div class='md-circleMarker-container'>
      <span class='title'>${name_cn}</span>
      <div class='info-container'>
        <div class='info-row'>
          <lable class='info-row--lable'>时间</lable>
          <span class='info-row--span'>${datetime}</span>
        </div>
        <div class='info-row'>
          <lable class='info-row--lable'>经纬坐标</lable>
          <span class='info-row--span'>${longitude}E/${latitude}N"</span>
        </div>
        <div class='info-row'>
          <lable class='info-row--lable'>中心气压</lable>
          <span class='info-row--span'>${pressure}百帕</span>
        </div>
        <div class='info-row'>
          <lable class='info-row--lable'>最大风速</lable>
          <span class='info-row--span'>${wind_power}米/秒</span>
        </div>
        <div class='info-row'>
          <lable class='info-row--lable'>风级</lable>
          <span class='info-row--span'>${gradeToCN}</span>
        </div>
        <div class='info-row'>
          <lable class='info-row--lable'>移动速度</lable>
          <span class='info-row--span'>${move_speed}千米/时</span>
        </div>
        <div class='info-row'>
          <lable class='info-row--lable'>移动方向</lable>
          <span class='info-row--span'>${move_direction}</span>
        </div>
        <div class='info-row'>
          <lable class='info-row--lable'>7级风圈半径</lable>
          <span class='info-row--span'>${radius_7}公里</span>
        </div>
        <div class='info-row'>
          <lable class='info-row--lable'>10级风圈半径</lable>
          <span class='info-row--span'>${radius_10}公里</span>
        </div>
      </div>
    </div>`
  return template
}

export {renderCircleMarker}
