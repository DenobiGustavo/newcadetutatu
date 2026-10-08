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
  maxClusterRadius: 40,
  // O numero e visual; o leitor de tela le "Grupo de N especies" (WCAG 1.1.1 / 4.1.2)
  iconCreateFunction: function (cluster) {
    const n = cluster.getChildCount();
    const tamanho = n < 10 ? 'small' : (n < 100 ? 'medium' : 'large');
    return L.divIcon({
      html: '<div><span aria-hidden="true">' + n + '</span><span class="sr-only">Grupo de ' + n +
        ' espécies. Pressione Enter para aproximar.</span></div>',
      className: 'marker-cluster marker-cluster-' + tamanho,
      iconSize: new L.Point(40, 40)
    });
  }
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

// Os textos vem do Painel (editados por pesquisadores), entao nunca entram
// no HTML do popup sem escapar.
function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Link para a pagina de detalhes da especie (os dados seguem pela URL).
function urlInfo(specie) {
  const params = new URLSearchParams({
    name: specie.name,
    scientific_name: specie.scientific_name,
    family: specie.family,
    habitat: specie.habitat,
    habits: specie.habits,
    food: specie.food,
    curiosities: specie.curiosities,
    geographic_distribution: specie.geographic_distribution,
    image_url: specie.image_url,
    image_credit: specie.image_credit,
    order: specie.order,
    division: specie.division
  });
  return `info.html?${params.toString()}`;
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
      <h3 style="margin-bottom:8px;">${escaparHtml(item.specie.name)}</h3>
      <a href="${escaparHtml(urlInfo(item.specie))}"
        style="
          display:inline-block;
          margin-top:5px;
          padding:8px 12px;
          background-color:#087f45;
          color:white;
          text-decoration:none;
          border-radius:5px;
          cursor:pointer;
        ">
        Saiba mais
      </a>
    </div>
  `;
}

// ==========================
// Adiciona marcadores do mapa (dados vem do Painel Cientifico)
// ==========================
// Animais entram nas coordenadas do Painel. Plantas nao tem coordenada no
// Painel: ficam espalhadas perto dos animais, numa posicao sorteada a partir
// do id da planta (assim ela nao muda de lugar a cada vez que o mapa abre).
let animaisComCoords = [];
const jitter = 0.00003;
const posicoesUsadas = {};

// Marcador acessivel: tem nome para leitor de tela (alt/title), recebe foco pelo
// teclado, abre o popup com Enter e anuncia o nome ao passar o mouse ou focar.
function criarMarcador(item, lat, lng) {
  const nome = item.specie.name;
  const descricao = nome + ', ' + categoriaDaEspecie(item.specie.division);

  const marker = L.marker([lat, lng], {
    icon: criarIcone(item.specie.division),
    title: nome,
    alt: descricao,
    keyboard: true
  }).bindPopup(criarPopup(item));

  marker.on('add', function () {
    anunciarAoInteragir(marker.getElement(), descricao);
  });
  return marker;
}

// Gerador pseudoaleatorio com semente (mulberry32), alimentado por um hash do texto.
function aleatorioComSemente(texto) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let x = Math.imul(a ^ (a >>> 15), 1 | a);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function adicionarMarcadores(itens) {
  animaisComCoords = itens.filter(a => a.coordinates && a.coordinates.length > 0);

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

      clusterGroup.addLayer(criarMarcador(animal, lat, lng));
    });
  });

  // Plantas: sem coordenada no Painel, ficam perto de um animal (sorteio fixo por planta)
  if (animaisComCoords.length === 0) return;
  itens.filter(item => !item.coordinates).forEach(planta => {
    const sorteio = aleatorioComSemente(planta.id);
    const refAnimal = animaisComCoords[Math.floor(sorteio() * animaisComCoords.length)];
    const refCoord = refAnimal.coordinates[0];
    const lat = refCoord.lat + (sorteio() - 0.5) * jitter * 5;
    const lng = refCoord.lng + (sorteio() - 0.5) * jitter * 5;

    clusterGroup.addLayer(criarMarcador(planta, lat, lng));
  });
}

// Adiciona cluster ao mapa
map.addLayer(clusterGroup);

// ==========================
// Carregamento a partir do Painel (com aviso de carregando / erro)
// ==========================
// A API roda em plano gratuito: o primeiro acesso depois de um tempo parado
// pode levar ate um minuto, por isso o aviso na tela.
function mostrarStatus(mensagem, comTentarNovamente) {
  const caixa = document.getElementById('status-mapa');
  if (!caixa) return;
  caixa.textContent = '';
  const texto = document.createElement('span');
  texto.textContent = mensagem;
  caixa.appendChild(texto);
  if (comTentarNovamente) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = 'Tentar novamente';
    botao.addEventListener('click', carregarDoPainel);
    caixa.appendChild(botao);
  }
  caixa.hidden = false;
}

function esconderStatus() {
  const caixa = document.getElementById('status-mapa');
  if (caixa) caixa.hidden = true;
}

async function carregarDoPainel() {
  mostrarStatus('Carregando espécies do Painel Científico… O primeiro acesso pode levar até um minuto.', false);
  try {
    const especies = await listarEspeciesPublico();
    clusterGroup.clearLayers();
    adicionarMarcadores(adaptarParaMapa(especies));
    esconderStatus();
  } catch (erro) {
    mostrarStatus('Não foi possível carregar o mapa agora.', true);
  }
}

carregarDoPainel();

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

  // pegar 3 exemplos reais do Painel
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
  img.alt = item.specie.name + ', ' + categoriaDaEspecie(item.specie.division);
  img.tabIndex = 0;
  img.setAttribute('role', 'button');
  anunciarAoInteragir(img, img.alt);
  img.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      img.click();
    }
  });

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

  const btnMapa = document.querySelector('#btn-mapa');
  const btnImagem = document.querySelector('#btn-imagem');
  if (btnMapa) btnMapa.setAttribute('aria-pressed', String(estadoAtual === 'mapa'));
  if (btnImagem) btnImagem.setAttribute('aria-pressed', String(estadoAtual === 'imagem'));

  if (estadoAtual === 'mapa') {
    const botaoMapa = document.querySelector('#btn-mapa');
    if (botaoMapa) {
      botaoMapa.classList.add('ativo');
      botaoMapa.style.backgroundColor = '#1d4ed8';
      botaoMapa.style.transform = 'translateY(-2px)';
      botaoMapa.style.boxShadow = '0 6px 18px rgba(29, 78, 216, 0.4)';
    }
  } else {
    const botaoImagem = document.querySelector('#btn-imagem');
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

// Botoes de visualizacao (antes eram onclick no HTML, que a CSP nao permite)
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('btn-mapa').addEventListener('click', usarMapaNormal);
  document.getElementById('btn-imagem').addEventListener('click', usarImagemFundo);
});
