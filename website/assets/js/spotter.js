import { initMap } from './map-manager/init-map';
import { Spotter } from './spotter-class';
import { printPoints } from './map-manager/print-points';

main('Spain', 0);
async function main(defaultCountryName, defaultSourceIndex) {
  const { map, countryLayer } = initMap();

  const spotter = new Spotter(defaultCountryName, defaultSourceIndex);
  await printPoints(map, countryLayer, await spotter.getPoints());

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

  /*
    `.bind()` aims that `this.` inside the functions are the same as the
    instantiated `spotter` object
  */
  addChangeListener(
    map, countryLayer, countrySelector, spotter.changeCountry.bind(spotter)
  );
  addChangeListener(
    map, countryLayer, sourceSelector, spotter.changeSource.bind(spotter)
  );
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

function addChangeListener(map, countryLayer, selector, action) {
  selector.addEventListener('change', async (event) =>
    await printPoints(map, countryLayer, await action(event.target.value))
  );
}
