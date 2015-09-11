/**
 * A class representing the permalink functionality of Shareloc.
 *
 * @name Shareloc.Permalink
 * @constructor
 */
Shareloc.Permalink = function(loc) {

    var location = loc,
        params,
        hash,
        hashSplitter = "/";

    /**
     * Checks if the underlying location contains a hash.
     *
     * @return {Boolean}
     * @memberof Shareloc.Permalink
     * @instance
     */
    this.hasHash = function() {
        if(!hash) {
            hash = location.hash;
        }
        return hash.length !== 0;
    };

    /**
     * Returns the hash string of the underlying location.
     *
     * @return {String} the hash object
     * @memberof Shareloc.Permalink
     * @instance
     */
    this.getFullHash = function() {
        if(!hash) {
            hash = location.hash;
        }
        return hash;
    };

    /**
     * Returns a object representation of the hash string, e. g.:
     *
     *       {
     *         zoom: "2",
     *         X: "50.02345",
     *         Y: "8.161234",
     *         bgLayer: "osm.base"
     *       }
     *
     * @return {Object} object holding the key-value-pairs of the hash
     * @memberof Shareloc.Permalink
     * @instance
     */
    this.getHashObject = function() {
        var fh = this.getFullHash();
        var fhParts = fh.split(/(.+)=(.+)\/(.+)\/(.+)&(.+)=(.+)/i);
        return {
            zoom: fhParts[2],
            X: fhParts[4],
            Y: fhParts[3],
            bgLayer: fhParts[6]
        };
    };

    /**
     * Returns the URL parameters of the underlying location, e.g.:
     *
     *       {
     *         X: "8.318049976895958",
     *         Y: "49.43451657605041",
     *         zoom: "14",
     *         bgLayer: "opentopomap",
     *         marker: "49.43707328904662,8.306307792663572",
     *         popupText: "foo-popup-text"
     *       }
     *
     * @return {Object} object holding the key-value-pairs of the URL params
     * @memberof Shareloc.Permalink
     * @instance
     */
    this.getParams = function() {

        if (!params) {
            var match,
                pl     = /\+/g,  // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
                query  = loc.search.substring(1);

            urlParams = {};
            /* jshint ignore:start */
            while (match = search.exec(query))
               urlParams[decode(match[1])] = decode(match[2]);
            /* jshint ignore:end */
            params = urlParams;
        }
        return params;
    };
};

/**
 * Creates the Shareloc URL hash representing the state of the given map. The
 * following information is taken into account:
 *   - center
 *   - zoom level
 *   - current base layer
 *
 *
 *  The has is returned in this form
 *
 *    ```map=14/49.43451657605041/8.318049976895958&layers=opentopomap```
 *
 * @param  {ol.Map} map the map to get the hash for
 * @return {String}     the hash representing the map's state
 * @function createHash
 * @static
 */
Shareloc.Permalink.createHash = function(map) {
    var hash = "#map=",
        center = map.getView().getCenter(),
        projCenter = ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326'),
        lid = null;

    hash += map.getView().getZoom() + "/";
    hash += projCenter[1] + "/";
    hash += projCenter[0];

    map.getLayers().forEach(function(layer) {
        if (layer.getVisible() && layer.get('lid')) {
            lid = layer.get('lid');
        }
    });

    if(!lid) {
        lid = "osm.base";
    }

    hash += "&layers=" + lid;
    return hash;
};

/**
 * Creates the Shareloc permalink URL representing the state of the given map.
 * The following information is taken into account:
 *   - center
 *   - zoom level
 *   - current base layer
 *   - marker position (optional)
 *   - marker popup text
 *
 *
 *  The has is returned in this form
 *
 *    ```http://myhost/share.html?zoom=14&X=8.318049976895958&Y=49.43451657605041&bgLayer=opentopomap&marker=49.43707328904662,8.306307792663572&popupText=foo-popup-text```
 *
 * @param  {ol.Map} map the map to get the permalink for
 * @return {String}     the permalink representing the map's state
 * @static
 */
Shareloc.Permalink.createPermalinkUrl = function(map) {
    var pl = window.location.origin + window.location.pathname + "share.html?",
        center = map.getView().getCenter(),
        projCenter = ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326'),
        lid,
        markerLayer;

    pl += "zoom=" + map.getView().getZoom() + "&";
    pl += "X=" + projCenter[0] + "&";
    pl += "Y=" + projCenter[1] + "&";

    map.getLayers().forEach(function(layer) {
        if (layer.getVisible() && layer.get('lid')) {
            lid = layer.get('lid');
        }

        if (layer.get('name') === 'markerlayer') {
            markerLayer = layer;
        }
    });

    pl += "bgLayer=" + lid;

    // detect a possible marker
    if (markerLayer) {
        var marker = markerLayer.getSource().getFeatures()[0];
        if (marker) {
            var markerPoint = marker.getGeometry();
            var projMarkerCoords = ol.proj.transform(markerPoint.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
            pl += "&marker=" + projMarkerCoords[1] + "," + projMarkerCoords[0];
        }
        // text for a popup
        if(map.popup) {
            var popuptext = $('.popover-content > p').html();
            if(popuptext && popuptext !== '') {
                pl += "&popupText=" + popuptext;
            }

        }
    }

    return pl;
};

/**
 * Creates the Iframe code with the current Shareloc permalink
 * (derived by {@link #createPermalinkUrl} of the given map as source. The size
 * of the Iframe defined by the current map size.
 *
 * @param  {ol.Map} map the map to get the Iframe for
 * @return {String}     the Iframe code representing the map
 * @static
 */
Shareloc.Permalink.createIframeCode = function(map) {

    var pl = Shareloc.Permalink.createPermalinkUrl(map),
        mapSize = map.getSize(),
        code;

    code = '<iframe width="' + mapSize[0] + '" height="' + mapSize[1] + '" ' +
        'frameborder="0" scrolling="no" ' +
        'marginheight="0" marginwidth="0" ' +
        'src="' + pl + '"' +
        'style="border: 0"></iframe>';

    return code;
};
