// Inicializa o mapa
var map = L.map('map', {
  center: [-23.1080, -50.3570], // Centralizado na UENP
  zoom: 16,
  zoomControl: true
});

// Camada base do mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Cluster de marcadores
const clusterGroup = L.markerClusterGroup({
  maxClusterRadius: 40
});

// Função para criar ícones
function criarIcone(tipo) {
  let url = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'; // planta
  if (tipo === '1') url = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  if (tipo === '2') url = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
  return L.icon({
    iconUrl: url,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -35]
  });
}

// Função para criar popup estilizado (APENAS nome + botão)
function criarPopup(item) {
  return `
    <div style="
      text-align:center;
      font-family:Arial,sans-serif;
      max-width:200px;
      background-color:#156AC7; 
      color: white; 
      padding: 10px;
      border-radius: 10px;
      box-sizing: border-box;
    ">
      <h3 style="margin-bottom:8px;">${item.specie.name}</h3>
      <button onclick="window.location.href='info.html?name=${encodeURIComponent(item.specie.name)}&scientific_name=${encodeURIComponent(item.specie.scientific_name)}&family=${encodeURIComponent(item.specie.family)}&habitat=${encodeURIComponent(item.specie.habitat)}&habits=${encodeURIComponent(item.specie.habits)}&food=${encodeURIComponent(item.specie.food)}&curiosities=${encodeURIComponent(item.specie.curiosities)}&geographic_distribution=${encodeURIComponent(item.specie.geographic_distribution)}&image_url=${encodeURIComponent(item.specie.image_url)}'"
        style="
          margin-top:5px; 
          padding:8px 12px; 
          background-color:#0CBB68; 
          color:white; 
          border:none; 
          border-radius:5px; 
          cursor:pointer;
        ">
        Saiba mais
      </button>
    </div>
  `;
}

// Adiciona animais com coordenadas
const animaisComCoords = data.filter(a => a.coordinates && a.coordinates.length > 0);
const jitter = 0.00003;
const posicoesUsadas = {};

animaisComCoords.forEach(animal => {
  animal.coordinates.forEach(coord => {
    let key = `${coord.lat.toFixed(6)}_${coord.lng.toFixed(6)}`;
    let lat = coord.lat;
    let lng = coord.lng;

    if (posicoesUsadas[key]) {
      lat += (Math.random() - 0.5) * jitter;
      lng += (Math.random() - 0.5) * jitter;
    }
    posicoesUsadas[key] = true;

    const marker = L.marker([lat, lng], { icon: criarIcone(animal.specie.division) })
      .bindPopup(criarPopup(animal));

    clusterGroup.addLayer(marker);
  });
});

// Adiciona plantas próximas aos animais
data.forEach(item => {
  if (!item.coordinates) {
    const refAnimal = animaisComCoords[Math.floor(Math.random() * animaisComCoords.length)];
    const refCoord = refAnimal.coordinates[0];
    const lat = refCoord.lat + (Math.random() - 0.5) * jitter * 5;
    const lng = refCoord.lng + (Math.random() - 0.5) * jitter * 5;

    const marker = L.marker([lat, lng], { icon: criarIcone('planta') })
      .bindPopup(criarPopup(item));

    clusterGroup.addLayer(marker);
  }
});

// Adiciona cluster ao mapa
map.addLayer(clusterGroup);
