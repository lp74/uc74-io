import 'uikit/dist/css/uikit.min.css';
import { createStore } from 'redux';

const store = createStore((state = {}, action) => {return state;});

const UNKNOWN = 'unknown';
class geoLocationManager {
  constructor() {
    this.coords = {
      latitude: UNKNOWN,
      longitude: UNKNOWN
    };
  }
  locate() {
    var output = document.getElementById('out');

    if (!navigator.geolocation) {
      output.innerHTML = '<p>La geolocalizzazione non è supportata dal tuo browser</p>';
      return;
    }

    const success = (position) => {
      this.coords.latitude = position.coords.latitude;
      this.coords.longitude = position.coords.longitude;

      output.innerHTML = '<p>Latitudine: ' + this.coords.latitude + '° <br>Longitudine: ' + this.coords.longitude + '°</p>';
    };

    const error = (err) => {
      output.innerHTML = 'Impossibile calcolare la tua posizione';
    };

    output.innerHTML = '<p>Locating…</p>';

    navigator.geolocation.getCurrentPosition(success, error);
  }
}

const geolocator = new geoLocationManager();
geolocator.locate();

const DEBOUCE = 2500;
const msg = document.querySelector('#gateMsg');
const btn = document.querySelector('#gateBtn');

const signBtn = document.querySelector('#signBtn');
const signMsg = document.querySelector('#signMsg');

let id = null;
btn.addEventListener('click', async () => {
  fetch('/v1/gate/open', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(geolocator.coords)
  })
    .then(async (res) => {
      msg.innerHTML = (await res.json()).message;
    })
    .catch((err) => {
      msg.innerHTML = err;
    });
  btn.setAttribute('disabled', 'disabled');
  if (id) {
    console.log('wait');
  } else {
    id = setTimeout(() => {
      btn.removeAttribute('disabled');
      msg.innerHTML = '&nbsp;';
      id = null;
    }, DEBOUCE);
  }
});
signBtn.addEventListener('click', async () => {
  signMsg.innerHTML = '&nbsp;';
  fetch('v1/sign', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: document.querySelector('#email').value.toLowerCase().trim(),
      password: document.querySelector('#password').value.trim()
    })
  })
    .then(response => {
      console.debug('success', response.status);
      signMsg.innerHTML = response.status;
    })
    .catch(err => {
      console.error('error', err);
    });
});

setInterval(function () {
  const myImageElement = document.getElementById('myImage');
  myImageElement.src = 'image.jpg?rand=' + Math.random();
}, 5000);

