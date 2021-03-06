import 'babel-polyfill' // For ie11
import GeoloniaControl from '@geolonia/mbgl-geolonia-control'

import './style.css'

const req = new XMLHttpRequest();

req.onreadystatechange = () => {
  const result = document.getElementById('result');
  if (req.readyState == 4 && req.status == 200) {
    const styles = JSON.parse(req.responseText)
    const start = performance.now()

    const map = new mapboxgl.Map({
      container: 'map',
      style: `./${Object.keys(styles)[0]}/style.json`,
      attributionControl: true,
      hash: true,
      localIdeographFontFamily: "sans-serif"
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.GeolocateControl());
    map.addControl(new GeoloniaControl());

    map.on( 'load', () => {
      console.log( performance.now() - start )
    } )

    const dumpFeature = event => {
      const features = map.queryRenderedFeatures(event.point)
      const jsonContainer = document.getElementById('json')
      jsonContainer.innerText = JSON.stringify(features, null, '  ')
    }

    const mouseEnter = () => {
      map.getCanvas().style.cursor = 'pointer'
    }

    const mouseLeave = () => {
      map.getCanvas().style.cursor = ''
    }

    map.on('load', () => {
      map.getStyle().layers.forEach( (item) => {
        map.on('click', item.id, dumpFeature)
        map.on('mouseenter', item.id, mouseEnter)
        map.on('mouseleave', item.id, mouseLeave)
      })
    })

    const menu = document.querySelector('#menu')

    for (const key in styles) {
      if (styles[key].deprecated) continue
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
