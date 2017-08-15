import React from 'react'
import { Polyline } from 'react-leaflet'
import './style/index.scss'

const TruthPolyline = (props) => {
    /** props
     * @param positions:Array
     * @param color:String
     */
  const {positions, color = '#F44336', ...other} = props
  return <CommomPolyline positions={positions} color={color} {...other} />
}
const CommomPolyline = (props) => {
    /** props
     * @param positions:Array
     * @param color:String
     */
  const {positions, color = '#F44336'} = props
  return <Polyline {...props} positions={positions} color={color || '#F44336'} />
}
const ForecastPolyline = (props) => {
    /** props
     * @param position:Array
     * @param color:String
     */
  const {positions, color = '#F44336', dashArray = [5, 5], ...other} = props
  return <CommomPolyline positions={positions} color={color} dashArray={dashArray} {...other} />
}
export {TruthPolyline, ForecastPolyline}
