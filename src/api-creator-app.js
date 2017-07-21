/**
 * Application for the GUI based creation of Shareloc permalinks.
 *
 * @name Shareloc.ApiCreatorApp
 */
Shareloc.ApiCreatorApp = function(_map) {

    var map = _map,
        drawMarker,
        popup;

    // ensure we have updated permalinks
    map.on('moveend', function() {
        updatePermalinks();
    });

    // create a list entry for each layer
    var layers = new Shareloc.Layers();
    $.each(layers.layerList, function(lid, lobj) {

        var layerObj = getMapLayerById(lid),
            active = '';
        if (layerObj && layerObj.getVisible()) {
            active = 'active';
        }

        $('#layers .list-group').append(
            '<li id="' + lid + '" class="list-group-item ' + active + '">' + lobj.title +
                 '<br><span style="font-size: smaller;">' + lobj.desc +
                 '</span>' +
            '</li>'
        );
    });

    // TODO refactor
    $('#layers .list-group-item').each(function() {
        var layerId = $(this).attr('id'),
            layerItem = $(this),
            layerObj = getMapLayerById(layerId);

        // activate a layer by click
        $(this).click(function() {
            var found = false;
            var ll;
            map.getLayers().forEach(function(layer) {
                if(layer.get('lid') === layerId) {
                    found = true;
                    ll = layer;
                }
                layer.setVisible(false);
            });
            if (found === false) {
                ll = layers.createLayerObject(layerId.replace('__', '.'));
                map.addLayer(ll);
            }
            $('.active').removeClass('active');
            layerItem.addClass('active');
            ll.setVisible(true);

            // ensure marker layer is visible
            markerLayer.setVisible(true);
            // raise marker layer to the top
            map.getLayers().remove(markerLayer);
            map.getLayers().push(markerLayer);

            $('a[href="#layers"]').click();
            updatePermalinks();
        });
    });

    // create a marker layer
    var markerSource = new ol.source.Vector();
    // register a handler
    markerSource.on('addfeature', onFeatureAdd);
    var markerLayer = new ol.layer.Vector({
        name: 'markerlayer',
        source: markerSource,
        style: new ol.style.Style({
                fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Icon(({
                anchor: [12, 41],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                opacity: 0.95,
                src: './res/img/marker.png'
            }))
        })
    });
    map.addLayer(markerLayer);

    $(document).ready(function ($) {
        // enable/disable marker draw interaction depending
        // on the active tab in the UI
        $('#tabs a.tool-tab').click(function( event ) {
            event.preventDefault();
            $(this).tab('show');

            if($(this).attr('href') === '#marker') {
                drawMarker = new ol.interaction.Draw({
                    source: markerSource,
                    type: /** @type {ol.geom.GeometryType} */ ('Point')
                });
                map.addInteraction(drawMarker);

            } else {
                map.removeInteraction(drawMarker);
            }
        });

        // update the marker popup on typing
        $('#popuptext').keyup(createMarkerPopup);

        // toggle visibility of buutin for opening/closing the UI
        $('.close-x-btn.close-ui').click(function() {
            $('#sidebar').css('display', 'none');
            $('#show-ui').css('display', 'block');
        });
        $('#show-ui button').click(function() {
            $('#sidebar').css('display', 'block');
            $('#show-ui').css('display', 'none');
        });

        $('#info-btn').click(function() {
            $('#info-modal').modal('show');
        });

        // show the location of the user
        var geolocation = new ol.Geolocation({
            // take the projection to use from the map's view
            projection: map.getView().getProjection()
        });
        // listen to changes in position
        var geolocOverlay;
        $('#geolocation-btn').click(function() {
            if(geolocation.getTracking() === true) {
                $('#geolocation-btn').removeClass("btn-success");
                geolocation.setTracking(false);
                map.removeLayer(geolocOverlay);
            } else {
                $('#geolocation-btn').addClass("btn-success");
                geolocation.setTracking(true);
            }
        });
        // update map when position changes
        geolocation.on('change', function(evt) {
            var pos = geolocation.getPosition();
            var positionFeature = new ol.Feature({
                geometry: new ol.geom.Point(pos)
            });
            var accuracyFeature = new ol.Feature({
                geometry: geolocation.getAccuracyGeometry()
            });
            if(geolocOverlay) {
                map.removeLayer(geolocOverlay);
            }
            geolocOverlay = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [accuracyFeature, positionFeature]
                })
            });
            map.addLayer(geolocOverlay);
            map.getView().fit(accuracyFeature.getGeometry());
        });
        // deactivate geoloaction tracking when error occurs
        geolocation.on('error', function(evt) {
            $('#geolocation-btn').removeClass("btn-success");
            geolocation.setTracking(false);
            map.removeLayer(geolocOverlay);
            alert('Positioning not possible ' + evt.message);
        });

        updatePermalinks();
    });

    /**
     * Returns the map layer by the given layer ID (lid)
     *
     * @param  {String} lid the layer ID
     * @return {ol.layer}   the layer with the given lid
     * @private
     */
    function getMapLayerById(lid) {
        var layer = null;
        map.getLayers().forEach(function(ll) {
            if(ll.get('lid') === lid) {
                layer = ll;
            }
        });
        return layer;
    }

    /**
     * Handles the featureadd event of our marker layer
     *
     * @private
     */
    function onFeatureAdd(evt) {
        if(evt.feature) {
            drawMarkerFeat(evt.feature);
        }
    }

    /**
     * Draws the marker feature on the map by the given point feature
     *
     * @private
     */
    function drawMarkerFeat(markerFeat) {
        markerSource.clear();
        markerSource.un('addfeature', onFeatureAdd);
        markerSource.addFeature(markerFeat);
        markerSource.on('addfeature', onFeatureAdd);

        // get the marker coordinates and transform to WGS84
        var projMarkerCoords = ol.proj.transform(
                markerFeat.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'),
            x = projMarkerCoords[1],
            y = projMarkerCoords[0];

        $('#marker-x').text('LAT: ' + x);
        $('#marker-y').text('LON: ' + y);

        // create a possible marker, if the
        // textarea is filled
        createMarkerPopup();

        // update the links when changing the marker
        updatePermalinks();
    }

    /**
     * Updates the Permalink information in the UI
     *
     * @private
     */
    function updatePermalinks() {
        window.location.hash = Shareloc.Permalink.createHash(map);
        var pl = Shareloc.Permalink.createPermalinkUrl(map);
        $('#code #embed-pl.list-group-item a.pl-link').attr('href', pl);
        $('#code #embed-pl.list-group-item a.pl-mail').attr('href',
                'mailto:?body=' + encodeURIComponent(pl) + '%0D%0A%0D%0Acreated by Shareloc');
        $('#code #embed-iframe.list-group-item').text(Shareloc.Permalink.createIframeCode(map));
    }

    /**
     * Creates the marker popup
     *
     * @private
     */
    function createMarkerPopup() {
        if(!popup) {
            // Popup showing the position the user clicked
            popup = new ol.Overlay({
                element: document.getElementById('popup')
            });
            map.addOverlay(popup);
        }
        var element = popup.getElement();
        // destroy the old popup
        $(element).popover('destroy');

        // exit if no text is provided
        var popuptext = $('#popuptext').val();
        if(!popuptext || popuptext === '') {
            updatePermalinks();
            return;
        }
        popuptext = popuptext.replace(/\n|\r\n|\r/g, "<br>");

        var markerFeat = markerSource.getFeatures()[0];

        if(markerFeat) {
            popup.setPosition(markerFeat.getGeometry().getCoordinates());
            // the keys are quoted to prevent renaming in ADVANCED mode.
            $(element).popover({
              'placement': 'top',
              'animation': false,
              'html': true,
              'content': '<p>' + popuptext + '</p>'
            });
            $(element).popover('show');

            map.popup = popup;

            updatePermalinks();
        }
    }
};
