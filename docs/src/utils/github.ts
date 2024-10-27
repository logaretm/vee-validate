export function fetchStarCount() {
  return fetch('https://api.github.com/repos/logaretm/vee-validate')
    .then(res => res.json())
    .then(json => {
      return json.stargazers_count as number;
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.error(err);

      return 0;
    });
}
