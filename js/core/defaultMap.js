class DefaultMap {
    
    /**
     * 
     * @param {*} mapId : The DOM element id for map mounting
     * @param {*} center : A mappingCore.GeoPoint
     * @param {*} zoom : zoom level
     */
    constructor(mapId, center, zoom=8) {
        this._mapboxToken = 'pk.eyJ1Ijoiam9uamFuZWxsZSIsImEiOiJjazhxbXg0YmswNW5kM2RvNGNjb2hiN2poIn0.LiFKVlPQe_vqyqjjIw0DIw';
        
        this.markers = {};
        this.center = center
        this.map = L.map(mapId, {center: [center.latitude, center.longitude], zoom: zoom, layers: this._getBasemaps()});
        this.map.zoomControl.setPosition('topleft');
        this.layerGroup = L.layerGroup().addTo(this.map);
        L.control.layers(this._baseMaps,{}).addTo(this.map);
    }
    
    _getBasemaps() {
        this._baseMaps = {
            "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
                        {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),
            "Dark": L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token='+this._mapboxToken, 
                        {id: 'mapbox/dark-v10', attribution: "&copy; Mapbox dark", tileSize: 512, zoomOffset: -1}),
            "Light": L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token='+this._mapboxToken, 
                        {id: 'mapbox/light-v10', attribution: "&copy; Mapbox light", tileSize: 512, zoomOffset: -1}),
            "Default": L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token='+this._mapboxToken, 
                        {id: 'mapbox/streets-v11', attribution: "&copy; Mapbox streets", tileSize: 512, zoomOffset: -1})
        };

        return Object.values(this._baseMaps);
    }

    setPosition(geoPoint, zoom) {
        this.map.setView([geoPoint.latitude, geoPoint.longitude], zoom);
    }

    addMarker(geoPoint, key, icon = null) {
        let iconOption = icon ? {icon: icon} : {};
        let marker = L.marker([geoPoint.latitude, geoPoint.longitude], iconOption).addTo(this.layerGroup);
        this.markers[key] = marker;
    }

    addMarkerPopup(key, html) {
        this.markers[key].bindPopup(html);
    }

    clearMarkers() {
        this.layerGroup.clearLayers();
        this.markers = {};
    }

    fitMarkerBounds() {
        const nMarkers = Object.keys(this.markers).length;
        if (nMarkers > 1) {
            const group = new L.featureGroup(Object.values(this.markers));
            this.map.fitBounds(group.getBounds());
        } else if (nMarkers === 1) {
            var markerBounds = L.latLngBounds([Object.values(this.markers)[0].getLatLng()]);
            this.map.fitBounds(markerBounds);
        }
    }
}