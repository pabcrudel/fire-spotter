import countries from './countries.json';

export class Spotter {
  // FIRMS supported countries
  #countries = countries;
  
  // FIRMS sources
  #sources = ["VIIRS_NOAA20_NRT", "VIIRS_SNPP_NRT", "MODIS_NRT"];

  #currentCountryName;
  #currentSource;

  constructor(countryName, sourceIndex) {
    // Initial country and source
    this.#currentCountryName = countryName;
    this.#currentSource = this.#sources[sourceIndex];
  }

  /** Firms supported countries */
  get getCountries() {
    return this.#countries;
  }

  /** FIRMS supported sources */
  get getSources() {
    return this.#sources;
  }

  /** Focuses to a new country and clear the current layer */
  async changeCountry(name) {
    this.#currentCountryName = name;

    return this.getPoints();
  }

  async changeSource(source) {
    this.#currentSource = source;

    return this.getPoints();
  }

  async getPoints() {
    const { abbreviation, name, coordinates } = this.#countries.find(
      country => country.name === this.#currentCountryName
    );

    const source = this.#currentSource;
    const key = `${name}, ${source}`;

    const { getWithTTL } = await import('./storage-manager/get-with-ttl');
    const storedPoints = getWithTTL(key);

    let trackedPoints;
    if (storedPoints) trackedPoints = storedPoints;
    else {
      const { pointsTracker } = await import('./points-tracker/main');
      trackedPoints = await pointsTracker(source, abbreviation);

      const { setWithTTL } = await import('./storage-manager/set-with-ttl');
      setWithTTL(key, trackedPoints);
    }

    return { trackedPoints, source, coordinates };
  }
}
