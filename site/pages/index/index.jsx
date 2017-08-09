import React from 'react'
import ReactDOM from 'react-dom'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import md_ajax from 'md_midware/md-service/md-ajax'
import Window from 'md_components/panel'
import 'element-theme-default'
import '../../styles/color.css'
import './index.css'
import { outerHeight, outerWidth, getOffsetLeft, getOffsetTop } from '../../../utils/dom/domFns'
import { Select, Button, Table } from 'antd'

const position = [51.505, -0.09]

export default class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      rectRight: 0,
      rectBottom: 0,
      yearsList: [
        {value: '2017', label: '2017'},
        {value: '2016', label: '2016'},
        {value: '2015', label: '2015'},
        {value: '2014', label: '2014'}

      ]
    }
  }
  componentDidMount () {
    const ownerNode = ReactDOM.findDOMNode(this)
    const nodeHeight = outerHeight(ownerNode)
    const nodeWidth = outerWidth(ownerNode)
    const nodeOffsetLeft = getOffsetLeft(ownerNode)
    const nodeOffsetTop = getOffsetTop(ownerNode)
    this.setState({rectRight: nodeOffsetLeft + nodeWidth, rectBottom: nodeOffsetTop + nodeHeight})
  }
  render () {
    const {rectRight, rectBottom} = this.state
    const columns = [{

      title: '台风编号',
      dataIndex: 'age'
    }, {
      title: '台风名称',
      dataIndex: 'address'
    }]
    const data = [{
      key: '1',

      age: 201702,
      address: '苗柏'
    }, {
      key: '2',

      age: 201701,
      address: '梅花'
    }, {
      key: '3',

      age: 201703,
      address: '无名'
    }]
    return (
      <div style={{height: '100vh', boxSizing: 'border-box', overflow: 'hidden', paddingTop: 56}} id='md-window'>
        <Map center={position} zoom={13} className='md-map--container'>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    />
          <Marker position={position}>
            <Popup keepInView minWidth={150}>
              <span>A pretty CSS3 popup.<br />Easily customizable.</span>
            </Popup>
          </Marker>
        </Map>
        <Window>
          <Window.Item
            bounds='#aa'
            title='台风管理'
            className='md-drag--container'
            defaultPosition={{x: 20, y: 180}}
            mini
            expand
            width={250}
          >
            <div>
              <div>
                <Select className='tfmanager-sel' defaultValue={this.state.yearsList[0].value}>
                  {this.state.yearsList.map((el, key) => {
                    return <Select.Option key={key} value={el.value}>{el.label}</Select.Option>
                  })}
                </Select>年
                <Button type='primary' icon='search' style={{marginLeft: 20}}>高级查询</Button>
              </div>
              <div style={{marginTop: 5}}>
                <Table bordered columns={columns} dataSource={data} size='small'
                  rowSelection={{

                  }} />
              </div>
            </div>

          </Window.Item>
          <Window.Item
            bounds='#aa'
            title='图例'
            className='md-drag--container'
            defaultPosition={{x: rectRight - 220, y: rectBottom - 300}}
            mini
            disable
            width={220}
            height={300}
          >
            <div className='wind-explain'>
              <div><span><span className='wind-explain-text'>热带低压</span><div className='wind-explain-color' style={{backgroundColor: 'rgb(39, 218, 34)'}} />小于17.2米/秒</span></div>
              <div><span><span className='wind-explain-text'>热带风暴</span> <div className='wind-explain-color' style={{backgroundColor: 'rgb(19, 26, 175)'}} />17.2 - 24.4米/秒</span></div>
              <div><span><span className='wind-explain-text'>强热带风暴</span> <div className='wind-explain-color' style={{backgroundColor: 'rgb(247, 239, 61)'}} />24.5 - 32.6米/秒</span></div>
              <div><span><span className='wind-explain-text'>台风</span> <div className='wind-explain-color' style={{backgroundColor: 'rgb(228, 141, 56)'}} />32.7 - 41.4米/秒</span></div>
              <div><span><span className='wind-explain-text'>强台风</span> <div className='wind-explain-color' style={{backgroundColor: 'rgb(239, 116, 219)'}} />41.5 - 50.9米/秒</span></div>
              <div><span><span className='wind-explain-text'>超强台风</span> <div className='wind-explain-color' style={{backgroundColor: 'rgb(234, 41, 41)'}} />大于51.0米/秒</span></div>
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
