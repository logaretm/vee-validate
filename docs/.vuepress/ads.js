function loadScript(src) {
  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = src;

  document.body.appendChild(script);
}

export function loadAds() {
  // codefund
  loadScript('https://codefund.io/properties/443/funder.js');
}
