"use strict";

const form = document.querySelector(".form");
const distance = document.querySelector(".form__input--distance");
const duration = document.querySelector(".form__input--duration");
const cadence = document.querySelector(".form__input--cadence");
const cadencediv = document.querySelector(".cadencediv");
const elevation = document.querySelector(".form__input--elevation");
const elevationdiv = document.querySelector(".elevationdiv");
const inputType = document.querySelector(".form__input--type");

class App {
  #map;
  #mapEvent;

  constructor() {
    this._getPosition();

    //added event handler for set marker on submit form
    form.addEventListener("submit", this._newWorkout.bind(this));

    //added event handler for change options's of form's type section
    inputType.addEventListener("change", this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation)
      //geolocation
      navigator.geolocation.getCurrentPosition(
        //callback function for geolocation on success
        this._loadMap.bind(this),
        //callback function for alert on failure
        () => {
          alert("cloud not find current position");
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    //render map from ecternal site
    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //added event handler for render workout form
    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    form.classList.remove("hidden");
    distance.focus();
    this.#mapEvent = mapE;
  }

  _toggleElevationField() {
    elevationdiv.classList.toggle("form__row--hidden");
    cadencediv.classList.toggle("form__row--hidden");
  }

  _newWorkout(event) {
    event.preventDefault();

    //clear form on submit
    distance.value = duration.value = cadence.value = elevation.value = "";

    //map marker
    const { lat, lng } = this.#mapEvent.latlng;
    const coords = [lat, lng];
    L.marker(coords)
      .addTo(this.#map)
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
  }
}

const app = new App();
console.log(app);
