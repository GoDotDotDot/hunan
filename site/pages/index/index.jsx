import React from 'react'
import ReactDOM from 'react-dom'
import L from 'leaflet'
import { Map, Marker, Popup, TileLayer, Polyline, Circle, CircleMarker, LayersControl } from 'react-leaflet'
import md_ajax from 'md_midware/md-service/md-ajax'
import Window from 'md_components/panel'
import {NowCircleMarker, ForecastCircleMarker, TruthCircleMarker} from 'md_components/circle_marker'
import {TruthPolyline, ForecastPolyline} from 'md_components/polyline'
import 'element-theme-default'
import '../../styles/color.css'
import './index.css'
import { outerHeight, outerWidth, getOffsetLeft, getOffsetTop } from '../../../utils/dom/domFns'
import { Select, Button, Table, Checkbox, Tag, message} from 'antd'
import {renderPolylineAndMarker, renderCircleMarker, renderPolyline} from 'md_components/leaflet'

const CIRCLE_COLOR = ['#27da22', '#131aaf', '#f7ef3d', '#e48d38', '#ef74db', '#ea2929']
const TYPHOON_SPEED_CLASS = [17.2, 24.4, 32.6, 41.4, 50.9]

const position = [15.3, 134.6]
const DASH_POLYLINE_COLOR = {
  VHHH: '#F44336', // 香港
  RJTD: '#673AB7',
  BABJ: '#03A9F4',
  CWB: '#4CAF50',
  PGTW: '#FFEB3B'
}

