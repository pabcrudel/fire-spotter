import { initMap } from './map-manager/init-map';
import { Spotter } from './spotter-class';
import { printPoints } from './map-manager/print-points';
import { moveToUserLocation } from './map-manager/move-to-user-location';

main('Spain', 0, 6);
async function main(defaultCountryName, defaultSourceIndex, defaultZoom) {
  // Create the Spotter with the default country and source
  const spotter = new Spotter(defaultCountryName, defaultSourceIndex);

  // Get the coordinates and create a map there with the default zoom level
  const defaultCoordinates = spotter.getCoordinates;
  const { map, countryLayer } = initMap(defaultCoordinates, defaultZoom);

  // Get the spotter info from this country and print them on the layer map
  const spotterInfo = await spotter.getPoints();
  await printPoints(countryLayer, spotterInfo);

  // Adds a event listener to the button
  const getLocationButton = document.getElementById("getLocationButton");
  getLocationButton.addEventListener(
    "click", (event) => moveToUserLocation(map, event.target)
  );

  // Create a Selector to change country and source
  const countries = spotter.getCountries;
  const sources = spotter.getSources;

  const countrySelector = document.getElementById('country');
  for (const { name } of countries) {
    createOption(countrySelector, name, defaultCountryName);
  }

  const sourceSelector = document.getElementById('source');
  for (const source of sources) {
    createOption(sourceSelector, source, sources[defaultSourceIndex]);
  }

  countrySelector.addEventListener('change', async (event) => changeAction(
    event.target, map, countryLayer, spotter, printPoints
  ));
  sourceSelector.addEventListener('change', async (event) => changeAction(
    event.target, map, countryLayer, spotter, printPoints
  ));
}

function createOption(selector, entry, defaultEntry) {
  // Creates an <option> HTML tag
  const option = document.createElement("option");

  option.value = entry;
  option.text = entry;

  // Sets a default value
  if (entry === defaultEntry) option.selected = true;

  // Adds <option> to the <select> HTML tag
  selector.appendChild(option);
}

async function changeAction(target, map, countryLayer, spotter, printPoints) {
  // Clear map layer
  countryLayer.clearLayers();

  // Change the value depending on the target Id
  const value = target.value;
  switch (target.id) {
    case 'country':
      spotter.changeCountry(value);

      // Smooth movement to the new coordinates
      map.flyTo(spotter.getCoordinates);
    break;
    case 'source': spotter.changeSource(value); break;
    default: break;
  }

  // Print spotter info into the map
  await printPoints(countryLayer, await spotter.getPoints());
}
