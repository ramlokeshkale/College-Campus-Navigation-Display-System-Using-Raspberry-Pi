var thisyahloc;
var marker;
//var thisPin = thePin.pin;

// create the slippy map
map = L.map('themap', {
    minZoom: 1,
    maxZoom: 2.1,
    center: [0, 0],
    zoom: 1,
    crs: L.CRS.Simple,
    zoomControl: false
});


// disable zooming and panning
// map.dragging.disable();
// map.touchZoom.disable();
// map.doubleClickZoom.disable();
// map.scrollWheelZoom.disable();
// map.boxZoom.disable();
// map.keyboard.disable();
if (map.tap) map.tap.disable();
document.getElementById('themap').style.cursor = 'default';

map.dragging.disable();
var url = "./img/FIRST FLOOR.png"

// dimensions of the image
var w = 1263,
    h = 750
    url;

// calculate the edges of the image, in coordinate space
var southWest = map.unproject([0, h], map.getMaxZoom() - 1);
var northEast = map.unproject([w, 0], map.getMaxZoom() - 1);
var bounds = new L.LatLngBounds(southWest, northEast);

// add the image overlay, 
// so that it covers the entire map
var newmap = new L.imageOverlay(url, bounds);


// tell leaflet that the map is exactly as big as the image
map.setMaxBounds(bounds);
var polylineOptions = {
    color: '#ad2525',
    weight: 6,
    opacity: 1
};
map.addLayer(newmap);



// Create Marker Pin icon
//var myIcon = L.icon({ iconUrl: 'img/TargetInd_01.gif', iconSize: [60, 60], iconAnchor: [30, 30] });