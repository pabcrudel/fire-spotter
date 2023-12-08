import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export function initMap(coordinates, zoom) {
  // Creates a void map without zoom control
  const map = L.map('map', { zoomControl: false }).setView(coordinates, zoom);

  // Sets the limit of the map
  const southWest = L.latLng(-85, -180);
  const northEast = L.latLng(85, 180);
  const bounds = L.latLngBounds(southWest, northEast);

  // Adds tile from Open Street Map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">' +
      'OpenStreetMap</a> contributors',
    bounds,
    noWrap: true
  }).addTo(map);

  // Add a layer to the map to print country points
  const countryLayer = L.layerGroup().addTo(map);

  // Adds a scale to the map
  const customScale = L.control.scale();
  customScale.addTo(map);

  return { map, countryLayer };
}