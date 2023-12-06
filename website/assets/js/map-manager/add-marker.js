import L from 'leaflet';

export async function addMarker(coordinates, iconName) {
  const markerIconPath = `../../img/${iconName}.svg`;
  const markerIcon = await import(markerIconPath);
  
  return L.marker(coordinates,
    {
      icon: L.icon({
        iconUrl: markerIcon.default,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    }
  );
}