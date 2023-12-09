function getFlammability(kFuelIndex, cardinalPoint) {
  /** 0 = North, 1 = South, 2 = West, 3 = East */
  const flammability = [
    [1.1, 1.1, 1.1, 1.1],
    [1.1, 1.1, 1.1, 1.2],
    [1.1, 1.1, 1.1, 1.3],
    [1.2, 1.1, 1.1, 1.4],
    [1.26, 1.25, 1.2, 1.25],
    [1.1, 1.5, 1.3, 1.15],
    [1.15, 1.85, 1.4, 1.1],
    [1.18, 2, 1.5, 1.26],
    [1.2, 1.85, 1.6, 1.2],
    [1.1, 1.5, 1.7, 1.1],
    [1.1, 1.25, 1.8, 1.1],
    [1.1, 1.1, 1.7, 1.1],
    [1.1, 1.1, 1.5, 1.1],
    [1.1, 1.1, 1.3, 1.1],
  ];

  return flammability[kFuelIndex][cardinalPoint];
}

export function addFirePropagation(
  temp, humidity, windDeg, windSpeed, acq_time
) {
  console.log({temp, humidity, windSpeed, acq_time});

  const hour = +(acq_time / 100).toFixed();

  // Max and min historical temperature registered on earth
  const TEMP_MIN = 173.15, TEMP_MAX = 373.15;

  /** Rural land factor */
  const K_TERR = 0.5;

  /** Temperature-dependent constant in base unit */
  const kTemp = (((temp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * (1 - 0.1)) + 0.1;

  /** Inverse humidity factor. If humidity is 100%, kHum = 0 */
  const kHum = (100 - humidity) / 100;

  const kFcPrima = (deflectionAngle = 0) => {
    let trueAngle = (windDeg - deflectionAngle - 45) * 0.0111 + 0.5;

    if (windDeg < 45 || windDeg > 90) trueAngle = 1 - trueAngle;

    return trueAngle;
  };

  let kFc;
  if (windDeg > 0 && windDeg < 90) kFc = kFcPrima();
  else if (windDeg > 90 && windDeg < 180) kFc = kFcPrima(90);
  else if (windDeg > 180 && windDeg < 270) kFc = kFcPrima(180);
  else if (windDeg > 270 && windDeg < 360) kFc = kFcPrima(270);
  else if (
    windDeg === 45 || windDeg === 135 ||
    windDeg === 225 || windDeg === 315
  )
    kFc = 0.5;
  else kFc = 1;

  let kFuelIndex = -1; if (hour >= 6 && hour <= 19) kFuelIndex = hour - 6;

  const kFuelPrima = (cardinalPoint) =>
    kFc * (kFuelIndex === -1 ? 1 : getFlammability(kFuelIndex, cardinalPoint));

  /** kFuel = kFc * flammability */
  let kFuel;
  if (windDeg > 45 && windDeg < 135) kFuel = kFuelPrima(2);
  else if (windDeg > 135 && windDeg < 225) kFuel = kFuelPrima(0);
  else if (windDeg > 225 && windDeg < 315) kFuel = kFuelPrima(3);
  else if (windDeg > 315 && windDeg < 45) kFuel = kFuelPrima(1);
  else kFuel = kFc;

  console.log({kFc, kHum, K_TERR, kTemp, kFuel});

  return (windSpeed * 3600 * kFc * kHum * K_TERR * kTemp * kFuel);
}