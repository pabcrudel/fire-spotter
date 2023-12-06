import { addMarker } from './add-marker';

export async function printPoints(map, countryLayer, spotterResult) {
  const { trackedPoints, source, coordinates } = spotterResult;

  countryLayer.clearLayers();
  map.setView(coordinates, 6);

  for (const type in trackedPoints) {
    for (const points of trackedPoints[type]) {
      for (const point of points) {
        const {
          nearbyCity, frp, propagation, latitude, longitude, windDeg, windSpeed
        } = point;

        const isFire = type === 'fires';

        const toolTip =
          `<h4>${nearbyCity}</h4>` +
          "<hr>" +
          "<p>Prediction: " + type
            .replace(/(?:^|\s)./g, match => match.toUpperCase())
            .replace(/([A-Z])/g, ' $1').trim() + "</p>" +
          `<p>Source: ${source}</p>` +
          `<p>Radiative Power: ${frp}</p>` +
          (isFire ? "<p>Fire propagation: " +
            propagation.toFixed(2) + " meters</p>" : '') +
          `<p>latitude: ${latitude}</p>` +
          `<p>longitude: ${longitude}</p>` +
          `<p>Wind degrees: ${windDeg} degrees</p>` +
          `<p>Wind speed: ${windSpeed} meters/sec</p>` +
          '';

        const iconName = isFire ? 'fire' : 'hot-spot';
        const pointMarker = await addMarker([latitude, longitude], iconName);
        pointMarker.bindTooltip(toolTip);

        countryLayer.addLayer(pointMarker);

        if (isFire) {
          const { drawPropagationCone } =
            await import('./draw-propagation-cone');

          drawPropagationCone(
            latitude, longitude, windDeg, propagation, countryLayer
          );
        }
      }
    }
  }
}
