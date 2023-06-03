"use strict";

const form = document.querySelector(".form");
const distance = document.querySelector(".form__input--distance");
console.log(form);
if (navigator.geolocation)
  //geolocation
  navigator.geolocation.getCurrentPosition(
    //callback function for geolocation on success
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      const coords = [latitude, longitude];

      //render map from ecternal site
      const map = L.map("map").setView(coords, 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      //added event handler for render workout form
      map.on("click", function (mapEvent) {
        form.classList.remove("hidden");
        distance.focus();
      });
    },
    //callback function for alert on failure
    () => {
      alert("cloud not find current position");
    }
  );

// const { lat, lng } = mapEvent.latlng;
// const coords = [lat, lng];
// L.marker(coords)
//   .addTo(map)
//   .bindPopup(
//     L.popup({
//       maxWidth: 250,
//       minWidth: 100,
//       autoClose: false,
//       closeOnClick: false,
//       className: "running-popup",
//     })
//   )
//   .setPopupContent("workOut")
//   .openPopup();
