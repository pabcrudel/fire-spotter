import countries from './countries.json';

export class Spotter {
  // FIRMS supported countries
  #countries = countries;
  
  // FIRMS sources
  #sources = ["VIIRS_NOAA20_NRT", "VIIRS_SNPP_NRT", "MODIS_NRT"];

  #currentCountry;
  #currentSource;

  constructor(countryName, sourceIndex) {
    // Initial country and source
    this.#setCountry(countryName);
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

  get getCoordinates() {
    return this.#currentCountry.coordinates;
  }

  #setCountry(name) {
    this.#currentCountry = this.#countries.find(
      country => country.name === name
    );
  }

  changeCountry(name) {
    this.#setCountry(name);
  }

  changeSource(source) {
    this.#currentSource = source;
  }

  async getPoints() {
    const { abbreviation, name } = this.#currentCountry;

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

    return { trackedPoints, source };
  }
}
