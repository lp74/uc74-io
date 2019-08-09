const DEBOUCE = 2500;
const msg = document.querySelector('#gateMsg');
const btn = document.querySelector('#gateBtn');

const signBtn = document.querySelector('#signBtn');
const signMsg = document.querySelector('#signMsg');

let id = null;
btn.addEventListener('click', async () => {
  fetch('/v1/gate/open')
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

function geoFindMe() {
  var output = document.getElementById('out');

  if (!navigator.geolocation) {
    output.innerHTML = '<p>La geolocalizzazione non è supportata dal tuo browser</p>';
    return;
  }

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    output.innerHTML = '<p>Latitudine: ' + latitude + '° <br>Longitudine: ' + longitude + '°</p>';
  }

  function error() {
    output.innerHTML = 'Impossibile calcolare la tua posizione';
  }

  output.innerHTML = '<p>Locating…</p>';

  navigator.geolocation.getCurrentPosition(success, error);
}
geoFindMe();
