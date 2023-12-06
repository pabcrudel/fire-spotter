import L from 'leaflet';

export async function addMarker(coordinates, markerIcon) {
  return L.marker(coordinates,
    {
      icon: L.icon({
        iconUrl: markerIcon,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    }
  );
}