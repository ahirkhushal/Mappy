"use strict";

const form = document.querySelector(".form");
const distance = document.querySelector(".form__input--distance");
const duration = document.querySelector(".form__input--duration");
const cadence = document.querySelector(".form__input--cadence");
const cadencediv = document.querySelector(".cadencediv");
const elevation = document.querySelector(".form__input--elevation");
const elevationdiv = document.querySelector(".elevationdiv");
const inputType = document.querySelector(".form__input--type");

//can get access of this variable out side of scope
let map, mapEvent;

if (navigator.geolocation)
  //geolocation
  navigator.geolocation.getCurrentPosition(
    //callback function for geolocation on success
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      const coords = [latitude, longitude];

      //render map from ecternal site
      map = L.map("map").setView(coords, 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      //added event handler for render workout form
      map.on("click", function (mapE) {
        form.classList.remove("hidden");
        distance.focus();
        mapEvent = mapE;
      });
    },
    //callback function for alert on failure
    () => {
      alert("cloud not find current position");
    }
  );

//added event handler for ser maker on submit form
form.addEventListener("submit", function (event) {
  event.preventDefault();

  //clear form on submit
  distance.value = duration.value = cadence.value = elevation.value = "";

  //map marker
  const { lat, lng } = mapEvent.latlng;
  const coords = [lat, lng];
  L.marker(coords)
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    .setPopupContent("workOut")
    .openPopup();
});
