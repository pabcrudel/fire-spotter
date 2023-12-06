export function wrapByPointTypeAndCity(points) {
  let hotSpots = [];
  let fires = [];
  let cityPoints = [];
  let lastCity = "";

  for (const point of points) {
    const nearbyCity = point.nearbyCity;

    if (lastCity) {
      if (lastCity !== nearbyCity) {
        wrapper(cityPoints, fires, hotSpots);
        cityPoints = [];
      }
    }

    cityPoints.push(point);

    lastCity = nearbyCity;
  }
  wrapper(cityPoints, fires, hotSpots);

  return { fires, hotSpots };
}

function wrapper(points, fires, hotSpots) {
  (isFire(points) ? fires : hotSpots).push(points);
}

/** Points with at least 1 point which FRP is higher than 10 are fires */
function isFire(points) {
  for (const point of points) {
    if (point.frp > 10) return true;
  }
  return false;
}
