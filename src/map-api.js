/**
 * This class represents the Shareloc map API.
 *
 *
 * It offers functions to create a customized OpenLayers map with a base layer
 * by config as well as functions to add a marker and a popup to the map.
 *
 * @name Shareloc.MapApi
 * @constructor
 */
Shareloc.MapApi = function() {
    this._map = null;
    this._markerLayer = null;
};

/**
 * Creates an OpenLayers map object by the given configuration object and
 * renders it to a DIV with the ID 'map' in the DOM.
 *
 * Configuration must be in the format:
 *
 *       {
 *         X: 8.318049976895958,
 *         Y: 49.43451657605041,
 *         zoom: 14,
 *         bgLayer: "opentopomap",
 *         marker: "49.43707328904662,8.306307792663572",
 *         popupText: "foo-popup-text"
 *       }
 * @param  {Object} config the configuration object for the map
 * @return {ol.Map}        the created OpenLayers map
 * @memberof Shareloc.MapApi
 * @instance
 */
Shareloc.MapApi.prototype.map = function(config) {

    var layers = new Shareloc.Layers();

    // get the layer by the given URL param
    var layerObject = layers.createLayerObject(params.bgLayer);

    this._map = new ol.Map({
        target: 'map',
        layers: [
            layerObject
        ],
        view: new ol.View({
          // map will be recentered by extent on postrender
          center: ol.proj.transform([(params.X || 0), (params.Y || 0)], 'EPSG:4326', 'EPSG:3857'),
          zoom: (params.zoom || 2)
        }),
        controls: ol.control.defaults({
            attributionOptions: ({
                collapsible: false
            })
        }),
        logo: false
    });

    return this._map;
};

/**
 * Creates a marker feature on the map at the given position.
 *
 * The position must be a comma separated String containing lat and lon, e. g.
 * "49.43707328904662,8.306307792663572"
 *
 * @param  {String} markerPosString the position where the marker is drawn
 * @return {ol.Feature}             the created OpenLayers marker feature
 */
Shareloc.MapApi.prototype.marker = function (markerPos) {
    var markerPosArr = markerPos.split(",");
    var axisRotateCoords = [];
    axisRotateCoords[0] = parseFloat(markerPosArr[1]);
    axisRotateCoords[1] = parseFloat(markerPosArr[0]);
    var projCoords = ol.proj.transform(axisRotateCoords, 'EPSG:4326', 'EPSG:3857');

    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(projCoords)
    });

    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(({
            anchor: [12, 41],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            opacity: 0.95,
            src: './res/img/marker.png'
        }))
    });

    iconFeature.setStyle(iconStyle);

    if (this._markerLayer === null) {
        var markerSource = new ol.source.Vector({
            features: [iconFeature]
        });
        markerLayer = new ol.layer.Vector({
            source: markerSource
        });
        // add marker to map
        this._map.addLayer(markerLayer);
        this._markerLayer = markerLayer;
    }

    return iconFeature;
};

/**
 * Creates a popup at the given feature's position
 *
 * @param  {ol.Feature} markerFeat the marker feature to bin the popup to
 * @param  {String} popupText      the text to be shown in the popup
 */
Shareloc.MapApi.prototype.markerPopup = function(markerFeat, popupText) {

    // Popup showing the position the user clicked
    var popup = new ol.Overlay({
        element: document.getElementById('popup')
    });
    this._map.addOverlay(popup);

    // exit if no text is provided
    var popuptext = popupText;
    if(!popuptext || popuptext === '') {
        return;
    }

    var element = popup.getElement();
    popuptext = popuptext.replace(/\n|\r\n|\r/g, "<br>");

    $(element).popover('destroy');
    popup.setPosition(markerFeat.getGeometry().getCoordinates());
    // the keys are quoted to prevent renaming in ADVANCED mode.
    $(element).popover({
        'placement': 'top',
        'animation': false,
        'html': true,
        'content': '<p>' + popuptext + '</p>'
    });
    $(element).popover('show');

    if(this._markerLayer !== null) {
        // to avoid positioning issues show again when marker is completely rendered
        this._markerLayer.on('postcompose', function(event) {
            if (markerLayer.getVisible()) {
                $(element).popover('show');
            }
        });
    }
};
