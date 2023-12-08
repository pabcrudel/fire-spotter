/**
 * Retrieves CSV data from the NASA FIRMS API
 * for a specific source and country
 * */
async function fetchFirmsData(source, countryAbbreviation) {
  const apiUrl = "https://firms.modaps.eosdis.nasa.gov/api/country/csv" +
    `/${import.meta.env.VITE_FIRMS_KEY}/${source}/${countryAbbreviation}/1`;

  const firmsResponse = await fetch(apiUrl);
  return await firmsResponse.text();
}

/** Parses the FIRMS CSV response using `PapaParse` */
async function parseFirmsCSV(firmsCSV) {
  const { parse } = await import("papaparse");

  return parse(firmsCSV, {
    header: true,
    dynamicTyping: true,
  }).data;
}

/**
 * Filters relevant data from FIRMS API
 * - latitude
 * - longitude
 * - acq_time (hour)
 * - frp (fire radiative power)
 */
export async function getFirmsData(source, countryAbbreviation) {
  const firmsCSV = await fetchFirmsData(source, countryAbbreviation);
  const rawFirmsData = await parseFirmsCSV(firmsCSV);

  return rawFirmsData.map(row => {
    const {latitude, longitude, acq_time, frp} = row;

    return {latitude, longitude, acq_time, frp};
  });
}