import TileCloudControl from '@tilecloud/mbgl-tilecloud-control'

const req = new XMLHttpRequest();

req.onreadystatechange = () => {
  const result = document.getElementById('result');
  if (req.readyState == 4 && req.status == 200) {
    const styles = JSON.parse(req.responseText)

    const map = new mapboxgl.Map({
      container: 'map',
      style: `./${Object.keys(styles)[0]}/style.json`,
      attributionControl: true,
      hash: true,
      localIdeographFontFamily: "sans-serif"
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.GeolocateControl());
    map.addControl(new TileCloudControl());

    const menu = document.querySelector('#menu')

    for (const key in styles) {
      const option = document.createElement('option')
      option.value = key
      option.innerText = styles[key]
      menu.appendChild(option)
    }

    menu.addEventListener('change', event => {
      const value = event.target.value
      map.setStyle(`./${value}/style.json`, {
        localIdeographFontFamily: "sans-serif"
      });
    })
  }
}

req.open('GET', "./styles.json", true);
req.send(null);
