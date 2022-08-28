export function fetchStarCount() {
  return fetch('https://api.github.com/repos/logaretm/vee-validate')
    .then(res => res.json())
    .then(json => {
      return json.stargazers_count as number;
    })
    .catch(err => {
      console.error(err);

      return 0;
    });
}
