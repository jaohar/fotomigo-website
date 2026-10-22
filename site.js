const logo = document.getElementById('animated-logo');
const button = document.getElementById('motion');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let playing = false;
function setMotion(value) {
  playing = value;
  logo.src = value ? 'assets/logo-animation.gif' : 'assets/logo-still.png';
  button.textContent = value ? 'Pause animation' : 'Play animation';
  button.setAttribute('aria-pressed', String(value));
}
button.hidden = false;
button.addEventListener('click', () => setMotion(!playing));
preference.addEventListener('change', event => setMotion(!event.matches));
setMotion(!preference.matches);
