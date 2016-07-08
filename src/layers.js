/**
 * The class holding the layer configuration object. Also offers functions to
 * access the layer objects of Shareloc.
 *
 * Loads the JSON configuration stored at conf/layers.json
 *
 * @name Shareloc.Layers
 */
Shareloc.Layers = function() {
    // load the layer configuration JSON
    $.ajax({
        url: "conf/layers.json",
        async: false,
        context: this
    }).done(function(jsonObj) {
        this.layerList = jsonObj;
    });
};

/**
 *
 */
Shareloc.Layers.prototype.getLayerConfig = function(id) {
    return this.layerList[id];
};

/**
 *
 */
Shareloc.Layers.prototype.createLayerObject = function(id) {
    var conf = this.layerList[id];

    if (conf) {
        switch (conf.type) {
        case 'TileWMS':
            return this.createWms(conf, id);
        case 'OSM':
            return this.createOsm(conf, id);
        case 'XYZ':
            return this.createXyz(conf, id);
        default:
            break;
        }
    } else {
        return this.createOsm(conf, id);
    }
};

/**
 * Creates an OpenLayers WMS layer
 *
 * @param  {Object} layerConf layer configuration object
 * @param  {String} lid       unique layer ID
 * @return {ol.layer.Tile}    the layer object
 * @private
 */
Shareloc.Layers.prototype.createWms = function(layerConf, lid) {
    return new ol.layer.Tile({
        lid: lid,
        source: new ol.source.TileWMS(({
            url: layerConf.url,
            params: {'LAYERS': layerConf.layer, 'TILED': true},
            attributions: [new ol.Attribution({
                html: 'WMS &copy; ' + layerConf.attribution
            })]
        }))
    });
};

/**
 * Creates an OpenLayers OSM layer
 *
 * @param  {Object} layerConf layer configuration object
 * @param  {String} lid       unique layer ID
 * @return {ol.layer.Tile}    the layer object
 * @private
 */
Shareloc.Layers.prototype.createOsm = function(layerConf, lid) {
    return new ol.layer.Tile({
        lid: lid,
        source: new ol.source.OSM()
    });
};

/**
 * Creates an OpenLayers XYZ layer
 *
 * @param  {Object} layerConf layer configuration object
 * @param  {String} lid       unique layer ID
 * @return {ol.layer.Tile}    the layer object
 * @private
 */
Shareloc.Layers.prototype.createXyz = function(layerConf, lid) {
    return new ol.layer.Tile({
        lid: lid,
        source: new ol.source.XYZ({
            attributions: [new ol.Attribution({
                html: layerConf.attribution
            })],
            url: 'http://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
        })
    });
};
