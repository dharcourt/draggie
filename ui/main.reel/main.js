/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component,
    L = require("node_modules/leaflet/dist/leaflet.js");

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {

    constructor: {
        value: function Main() {
            this.super();
        }
    },

    _map: {
        value: null
    },

    willDraw: {
        value: function () {
            if (this._map === null) {
                this._map = L.map(this.element.querySelector(".Main-map")).setView([41.8925, 12.4844], 4);
                L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/WMTS?service=WMTS&version=1.0.0&request=gettile&format=image/png&tileMatrix={z}&TileRow={y}&TileCol={x}&style=default&tileMatrixSet=default028mm', {
                    attribution: 'test',
                    maxZoom: 18
                }).addTo(this._map);
            }
        }
    }

});
