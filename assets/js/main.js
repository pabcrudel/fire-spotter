import{formatFirmsData,fetchOpenWeatherData,propagationAlgorithm}from"./wildfire-tracker.js";import{redIcon,map,drawLinesWithSecondaryLines}from"./map-builder.js";(async()=>{try{const points=await formatFirmsData();for(const type in points){const pointsType=points[type];for(let i=0;i<pointsType.length;i++){const points=pointsType[i];for(let i=0;i<points.length;i++){const{latitude:latitude,longitude:longitude,hour:hour,satellite:satellite,frp:frp}=points[i],{windDeg:windDeg,windSpeed:windSpeed,windGust:windGust,temp:temp,humidity:humidity,nearbyCity:nearbyCity}=await fetchOpenWeatherData(latitude,longitude),firePropagation=propagationAlgorithm(temp,humidity,windDeg,windSpeed,hour),toolTip=`\n            <h4>${nearbyCity}</h4>\n            <hr>\n            <p>Prediction: ${type.replace(/(?:^|\s)./g,(match=>match.toUpperCase())).replace(/([A-Z])/g," $1").trim()}</p>\n            <p>Satellite: ${satellite}</p>\n            <p>Fire Radiative Power: ${frp}</p>\n            <p>Fire propagation: ${Math.round(firePropagation)} meters</p>\n            <p>latitude: ${latitude}</p>\n            <p>longitude: ${longitude}</p>\n            <p>Wind degrees: ${windDeg} degrees</p>\n            <p>Wind speed: ${windSpeed} meters/sec</p>\n          `;L.marker([latitude,longitude],{icon:redIcon}).addTo(map).bindTooltip(toolTip),drawLinesWithSecondaryLines(latitude,longitude,windDeg,firePropagation)}}}}catch(error){}})();