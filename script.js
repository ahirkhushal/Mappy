'use strict';

const form = document.querySelector('.form');
const distance = document.querySelector('.form__input--distance');
const duration = document.querySelector('.form__input--duration');
const cadence = document.querySelector('.form__input--cadence');
const cadencediv = document.querySelector('.cadencediv');
const elevation = document.querySelector('.form__input--elevation');
const elevationdiv = document.querySelector('.elevationdiv');
const inputType = document.querySelector('.form__input--type');
const workoutsCOntainer = document.querySelector('.workouts');

class workOut {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(distance, duration, coords) {
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
  }

  _setDescription() {
    const months = [
      'january',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth() + 1]
    } ${this.date.getDay()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends workOut {
  type = 'running';
  constructor(distance, duration, coords, cadence) {
    super(distance, duration, coords);
    this.cadence = cadence;
    this._setDescription();
    this.Calcpace();
  }

  Calcpace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class cycling extends workOut {
  type = 'cycling';
  constructor(distance, duration, coords, elevationGain) {
    super(distance, duration, coords);
    this.elevationGain = elevationGain;
    this._setDescription();
    this.CalcSpeed();
  }

  CalcSpeed() {
    this.speed = this.distance / this.duration / 60;
    return this.speed;
  }
}

class App {
  #map;
  #mapzoom = 13;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPosition();

    //added event handler for set marker on submit form
    form.addEventListener('submit', this._newWorkout.bind(this));

    //added event handler for change options's of form's type section
    inputType.addEventListener('change', this._toggleElevationField);
    workoutsCOntainer.addEventListener('click', this._moveToPopUp.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      //geolocation
      navigator.geolocation.getCurrentPosition(
        //callback function for geolocation on success
        this._loadMap.bind(this),
        //callback function for alert on failure
        () => {
          alert('cloud not find current position');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    //render map from ecternal site
    this.#map = L.map('map').setView(coords, this.#mapzoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //added event handler for render workout form
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    form.classList.remove('hidden');
    distance.focus();
    this.#mapEvent = mapE;
  }

  _hideForm() {
    distance.value = duration.value = cadence.value = elevation.value = '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => {
      form.style.display = 'grid';
    }, 0);
  }

  _toggleElevationField() {
    elevationdiv.classList.toggle('form__row--hidden');
    cadencediv.classList.toggle('form__row--hidden');
  }

  _newWorkout(event) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    const AllPositive = (...inputs) => inputs.every(inp => inp > 0);

    event.preventDefault();

    const type = inputType.value;
    const distances = +distance.value;
    const durations = +duration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    const coords = [lat, lng];
    let workout;

    if (type === 'running') {
      const cadences = +cadence.value;

      if (
        !validInputs(distances, durations, cadences) ||
        !AllPositive(distances, durations, cadences)
      )
        return alert('you should enter positive number!!');

      workout = new Running(distances, durations, coords, cadences);

      form;
    }

    if (type === 'cycling') {
      const elevations = +elevation.value;

      if (
        !validInputs(distances, durations, elevations) ||
        !AllPositive(distances, durations)
      )
        return alert('you should enter positive number!!');

      workout = new cycling(distances, durations, coords, elevations);
    }

    this.#workouts.push(workout);

    //render workout on map as marker
    this._renderWorkOutMarker(workout);

    //render workout on list
    this._renderWorkOut(workout);

    //clear form on submit
    this._hideForm();
  }

  _renderWorkOutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkOut(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>`;

    if (workout.type === 'running')
      html += `<div class="workout__details">
       <span class="workout__icon">⚡️</span>
       <span class="workout__value">${workout.pace.toFixed(1)}</span>
       <span class="workout__unit">min/km</span>
     </div>
     <div class="workout__details">
       <span class="workout__icon">🦶🏼</span>
       <span class="workout__value">${workout.cadence}</span>
       <span class="workout__unit">spm</span>
     </div>
   </li>`;

    if (workout.type === 'cycling')
      html += `  <div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${workout.speed}</span>
    <span class="workout__unit">km/h</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⛰</span>
    <span class="workout__value">${workout.elevationGain}</span>
    <span class="workout__unit">m</span>
  </div>
</li> `;

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopUp(evt) {
    const workoutEl = evt.target.closest('.workout');

    if (!workoutEl) return;

    const WORKOUT = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );

    this.#map.setView(WORKOUT.coords, this.#mapzoom, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    //using the public interface
    WORKOUT.click();
  }
}

const app = new App();
