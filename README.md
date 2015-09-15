# ![](http://apps.meggsimum.de/shareloc/res/img/shareloc-logo-mini.png) Shareloc #

The free and open map API to create and share web maps based on
[OpenLayers 3](http://openlayers.org).

Watch the online demo at http://apps.meggsimum.de/shareloc/

At the moment there are a few free map layers based on open data included in the online demo. But it is easily possible to include your own layers (e. g. WMS) in your Shareloc instance.

### Use by JavaScript API ###

Shareloc offers an easy-to-use JavaScript API to create your own OpenLayers 3 maps. Therefore you just have to include the Shareloc JavaScript lib into your HTML page. Now with a few lines of code it is possible to create a customized OpenLayers map.

```javascript
var api = new Shareloc.MapApi();
var params = {
    // lon of map center
    X: 8.318049976895958,
    // lat of map center
    Y: 49.43451657605041,
    // initial map zoom level
    zoom: 14,
    // layer
    bgLayer: "osm.base"
};
// create and return your ol3 map instance
var olMap = api.map(params);

```
Check out the [API docs](http://meggsimum.github.io/shareloc/docs/) to see all
possibilities Shareloc offers.

### Use by web application ###

With Shareloc it is possible to create your OpenLayers 3 web map without any coding. By a [web application](http://apps.meggsimum.de/shareloc/) you can configure your map view, add a marker to point at a special place and optionally add a text in a bubble to your marker. Afterward you can share your map by a simple link or embed the map in your own website.

### Build and deploy your own Shareloc instance ###

* Clone this repository
* npm and grunt need to be installed on your system
* ``npm install``
* ``grunt build``
* Copy the ``build`` folder to your webserver
* Optonally you can edit the ``build/conf/layers.json`` file to add your own layers to Shareloc
* That's it

### Development ###

* Clone this repository
* npm and grunt need to be installed on your system
* ``npm install``
* ``grunt`` (only once or in case you change the HTML templates under ``tpl/``)
* Open ``index.html`` or ``share.html`` to see your changes

### Contributions welcome ###
Any contribution is warmly welcome:

* Documentation
* Bug reporting
* Bug fixes
* Code enhancements

### Credits ###
Thanks to all map providers, who grant free access to their maps, which are used in the online demo:

* [OpenStreetMap](http://www.openstreetmap.org/)
* [terrestris](http://terrestris.de/)
* [MapQuest](http://www.mapquest.com/)
* [OpenTopoMap](http://opentopomap.org/)


### Who do I talk to? ###
You need more information or support? Please contact us at

info__(at)__meggsimum__(dot)__de
