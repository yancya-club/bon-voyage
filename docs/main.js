const f = g => {
  var h, a, k;
  var p = "The Google Maps JavaScript API";
  var c = "google";
  var l = "importLibrary";
  var q = "__ib__";
  var m = document;
  var b = window;
  b = b[c] || (b[c] = {});
  var d = b.maps || ( b.maps={} );
  var r = new Set;
  var e = new URLSearchParams;
  var u = ()=> h || (h = new Promise(async (f, n)=>{
    await (a = m.createElement("script"));
    e.set("libraries", [...r] + "");
    for(k in g) {
      e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
    }
    e.set("callback", c + ".maps." + q)
    a.src = `https://maps.${c}apis.com/maps/api/js?` + e
    d[q] = f
    a.onerror=()=>h=n(Error(p+" could not load."))
    a.nonce=m.querySelector("script[nonce]")?.nonce||""
    m.head.append(a)
  }))
  d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f,...n) => r.add(f) && u().then(()=>d[l](f,...n));
  console.log("Ready!")
};
f({ key: "AIzaSyAqprQv4t2EE8M4pp_Sb_4CEOfLoiWf77s", v: "beta" });

const { AdvancedMarkerView } = await google.maps.importLibrary("marker");
const { Map } = await google.maps.importLibrary("maps");

const intersectionObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("drop");
      intersectionObserver.unobserve(entry.target);
    }
  }
});

// Initialize and add the map
let map;

async function plotPositions(map) {
  const url = "https://storage.googleapis.com/yancya-club-bon-voyage/positions.json"
  const by_visited_at = (a, b) => a.visited_at == b.visited_at ? 0 : (a.visited_at > b.visited_at ? 1 : -1);
  fetch(url, { mode: "cors" }).then(response => response.json()).then(data => {
    data.sort(by_visited_at).forEach((position, index) => {
      const latLng = { lat: position.latitude, lng: position.longitude };
      const footprint = document.createElement("img");
      footprint.src = data.length == index+1 ? "./yancya.png" : "./footprint.png";
      map.setCenter(latLng);
      const advancedMarkerView = new AdvancedMarkerView({
        map: map,
        position: latLng,
        content: footprint,
        title: position.visited_at,
      });
      const element = advancedMarkerView.content;
      element.style.opacity = 0;
      element.addEventListener("animationend", (event) => {
        element.classList.remove("drop");
        element.style.opacity = ((index+1) / (data.length)) * 0.7 + 0.3
      });
      const delay = index * 0.1 + "s";
      element.style.setProperty("--delay-time", delay);
      intersectionObserver.observe(advancedMarkerView.content);
    });
  });
}

async function initMap() {
  map = new Map(document.getElementById("main"), {
    zoom: 5,
    mapId: "BON_VOYAGE_YANCYA_CLUB",
  });

  await plotPositions(map);
}

initMap();
