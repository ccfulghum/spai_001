// Configuration file template
// Copy this file to config.js and add your actual API keys
//const CONFIG = {
//    GOOGLE_MAPS_API_KEY: 'AIzaSyB7Rztr57OSJjXEASCk3zgJWjpE9T0Ihbs'
//};



<script>
  (g => {
    let h, a, k, p = "The Google Maps JavaScript API",
      c = "google", l = "importLibrary", q = "__ib__",
      m = document, b = window;
    b = b[c] || (b[c] = {});
    let d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams,
      u = () => h || (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + "");
        for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
        e.set("callback", "initMap");
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        a.onerror = () => h = n(Error(p + " could not load."));
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
        m.head.append(a);
      }));
    d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
  })({
    key: 'AIzaSyB7Rztr57OSJjXEASCk3zgJWjpE9T0Ihbs',
    v: "weekly"
  });
</script>
