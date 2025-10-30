// ==========================
// Inicializa o mapa
// ==========================
var map = L.map('map', {
  center: [-23.1080, -50.3570], // Centralizado na UENP
  zoom: 16,
  zoomControl: false
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
  let url = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'; // padrão planta

  if (tipo === '1') url = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';      // vertebrado
  if (tipo === '2') url = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';       // invertebrado
  if (tipo === 'Plantae') url = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'; // planta

  return L.icon({
    iconUrl: url,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -35]
  });
}

// Função para criar popup estilizado
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

// ==========================
// Adiciona marcadores do mapa
// ==========================
const animaisComCoords = data.filter(a => a.coordinates && a.coordinates.length > 0);
const jitter = 0.00003;
const posicoesUsadas = {};

// Marcadores animais
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

// Marcadores plantas próximas
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

// ==========================
// Alternância entre mapa e imagem
// ==========================
let estadoAtual = 'mapa'; // 'mapa' ou 'imagem'

// Cria overlay da imagem de fundo
function criarOverlayImagem() {
  const overlay = document.createElement('div');
  overlay.id = 'background-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: url('./images/Mapa_azul.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 999;
    display: none;
  `;

  // camada de marcadores
  const markerLayer = document.createElement('div');
  markerLayer.id = 'image-markers';
  markerLayer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  `;
  overlay.appendChild(markerLayer);

  document.body.appendChild(overlay);

  // pegar 3 exemplos reais do data
  const exemplos = animaisComCoords.slice(0, 3);
  const posicoes = [
    { top: 20, left: 30 },
    { top: 50, left: 60 },
    { top: 70, left: 40 }
  ];

  exemplos.forEach((item, i) => {
    adicionarMarcadorImagem(
      posicoes[i].top,
      posicoes[i].left,
      item,
      item.specie.division
    );
  });

  return overlay;
}

// Função para adicionar marcador na imagem
function adicionarMarcadorImagem(topPercent, leftPercent, item, tipo) {
  const markerLayer = document.getElementById('image-markers');
  if (!markerLayer) return;

  const icon = criarIcone(tipo);
  const img = document.createElement('img');
  img.src = icon.options.iconUrl;
  img.style.cssText = `
    position: absolute;
    top: ${topPercent}%;
    left: ${leftPercent}%;
    transform: translate(-50%, -100%);
    width: ${icon.options.iconSize[0]}px;
    height: ${icon.options.iconSize[1]}px;
    cursor: pointer;
    pointer-events: auto;
  `;
  img.title = item.specie.name;

  img.addEventListener('click', () => {
    const popup = L.popup()
      .setLatLng(map.getCenter())
      .setContent(criarPopup(item))
      .openOn(map);
  });

  markerLayer.appendChild(img);
}

// ==========================
// Botões de alternância
// ==========================
function usarImagemFundo() {
  let overlay = document.getElementById('background-overlay');
  if (!overlay) overlay = criarOverlayImagem();
  overlay.style.display = 'block';
  estadoAtual = 'imagem';
  atualizarEstadoBotoes();
}

function usarMapaNormal() {
  const overlay = document.getElementById('background-overlay');
  if (overlay) overlay.style.display = 'none';
  estadoAtual = 'mapa';
  atualizarEstadoBotoes();
}

function atualizarEstadoBotoes() {
  const botoes = document.querySelectorAll('.map-buttons button');
  botoes.forEach(botao => {
    botao.classList.remove('ativo');
    botao.style.backgroundColor = '';
    botao.style.transform = '';
    botao.style.boxShadow = '';
  });

  if (estadoAtual === 'mapa') {
    const botaoMapa = document.querySelector('button[onclick="usarMapaNormal()"]');
    if (botaoMapa) {
      botaoMapa.classList.add('ativo');
      botaoMapa.style.backgroundColor = '#1d4ed8';
      botaoMapa.style.transform = 'translateY(-2px)';
      botaoMapa.style.boxShadow = '0 6px 18px rgba(29, 78, 216, 0.4)';
    }
  } else {
    const botaoImagem = document.querySelector('button[onclick="usarImagemFundo()"]');
    if (botaoImagem) {
      botaoImagem.classList.add('ativo');
      botaoImagem.style.backgroundColor = '#1d4ed8';
      botaoImagem.style.transform = 'translateY(-2px)';
      botaoImagem.style.boxShadow = '0 6px 18px rgba(29, 78, 216, 0.4)';
    }
  }
}

// Inicializa estado dos botões ao carregar
document.addEventListener('DOMContentLoaded', atualizarEstadoBotoes);

// ESC volta ao mapa
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && estadoAtual === 'imagem') usarMapaNormal();
});
