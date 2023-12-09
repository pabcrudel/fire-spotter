export async function pointsTracker(source, countryAbbreviation) {
  // Gets points from FIRMS API
  const { getFirmsData } = await import('./utils/firms-data');
  let points = await getFirmsData(source, countryAbbreviation);

  // Add forecast data from Open Weather API based on each point location
  const { getForecastData } = await import('./utils/open-weather-data');
  for (const point of points) {
    const { latitude, longitude } = point;

    const forecastData = await getForecastData(latitude, longitude);

    Object.assign(point, forecastData);
  }

  // Wrap points by nearby city and then in Fires or Hot Spots
  const { wrapByPointTypeAndCity } = await import('./utils/wrap-points');
  points = wrapByPointTypeAndCity(points);

  // Algorithm that calculates the propagation of a given fire
  const { addFirePropagation } = await import('./utils/fire-propagation');
  for (const wrappedFires of points.fires) {
    for (const fire of wrappedFires) {
      const { temp, humidity, windDeg, windSpeed, acq_time } = fire;

      fire.propagation = addFirePropagation(
        temp, humidity, windDeg, windSpeed, acq_time
      );
    }
  }

  // Return tracked points
  return points;
}
