const firmsURL=(satellite,date)=>{if(void 0===date){const today=new Date;date=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`}return`https://firms.modaps.eosdis.nasa.gov/api/area/csv/8b8845657503cd8c75f8b4a0a7f8b177/${satellite}/-11,35,3,45/1/${date}`},openWeatherURL=(lat,lon)=>`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=efd53a1ca3bae9d1aae362ddf19cbbeb`,flammability=[[1.1,1.1,1.1,1.1],[1.1,1.1,1.1,1.2],[1.1,1.1,1.1,1.3],[1.2,1.1,1.1,1.4],[1.26,1.25,1.2,1.25],[1.1,1.5,1.3,1.15],[1.15,1.85,1.4,1.1],[1.18,2,1.5,1.26],[1.2,1.85,1.6,1.2],[1.1,1.5,1.7,1.1],[1.1,1.25,1.8,1.1],[1.1,1.1,1.7,1.1],[1.1,1.1,1.5,1.1],[1.1,1.1,1.3,1.1]];async function fetchFirmsData(){let firmsData=[];try{const csvResponse=await fetch(firmsURL("VIIRS_NOAA20_NRT"));let data=(await csvResponse.text()).trim().split("\n").slice(1);firmsData.push({source:"VIIRS_NOAA20_NRT",data:data})}catch(error){}return firmsData}export async function formatFirmsData(){const firmsData=await fetchFirmsData();let firmsPoints=[];if(firmsData.length>0)for(let i=0;i<firmsData.length;i++){const{source:source,data:data}=firmsData[i];for(let i=0;i<data.length;i++){const rawHotSpot=(data[i]+=`,${source}`).split(","),latitude=parseFloat(rawHotSpot[0]),longitude=parseFloat(rawHotSpot[1]),hour=parseInt(rawHotSpot[6].padStart(4,"0").substring(0,2)),satellite=rawHotSpot[rawHotSpot.length-1];parseFloat(rawHotSpot[12]);firmsPoints.push({latitude:latitude,longitude:longitude,satellite:satellite,hour:hour})}}return firmsPoints.length>0&&(firmsPoints=sortFirmsPoints(firmsPoints)),firmsPoints}function sortFirmsPoints(firmsPoints){let count=0,hotSpotCount=0,fireCount=0,hotSpots=[],fires=[],wrap=[],lastKey="";return firmsPoints.sort(((a,b)=>a.latitude-b.latitude)).map((point=>{const{latitude:latitude,longitude:longitude}=point,key=`${Math.floor(10*latitude)/10},${Math.floor(10*longitude)/10}`;if(key!==lastKey){if(count>0){const checkState=function(){let isFire=!1;for(let i=0;!isFire&&i<wrap.length;i++)wrap[i].frp>10&&(isFire=!0);return isFire}();wrap.length>=4&&checkState||checkState?fires[fireCount++]=wrap:hotSpots[hotSpotCount++]=wrap,wrap=[],count=0}count++,lastKey=key}wrap.push(point)})),{hotSpots:hotSpots,fires:fires}}export async function fetchOpenWeatherData(latitude,longitude){const response=await fetch(openWeatherURL(latitude,longitude)),openWeatherData=await response.json(),windDeg=openWeatherData.wind.deg,windSpeed=openWeatherData.wind.speed,windGust=void 0!==openWeatherData.wind.gust,{temp:temp,humidity:humidity}=openWeatherData.main;return{windDeg:windDeg,windSpeed:windSpeed,windGust:windGust,temp:temp,humidity:humidity,nearbyCity:openWeatherData.name}}export function propagationAlgorithm(temp,humidity,windDeg,windSpeed,hour){const kTemp=(temp-173.15)/(373.15-173.15)*.9+.1,kHum=(100-humidity)/100;let kFuelIndex=-1;hour>=6&&hour<=19&&(kFuelIndex=hour-6);const kFcPrima=(deflectionAngle=0)=>{let trueAngle=.0111*(windDeg-deflectionAngle-45)+.5;return(windDeg<45||windDeg>90)&&(trueAngle=1-trueAngle),trueAngle};let kFc;kFc=windDeg>0&&windDeg<90?kFcPrima():windDeg>90&&windDeg<180?kFcPrima(90):windDeg>180&&windDeg<270?kFcPrima(180):windDeg>270&&windDeg<360?kFcPrima(270):45===windDeg||135===windDeg||225===windDeg||315===windDeg?.5:1;const kFuelPrima=cardinalPoint=>kFc*(-1===kFuelIndex?1:flammability[kFuelIndex][cardinalPoint]);let kFuel;return kFuel=windDeg>45&&windDeg<135?kFuelPrima(2):windDeg>135&&windDeg<225?kFuelPrima(0):windDeg>225&&windDeg<315?kFuelPrima(3):windDeg>315&&windDeg<45?kFuelPrima(1):kFc,3600*windSpeed*kFc*kHum*.5*kTemp*kFuel}