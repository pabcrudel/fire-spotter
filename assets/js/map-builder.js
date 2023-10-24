export const map=L.map("map",{zoomControl:!1});const southWest=L.latLng(-85,-180),northEast=L.latLng(85,180),bounds=L.latLngBounds(southWest,northEast);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',bounds:bounds,noWrap:!0}).addTo(map);let currentLocationIsShown=!1;function showCurrentLocation(){"geolocation"in navigator&&0==currentLocationIsShown?navigator.geolocation.getCurrentPosition((function(position){const lat=position.coords.latitude,lng=position.coords.longitude;L.marker([lat,lng]).addTo(map),map.setView([lat,lng],15),currentLocationIsShown=!0})):1==currentLocationIsShown?(map.setView([40.41831,-3.70275],6),currentLocationIsShown=!1):alert("Your navigator doesn't allow geolocation")}export const redIcon=L.icon({iconUrl:"assets/img/fueguito.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]});const getLocationButton=document.getElementById("getLocationButton");getLocationButton.addEventListener("click",showCurrentLocation);const customScale=L.control.scale();customScale.addTo(map);const scaleContainer=document.getElementById("scale");scaleContainer.appendChild(customScale.getContainer());export function drawLinesWithSecondaryLines(latitude,longitude,windDeg,firePropagation){const startPoint=[latitude,longitude],orientationRadians=(windDeg+=180)*Math.PI/180,endLat=latitude+firePropagation/111320*Math.cos(orientationRadians),endLng=longitude+firePropagation/(111320*Math.cos(latitude*(Math.PI/180)))*Math.sin(orientationRadians);L.polyline([startPoint,[endLat,endLng]],{color:"purple"}).addTo(map);let direction=1,count=1;const colors=["red","orange","yellow","green","blue","brown"];for(let i=1;i<=200;i++){const lineColor=colors[Math.floor(count/20)]||"black",orientationRadiansSide=(windDeg+direction*count++*.45)*Math.PI/180,lineCoordinatesSide=[startPoint,[latitude+firePropagation/111320*Math.cos(orientationRadiansSide),longitude+firePropagation/(111320*Math.cos(latitude*(Math.PI/180)))*Math.sin(orientationRadiansSide)]];L.polyline(lineCoordinatesSide,{color:lineColor,weight:.25}).addTo(map),100===i&&(direction=-1,count=1)}}