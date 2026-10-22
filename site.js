const logo = document.getElementById('animated-logo');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let timer;
function showMark() {
  clearTimeout(timer);
  logo.src = 'assets/logo-still.png';
  if (!preference.matches) {
    logo.src = 'assets/logo-animation.gif';
    timer = setTimeout(() => { logo.src = 'assets/logo-still.png'; }, 4000);
  }
}
preference.addEventListener('change', showMark);
showMark();
