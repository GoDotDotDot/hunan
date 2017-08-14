import React from 'react'
import { Popup, CircleMarker } from 'react-leaflet'
import { Card, Row, Col } from 'antd'
import './style/index.scss'
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
const TruthPopupTemp = (props) => {
  const { radius_7, wind_power, radius_10, grade, move_speed, name_cn, longitude, latitude, datetime, pressure, move_direction } = props
  return <Popup>
    <div className='md-circleMarker-container'>
      <span className='title'>{name_cn}</span>
      <div className='info-container'>
        <div className='info-row'>
          <lable className='info-row--lable'>历史时间</lable>
          <span className='info-row--span'>{datetime}</span>
        </div>
        <div className='info-row'>
          <lable className='info-row--lable'>经纬坐标</lable>
          <span className='info-row--span'>{`${longitude}E/${latitude}N"`}</span>
        </div>
        <div className='info-row'>
          <lable className='info-row--lable'>中心气压</lable>
          <span className='info-row--span'>{pressure}百帕</span>
        </div>
        <div className='info-row'>
          <lable className='info-row--lable'>风力</lable>
          <span className='info-row--span'>{wind_power}米/秒</span>
        </div>
        <div className='info-row'>
          <lable className='info-row--lable'>风级</lable>
          <span className='info-row--span'>{grade}</span>
        </div>
        <div className='info-row'>
          <lable className='info-row--lable'>风速</lable>
          <span className='info-row--span'>{move_speed}千米/时</span>
        </div>
        <div className='info-row'>
          <lable className='info-row--lable'>移动方向</lable>
          <span className='info-row--span'>{move_direction || 'null'}</span>
        </div>
        <div className='info-row'>
          <lable className='info-row--lable'>7级风圈半径</lable>
          <span className='info-row--span'>{radius_7}公里</span>
        </div>
        <div className='info-row'>
          <lable className='info-row--lable'>10级风圈半径</lable>
          <span className='info-row--span'>{radius_10 || 'null'}公里</span>
        </div>

      </div>
    </div>

  </Popup>
}
const ForecastPopupTemp = (props) => { }
const TruthCircleMarker = (props) => {
  const { color, fill, fillOpacity = 1, center, radius = 5, ...data } = props
  let _ref
  return <CircleMarker
    center
    color={getCircleColorBySpeed(data.move_speed)}
    radius
    fill
    fillOpacity
    ref={(ref) => { _ref = ref }}
    onMouseOver={(e) => { handleMouseOver(e, _ref) }}
    >
    <TruthPopupTemp data />
  </CircleMarker>
}
const ForecastCircleMarker1 = (props) => { }
/**
 * 鼠标移上CircleMarker处理事件
 * @param {Event} e
 * @param {Object} ref
 */
const handleMouseOver = (e, ref) => {
  ref.leafletElement.openPopup()
}
export class NowCircleMarker extends React.Component {
  handleMouseOver (e) {
    this.ref.leafletElement.openPopup()
  }
  render () {
    const data = this.props.info
    return (
      <CircleMarker ref={(ref) => { this.ref = ref }} onMouseOver={(e) => { this.handleMouseOver(e) }} {...this.props} color={getCircleColorBySpeed(parseFloat(data.yidongsudu))}>
        <Popup>
          <div className='md-circleMarker-container'>
            <span className='title'>{data.zhongwenbianhao}</span>
            <div className='info-container'>
              <div className='info-row'>
                <lable className='info-row--lable'>历史时间</lable>
                <span className='info-row--span'>{data.yubaoshijian}</span>
              </div>
              <div className='info-row'>
                <lable className='info-row--lable'>经纬坐标</lable>
                <span className='info-row--span'>{`${data.xianzaijindu}E/${data.xianzaiweidu}N"`}</span>
              </div>
              <div className='info-row'>
                <lable className='info-row--lable'>中心气压</lable>
                <span className='info-row--span'>{data.xianzaiqiya}百帕</span>
              </div>
              <div className='info-row'>
                <lable className='info-row--lable'>风速</lable>
                <span className='info-row--span'>{data.yidongsudu}米/秒</span>
              </div>
              <div className='info-row'>
                <lable className='info-row--lable'>风级</lable>
                <span className='info-row--span'>{data.xianzaifengli}级</span>
              </div>
              <div className='info-row'>
                <lable className='info-row--lable'>未来移速</lable>
                <span className='info-row--span'>{data.yidongsudu}千米/时</span>
              </div>
              <div className='info-row'>
                <lable className='info-row--lable'>未来移向</lable>
                <span className='info-row--span'>{data.yidongfangxiang || 'null'}</span>
              </div>
              <div className='info-row'>
                <lable className='info-row--lable'>7级风圈半径</lable>
                <span className='info-row--span'>{data.fenglifor7}公里</span>
              </div>
              <div className='info-row'>
                <lable className='info-row--lable'>10级风圈半径</lable>
                <span className='info-row--span'>{data.fenglifor10 || 'null'}公里</span>
              </div>
              <div className='info-row'>
                <lable className='info-row--lable'>历史时间</lable>
                <span className='info-row--span'>{data.yubaoshijian}</span>
              </div>

            </div>
          </div>

        </Popup>
      </CircleMarker>
    )
  }
}

export class ForecastCircleMarker extends React.Component {
  handleMouseOver (e) {
    this.ref.leafletElement.openPopup()
  }
  render () {
    const data = this.props.info

    return (
      <CircleMarker ref={(ref) => { this.ref = ref }} onMouseOver={(e) => { this.handleMouseOver(e) }} {...this.props} color={getCircleColorBySpeed(parseFloat(data.yidongsudu))}>
        <Popup>
          <div className='md-circleMarker-container'>
            <span className='title'>{data.zhongwenbianhao}</span>
            <div className='info-container'>
              <div className='info-row'>
                <lable className='info-row--lable'>预测机构</lable>
                <span className='info-row--span'>{data.fabuzhe}</span>
              </div>
              <div className='info-row'>
                <lable className='info-row--lable'>起报时间</lable>
                <span className='info-row--span'>{data.xianzaishijian}</span>
              </div>
              <div className='info-row'>
                <lable className='info-row--lable'>预报时间</lable>
                <span className='info-row--span'>{data.yubaoshijian}</span>
              </div>
              <div className='info-row'>
                <lable className='info-row--lable'>中心位置</lable>
                <span className='info-row--span'>{`${data.yubaojindu}E/${data.yubaoweidu}N`}级</span>
              </div>
              <div className='info-row'>
                <lable className='info-row--lable'>中心气压</lable>
                <span className='info-row--span'>{data.xianzaiqiya}百帕</span>
              </div>
              <div className='info-row'>
                <lable className='info-row--lable'>最大风速</lable>
                <span className='info-row--span'>{data.yidongsudu || 'null'}</span>
              </div>
            </div>
          </div>

        </Popup>
      </CircleMarker>
    )
  }
}
export {TruthCircleMarker}
