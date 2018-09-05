import 'babel-polyfill' // For ie11
import ExportControl from '@tilecloud/mbgl-export-control'
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
    map.addControl(new ExportControl());

    const menu = document.querySelector('#menu')

    for (const key in styles) {
      const img = document.createElement('img')
      img.src = `./${key}/screenshot.png`
      img.dataset.target = key
      img.title = styles[key].name

      menu.appendChild(img)

      img.addEventListener('click', event => {
        const value = event.target.dataset.target
        map.setStyle(`./${value}/style.json`, {
          localIdeographFontFamily: "sans-serif"
        });
        document.querySelectorAll('#menu img').forEach(element => {
          element.style.borderColor = '#999999'
          event.target.style.borderColor = '#555555'
        })
      })
    }
  }
}

req.open('GET', "./styles.json", true);
req.send(null);
