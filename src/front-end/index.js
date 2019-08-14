import 'uikit/dist/css/uikit.min.css';

import './components/login-form';

import store  from './redux/store';
import { operations } from './redux/sign-in';

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
  if (id) {
    console.log('wait');
  } else {
    id = setTimeout(() => {
      msg.innerHTML = '&nbsp;';
      id = null;
    }, DEBOUCE);
  }
});

document.querySelector('#cameraBtn').addEventListener('click', () => {
  fetch('v1/dns').then(response => response.text().then(addr =>
  {
    const camera = document.querySelector('#camera');
    camera.setAttribute('src', `http://${addr}:8888`);
    setTimeout(() => {
      camera.removeAttribute('src');
    }, 60 * 1000);
  }
  ));
});

