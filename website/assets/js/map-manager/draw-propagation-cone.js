import L from 'leaflet';

/**
 * Takes in latitude, longitude, wind degrees, and fire propagation
 * and draws lines on the map to represent fire propagation and wind direction.
 */
export function drawPropagationCone(latitude, longitude, windDeg, firePropagation, countryMarker) {

  const iniValue = () => windDeg + 180;
  windDeg = iniValue();

  const startPoint = [latitude, longitude];
  const orientationRadians = (windDeg * Math.PI) / 180;

  // Calculates the dimension of the fire propagation
  const endLat =
    latitude + (firePropagation / 111320) * Math.cos(orientationRadians);

  const endLng =
    longitude + (firePropagation / (111320 * Math.cos(latitude * (Math.PI / 180)))) * Math.sin(orientationRadians);

  // Dawns the fire propagation into the map
  L.polyline([startPoint, [endLat, endLng]], { color: 'purple' }).addTo(countryMarker);

  // Draws 200 lines anti-horary way based on the wind degrees.
  let direction = 1;
  let count = 1;
  const inclinationDegrees = 0.45;
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'brown'];

  for (let i = 1; i <= 200; i++) {
    const lineColor = colors[Math.floor(count / 20)] || 'black';
    const windDegSide = windDeg + direction * count++ * inclinationDegrees;
    const orientationRadiansSide = (windDegSide * Math.PI) / 180;
    const endLatSide =
      latitude + (firePropagation / 111320) * Math.cos(orientationRadiansSide);
    const endLngSide =
      longitude + (firePropagation / (111320 * Math.cos(latitude * (Math.PI / 180)))) * Math.sin(orientationRadiansSide);
    const lineCoordinatesSide = [startPoint, [endLatSide, endLngSide]];
    L.polyline(lineCoordinatesSide, { color: lineColor, weight: 0.25 }).addTo(countryMarker);

    // Restart the loop counter to print lines in the other side.
    if (i === 100) {
      direction = -1;
      count = 1;
    };
  };
};
