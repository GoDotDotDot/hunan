import L from 'leaflet'
import drawTyphoonCirleByCanvas from './stormCircle.js'

L.stormCircle = L.Layer.extend({
  initialize: function (data, options) {
    L.setOptions(this, options)
    L.stamp(this)
    this._layers = this._layers || {}
    this.data = data
  },
  onAdd: function () {
    var container = this._container = document.createElement('canvas')
    this._ctx = container.getContext('2d')
    this.getPane().appendChild(this._container)
    drawTyphoonCirleByCanvas(this._container, this.data)
  },
  redraw: function () {
    this.clear()
    this._draw()
  },
  clear: function () {
    this._ctx.clearRect(0, 0, this._container.width, this._container.height)
  },
  _draw: function () {

  }
})

/**
 *   L.Typhoon = L.Path.extend({
        initialize: function(t, e, i) {
            L.Path.prototype.initialize.call(this, i),
            this._latlng = L.latLng(t),
            this._circle = e
        },
        options: {
            fill: !0
        },
        setLatLng: function(t) {
            return this._latlng = L.latLng(t),
            this.redraw()
        },
        setCircle: function(t) {
            return this._circle = t,
            this.redraw()
        },
        setLatLng_Circle: function(t, e) {
            return this._latlng = L.latLng(t),
            this._circle = e,
            this.redraw()
        },
        projectLatlngs: function() {
            try {
                var e = this._latlng;
                this._point = this._map.latLngToLayerPoint(e);
                var t_northeast = this._getLngRadius(this._getLatRadius(this._circle[1] * 1000))
                  , i_northeast = this._map.latLngToLayerPoint([e.lat, e.lng - t_northeast]);
                this._radius_northeast = Math.max(this._point.x - i_northeast.x, 1);
                var t_southeast = this._getLngRadius(this._getLatRadius(this._circle[2] * 1000))
                  , i_southeast = this._map.latLngToLayerPoint([e.lat, e.lng - t_southeast]);
                this._radius_southeast = Math.max(this._point.x - i_southeast.x, 1);
                var t_southwest = this._getLngRadius(this._getLatRadius(this._circle[3] * 1000))
                  , i_southwest = this._map.latLngToLayerPoint([e.lat, e.lng - t_southwest]);
                this._radius_southwest = Math.max(this._point.x - i_southwest.x, 1);
                var t_northwest = this._getLngRadius(this._getLatRadius(this._circle[4] * 1000))
                  , i_northwest = this._map.latLngToLayerPoint([e.lat, e.lng - t_northwest]);
                this._radius_northwest = Math.max(this._point.x - i_northwest.x, 1)
            } catch (e) {
                this._radius_northeast = null;
                this._radius_southeast = null;
                this._radius_southwest = null;
                this._radius_northwest = null
            }
        },
        getBounds: function() {
            var t = this._getLngRadius(this._getLatRadius(this._circle[1] * 1000))
              , e = (this._circle[1] * 1000) / 40075017 * 360
              , i = this._latlng;
            return new o.LatLngBounds([i.lat - e, i.lng - t],[i.lat + e, i.lng + t])
        },
        getLatLng: function() {
            return this._latlng
        },
        getPathString: function() {
            if (this._radius_northeast && this._radius_southeast && this._radius_southwest && this._radius_northwest) {
                var t = this._point;
                var e_northeast = this._radius_northeast;
                var path_svg = "M" + t.x + "," + (t.y - e_northeast);
                var path_vml = "M" + t.x + "," + (t.y - e_northeast);
                path_svg += "A" + e_northeast + "," + e_northeast + ",0,0,1," + (t.x + e_northeast) + "," + t.y;
                path_vml += " ae " + t.x + "," + t.y + " " + e_northeast + "," + e_northeast + " " + 65535 * 450 + "," + -5898150;
                var e_southeast = this._radius_southeast;
                path_svg += "L" + (t.x + e_southeast) + "," + t.y;
                path_svg += "A" + e_southeast + "," + e_southeast + ",0,0,1," + t.x + "," + (t.y + e_southeast);
                path_vml += " ae " + t.x + "," + t.y + " " + e_southeast + "," + e_southeast + " " + 65535 * 360 + "," + -5898150;
                var e_southwest = this._radius_southwest;
                path_svg += "L" + t.x + "," + (t.y + e_southwest);
                path_svg += "A" + e_southwest + "," + e_southwest + ",0,0,1," + (t.x - e_southwest) + "," + t.y;
                path_vml += " ae " + t.x + "," + t.y + " " + e_southwest + "," + e_southwest + " " + 65535 * 270 + "," + -5898150;
                var e_northwest = this._radius_northwest;
                path_svg += "L" + (t.x - e_northwest) + "," + t.y;
                path_svg += "A" + e_northwest + "," + e_northwest + ",0,0,1," + t.x + "," + (t.y - e_northwest) + "z";
                path_vml += " ae " + t.x + "," + t.y + " " + e_northwest + "," + e_northwest + " " + 65535 * 180 + "," + -5898150 + "X";
                return L.Browser.svg ? path_svg : path_vml
            }
            return ""
        },
        onAdd: function(t) {
            this._map = t,
            this._container || (this._initElements(),
            this._initEvents()),
            this.projectLatlngs(),
            this._updatePath(),
            this._container && this._map._pathRoot.insertBefore(this._container, document.getElementById("gl_48").nextSibling),
            this.fire("add"),
            t.on({
                viewreset: this.projectLatlngs,
                moveend: this._updatePath
            }, this)
        },
        getCircle: function() {
            return this._circle
        },
        _getLatRadius: function(r) {
            return r / 40075017 * 360
        },
        _getLngRadius: function(lr) {
            return lr / Math.cos(L.LatLng.DEG_TO_RAD * this._latlng.lat)
        }
    }),
    L.typhoon = function(t, e, i) {
        return new L.Typhoon(t,e,i)
    }
 */
