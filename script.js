var mapboxgl = require('mapbox-gl');
var MapboxDirections = require('@mapbox/mapbox-gl-directions');

var directions = new MapboxDirections({
  accessToken: 'pk.eyJ1IjoiaGFubmFod3JpZ2h0MTIzIiwiYSI6ImNsc2FvaXpueTA1dDAyanFtemplcHdyd24ifQ.xDVluCTEF9lX4dYC8DHglQ  ',
  unit: 'metric',
  profile: 'mapbox/cycling'
});

var map = new mapboxgl.Map({
  container: 'map'
});

map.addControl(directions, 'top-left');