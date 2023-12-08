import L from 'leaflet';

let currentLocationIsShown = false;

export function moveToUserLocation(map, target) {
  if ("geolocation" in navigator && currentLocationIsShown === false) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Set a marker in the current location
      L.marker([lat, lng]).addTo(map);
      map.setView([lat, lng], 15); // Set the view in the current location
      currentLocationIsShown = true;

      target.innerText = 'Go back';
    });
  } else if (currentLocationIsShown === true) {
    map.setView([40.41831, -3.70275], 6);
    currentLocationIsShown = false;

    target.innerText = 'Get position';
  }
  else {
    alert("Your navigator doesn't allow geolocation");
  };
};
