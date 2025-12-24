// console.log("Received geometry:", geo);

// if (geo && geo.latitude && geo.longitude) {
//   const lat = parseFloat(geo.latitude);
//   const lon = parseFloat(geo.longitude);

//   // Pehle lat/lon define karo, phir map banao
//   var map = L.map('map').setView([lat, lon], 12);

//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; OpenStreetMap contributors'
//   }).addTo(map);

//   // Marker add karo
//   const marker = L.marker([lat, lon]).addTo(map);
//   marker.bindPopup('<b>Hotel</b><br>Hotel approximate location.').openPopup();

//   // Optional circle (2 km radius)
//   L.circle([lat, lon], {
//     color: 'blue',
//     fillColor: 'yellow',
//     fillOpacity: 0.1,
//     radius: 2000
//   }).addTo(map);

//   L.control.scale().addTo(map);

// } else {
//   console.error("No geometry data found!", geo);
// }
console.log("Received geometry:", geo);

if (geo && geo.latitude && geo.longitude) {
  const lat = parseFloat(geo.latitude);
  const lon = parseFloat(geo.longitude);

  if (isNaN(lat) || isNaN(lon)) {
    console.error("Invalid geometry values:", geo);
  } else {
    var map = L.map('map').setView([lat, lon], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map);
  }

} else {
  console.error("No geometry data found!", geo);
}
