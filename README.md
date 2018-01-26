# ![](https://apps.meggsimum.de/shareloc/res/img/shareloc-logo-mini.png) Shareloc #

The free and open map API to create and share web maps based on
[OpenLayers](https://openlayers.org).

[![license: 3-Clause BSD](https://img.shields.io/badge/license-3--Clause%20BSD-brightgreen.svg)](https://github.com/meggsimum/shareloc/blob/master/LICENSE)

Watch the online demo at https://apps.meggsimum.de/shareloc/

![ScreenShot](https://user-images.githubusercontent.com/1185547/31016859-c1c22290-a526-11e7-8996-9257ec8477ed.png)

At the moment there are a few free map layers based on open data included in the
online demo. But it is easily possible to include your own layers (e. g. WMS) in
your Shareloc instance (see section [Build and deploy your own Shareloc instance](https://github.com/meggsimum/shareloc#build-and-deploy-your-own-shareloc-instance)).

### Create maps without coding via web application ###

With Shareloc it is possible to create your OpenLayers web map without any
coding. With the [Shareloc web application](https://apps.meggsimum.de/shareloc/) you can
  - configure your map view
  - add a marker to point at a special place and
  - optionally add a text in a bubble to your marker.

Afterwards you can share your map by a simple link or embed the map in your own website.

### Use Shareloc JavaScript API ###

Shareloc offers an easy-to-use JavaScript API to create your own OpenLayers
maps. Therefore you just have to include the Shareloc JavaScript lib into your
HTML page. Now with a few lines of code it is possible to create a customized
OpenLayers map.

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
Check out the [API docs](https://meggsimum.github.io/shareloc/docs/) to see all
possibilities Shareloc offers.

### Build and deploy your own Shareloc instance ###

* Clone this repository
* npm and grunt need to be installed on your system
* ``npm install``
* ``grunt build``
* Copy the ``build`` folder to your webserver
* Optonally you can edit the ``build/conf/layers.json`` file to add your own
layers to Shareloc
* That's it

### Development ###

* Fork and clone this repository
* npm and grunt need to be installed on your system
* Run ``npm install`` on command line
* Run ``grunt`` on command line
* Open ``http://localhost:7000/`` or ``http://localhost:7000/share.html`` in
your browser to see the development version of Shareloc
* In case you changed the HTML templates under ``tpl/`` please restart the server
with the commands ``CTRL + C`` and ``grunt``

### Contributions welcome ###
Any kind of contribution is warmly welcome:

* Documentation
* Bug reporting
* Bug fixes
* Code enhancements

### Credits ###
Thanks to all map providers, who grant free access to their maps, which are used
in the online demo:

* [OpenStreetMap](https://www.openstreetmap.org/)
* [Bundesamt für Kartographie und Geodäsie](http://www.bkg.bund.de/)
* [terrestris](https://terrestris.de/)
* [OpenTopoMap](https://opentopomap.org/)


### Who do I talk to? ###
You need more information or support? Please contact us at

`info__(at)__meggsimum__(dot)__de`