export default class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      rectRight: 0,
      rectBottom: 0,
      typhoonList: [],
      typhoonPointList: [],
      currentTyphoonName: null,
      dashPolylines: null,
      dashCircles: null,
      featureLayers: {},
      selectedRowKeys: [],
      truthPathDoms: [],
      yearsList: [
        {value: '2017', label: '2017'},
        {value: '2016', label: '2016'},
        {value: '2015', label: '2015'},
        {value: '2014', label: '2014'}

      ]
    }
    this.handleYearChange = this.handleYearChange.bind(this)
    this.handleSelectTyphoon = this.handleSelectTyphoon.bind(this)
    this.handleTyphoonPointClick = this.handleTyphoonPointClick.bind(this)
    this.handleTyphoonClick = this.handleTyphoonClick.bind(this)
    this.handleSelectAll = this.handleSelectAll.bind(this)

    this.hasSearchTyphoonData = {}
    this.currentId = null
    this.featureLayers = {}
    this.truthPathObjDoms = {}
  }
  componentDidMount () {
    const ownerNode = ReactDOM.findDOMNode(this)
    const nodeHeight = outerHeight(ownerNode)
    const nodeWidth = outerWidth(ownerNode)
    const nodeOffsetLeft = getOffsetLeft(ownerNode)
    const nodeOffsetTop = getOffsetTop(ownerNode)
    this.setState({rectRight: nodeOffsetLeft + nodeWidth, rectBottom: nodeOffsetTop + nodeHeight})
    this.handleYearChange(this.state.yearsList[0].value)
    this.lysGrp = L.layerGroup()
  }

  handleSelectAll (selected, selectedRows, changeRows) {
    const selectedRowKeys = selectedRows.map((ele, index) => {
      return ele.id
    })
    changeRows.map((ele, index) => {
      this.handleSelectTyphoon(ele, selected)
    })
    this.setState({selectedRowKeys})
  }
  handleYearChange (value) {
    md_ajax.get('http://127.0.0.1/list', {params: {year: value}})
    .then((data) => {
      const rst = data.map((ele, index) => { ele._source.key = ele._source.id; return ele._source })
      this.setState({typhoonList: rst})
      this.handleClearAll()
    })
  }
  handleClearAll () {
    this.setState({typhoonPointList: [],
      currentTyphoonName: null,
      dashPolylines: null,
      dashCircles: null,
      selectedRowKeys: []
    })
    this.featureLayers = {}
    this.lysGrp.clearLayers()
  }

  renderPolylineAndMarkerWithAction (map, data, id) {
    console.log('开始渲染', id)
    let index = 0
    const timeId = setInterval(() => {
      if (timeId && index < data.length) {
        if (this.featureLayers[id]) {
          const feaLys = this.featureLayers[id]
          const poly = feaLys.getLayers()[0]
          const pos = [ data[index].latitude, data[index].longitude ]
          poly.addLatLng(pos)
          this.featureLayers[id] = feaLys.addLayer(renderCircleMarker(pos, data[index]))
        } else {
          const feaLys = renderPolylineAndMarker(data.slice(0, 1), 'truth')
          this.lysGrp.addLayer(feaLys).addTo(map)
          this.featureLayers[id] = feaLys
        }
        index++
      } else {
        clearInterval(timeId)
      }
    }, 100)
  }
  deletePolylineAndMarker (layer) {
    this.lysGrp.removeLayer(layer)
  }
  // 选择台风
  handleSelectTyphoon (record, selected, selectedRows) {
    if (selected) {
      const {id, name_cn} = record
      const {selectedRowKeys} = this.state
      selectedRowKeys.push(record.key)
      if (this.hasSearchTyphoonData[id]) {
        const rst = this.hasSearchTyphoonData[id]
        this.renderPolylineAndMarkerWithAction(this.map.leafletElement, rst, id)
        this.setState({typhoonPointList: rst, currentTyphoonName: name_cn, selectedRowKeys})
      } else {
        md_ajax.get('http://127.0.0.1/path', {params: {id}})
        .then((data) => {
          const rst = data.map((ele, index) => {
            ele._source.key = index
            const dateStr = ele._source.datetime
            const year = String.prototype.substr.call(dateStr, 0, 4)
            const month = String.prototype.substr.call(dateStr, 4, 2)
            const day = String.prototype.substr.call(dateStr, 6, 2)
            const hour = String.prototype.substr.call(dateStr, 8, 2)
            const minute = String.prototype.substr.call(dateStr, 10, 2)
            const secend = String.prototype.substr.call(dateStr, 12, 2)
            const date = new Date(year, month, day, hour, minute, secend)
            ele._source.datetime = `${year}年${month}月${day}日${hour}时${minute}分${secend}秒`
            ele._source.dateObject = date
            return ele._source
          })
          this.currentId = id
          this.hasSearchTyphoonData[id] = rst
          this.setState({typhoonPointList: rst, currentTyphoonName: name_cn, selectedRowKeys})
          this.renderPolylineAndMarkerWithAction(this.map.leafletElement, rst, id)
        })
      }
    } else {
      const {selectedRowKeys} = this.state
      let {dashPolylines, dashCircles} = this.state
      delete this.hasSearchTyphoonData[record.id]
      const filteredKeys = selectedRowKeys.filter((ele) => ele !== record.key)
      if (record.id === this.currentId) {
        dashPolylines = []
        dashCircles = []
      }
      this.deletePolylineAndMarker(this.featureLayers[record.id])
      this.featureLayers[record.id] = null
      this.setState({typhoonPointList: [], dashPolylines, dashCircles, selectedRowKeys: filteredKeys, currentTyphoonName: null})
    }
  }
  // 台风点击事件
  handleTyphoonClick (record, index, event) {
    const {id, name_cn} = record
    this.currentId = id
    if (this.hasSearchTyphoonData[id]) {
      const rst = this.hasSearchTyphoonData[id]
      this.setState({typhoonPointList: rst, currentTyphoonName: name_cn})
    } else {
      message.warning('请先勾选此选项！')
    }
  }
  handleTyphoonPointClick (record, index, event) {
    const {id, key} = record
    const data = this.hasSearchTyphoonData[id]
    const featureLayer = this.featureLayers[id].getLayers()
    const markers = featureLayer.slice(1)
    const curentMarker = markers[key]
    // const id = this.currentId
    // const data = this.hasSearchTyphoonData[id]
    // const dt = originalData.typhoonPointList[index].typhoonList
    // const forecastData = {}
    // const dashCircles = []
    // dt.map((ele1, index1) => {
    //   const publisher = ele1.typhoonPointList[0].fabuzhe
    //   const pos = ele1.typhoonPointList.map((ele2, index2) => {
    //     let center
    //     if (ele2.xianzaiweidu === '9999') {
    //       center = [parseFloat(ele2.yubaoweidu), parseFloat(ele2.yubaojindu)]
    //       dashCircles.push(<ForecastCircleMarker info={ele2} fill fillOpacity={1} key={`${index1}-${index2}`} center={center} radius={5} />)
    //     } else {
    //       center = [parseFloat(ele2.xianzaiweidu), parseFloat(ele2.xianzaijindu)]
    //       dashCircles.push(<NowCircleMarker info={ele2} fill fillOpacity={1} key={`${index1}-${index2}`} center={center} radius={5} />)
    //     }
    //     return center
    //   })
    //   forecastData[publisher] = {
    //     positions: pos,
    //     key: index1
    //   }
    // })
    this.renderForecastData(forecastData, dashCircles)
  }
  renderForecastData (forecastData, dashCircles) {
    const dashPolylines = []
    for (var key in forecastData) {
      if (forecastData.hasOwnProperty(key)) {
        var element = forecastData[key]
        dashPolylines.push(<Polyline color={DASH_POLYLINE_COLOR[key]} positions={element.positions} key={`dash-${element.key}`} dashArray={[5, 5]} />)
      }
    }
    this.setState({dashPolylines, dashCircles})
    this.forceUpdate()
  }
  renderfeatureLayers () {
    const {featureLayers} = this.state
    const truthPathDoms = []
    for (let key in featureLayers) {
      const data = this.hasSearchTyphoonData[key]
      if (featureLayers.hasOwnProperty(key)) {
        truthPathDoms.push(renderPolylineAndMarker(data, 'truth'))
      }
    }
    return truthPathDoms
  }
  render () {
    const {rectRight, rectBottom, typhoonList, typhoonPointList, currentTyphoonName, dashPolylines, dashCircles, selectedRowKeys, truthPathDoms} = this.state
    // const truthPathDoms = this.renderfeatureLayers()
    const columns = [{
      title: '台风编号',
      dataIndex: 'id'
    },
    {
      title: '台风名称',
      dataIndex: 'name_cn'
    }
    ]
    const typhoonInfoCol = [
      {
        title: '时间',
        dataIndex: 'datetime'
      },
      {
        title: '气压(hpa)',
        dataIndex: 'pressure'
      },
      {
        title: '风速(m/s)',
        dataIndex: 'move_speed'
      }
    ]
    return (
      <div style={{height: '100vh', boxSizing: 'border-box', overflow: 'hidden', paddingTop: 56}} id='md-window'>
        <Map center={position} zoom={5} className='md-map--container' ref={(ref) => { this.map = ref }}>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    />

        </Map>
        <Window>
          <Window.Item
            bounds='#aa'
            title='台风管理'
            className='md-drag--container'
            defaultPosition={{x: 60, y: 100}}
            mini
            expand
            width={250}
          >
            <div>
              <div>
                <Select
                  onChange={this.handleYearChange}
                  className='tfmanager-sel' defaultValue={this.state.yearsList[0].value}>
                  {this.state.yearsList.map((el, key) => {
                    return <Select.Option key={key} value={el.value}>{el.label}</Select.Option>
                  })}
                </Select>年
                <Button type='primary' icon='search' style={{marginLeft: 20}}>高级查询</Button>
              </div>
              <div style={{marginTop: 5}}>
                <Table bordered columns={columns} dataSource={typhoonList} size='small'
                  rowSelection={{
                    onSelect: this.handleSelectTyphoon,
                    selectedRowKeys,
                    onSelectAll: this.handleSelectAll
                  }}
                  pagination={{defaultPageSize: 5}}
                  onRowClick={this.handleTyphoonClick}
                  />
              </div>
              <div style={{marginTop: 5}}>
                <Button type='primary' size='small' style={{marginLeft: 20, marginRight: 20}} onClick={() => { this.handleClearAll() }}>清空</Button>
                <Checkbox>刷新</Checkbox>
                <Checkbox>报文</Checkbox>
              </div>
              <div>
                {currentTyphoonName ? <Tag color='blue'>{currentTyphoonName}</Tag> : null}
                <Table bordered columns={typhoonInfoCol} dataSource={typhoonPointList} size='small' pagination={{defaultPageSize: 5}}
                  onRowClick={this.handleTyphoonPointClick}
                 />
              </div>
            </div>

          </Window.Item>
          <Window.Item
            bounds='#aa'
            title='图例'
            className='md-drag--container'
            defaultPosition={{x: rectRight - 220, y: rectBottom - 400}}
            mini
            disable
            width={220}
            height={400}
          >
            <div className='wind-explain'>
              <div><span><span className='wind-explain-text'>热带低压</span><div className='wind-explain-color' style={{backgroundColor: 'rgb(39, 218, 34)'}} />小于17.2米/秒</span></div>
              <div><span><span className='wind-explain-text'>热带风暴</span> <div className='wind-explain-color' style={{backgroundColor: 'rgb(19, 26, 175)'}} />17.2 - 24.4米/秒</span></div>
              <div><span><span className='wind-explain-text'>强热带风暴</span> <div className='wind-explain-color' style={{backgroundColor: 'rgb(247, 239, 61)'}} />24.5 - 32.6米/秒</span></div>
              <div><span><span className='wind-explain-text'>台风</span> <div className='wind-explain-color' style={{backgroundColor: 'rgb(228, 141, 56)'}} />32.7 - 41.4米/秒</span></div>
              <div><span><span className='wind-explain-text'>强台风</span> <div className='wind-explain-color' style={{backgroundColor: 'rgb(239, 116, 219)'}} />41.5 - 50.9米/秒</span></div>
              <div><span><span className='wind-explain-text'>超强台风</span> <div className='wind-explain-color' style={{backgroundColor: 'rgb(234, 41, 41)'}} />大于51.0米/秒</span></div>
            </div>
            <div className='country-predicte'>
              <div className='ct-pre-title'>主观预报</div>
              <div className='ct-pre-content'>
                <Checkbox defaultChecked>中国<span className='ct-pre-cont-dash' style={{borderTopColor: '#ef0a0a'}} /></Checkbox>
                <Checkbox defaultChecked>美国<span className='ct-pre-cont-dash' style={{borderTopColor: 'rgb(219, 21, 224)'}} /></Checkbox>
                <Checkbox defaultChecked>日本<span className='ct-pre-cont-dash' style={{borderTopColor: 'rgb(91, 217, 228)'}} /></Checkbox>
                <Checkbox defaultChecked>香港<span className='ct-pre-cont-dash' style={{borderTopColor: 'rgb(239, 229, 9)'}} /></Checkbox>
                <Checkbox defaultChecked>台湾<span className='ct-pre-cont-dash' style={{borderTopColor: 'rgb(128, 85, 13)'}} /></Checkbox>
              </div>
            </div>
            <hr className='partirion-line' />
            <div className='add-content' >
              <Checkbox>台风标注</Checkbox>
              <Checkbox defaultChecked>选中动画</Checkbox>
              <Checkbox>风圈半径</Checkbox>
            </div>
          </Window.Item>
          <Window.Item
            bounds='#aa'
            title='距离检测'
            className='md-drag--container'
            defaultPosition={{x: rectRight - 430, y: rectBottom - 300}}
            mini
            disable
            width={200}
          />
          <Window.Item
            bounds='#aa'
            title='移向移速监测'
            className='md-drag--container'
            defaultPosition={{x: rectRight - 640, y: rectBottom - 300}}
            mini
            disable
            width={200}
          />
        </Window>
      </div>

    )
  }
}
