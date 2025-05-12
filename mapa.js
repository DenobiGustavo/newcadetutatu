// Dados dos animais
const animais = [
  {
    id: "2f70e816-ee29-48d0-bd50-6041a4043130",
    coordinates: [-23.1078, -50.3594],
    icon_color: "blue",
    specie: {
      name: "Avoante",
      scientific_name: "Zenaida auriculata",
      order: "Columbiformes",
      family: "Columbidae",
      habitat: "Originalmente ave campestre típica da caatinga, encontrada em áreas abertas e plantações.",
      food: "Granívoro, alimenta-se de grãos silvestres e de algumas sementes.",
      habits: "Migratória no nordeste do Brasil, sua população nesse bioma aumenta entre março e agosto.",
      curiosities: "É muito prolífica. Autor das fotos: Lucas Cordeiro.",
      geographic_distribution: "Ocorre em todo o Brasil.",
      reference: "WikiAves (2023) WikiAves, a Enciclopédia das Aves...",
      image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT0gKDIe1NuurLl6YnX-OqIbGQHKolrz-3tpAsnYn-2VzmjXtAEWATI5OHctiZ56b3IFfZAmD2pVM603EPPSy6UQ"
    }
  },
  {
    id: "d0884f3-6e98-4620-b1de-90b673cd9efb",
    coordinates: [-23.117, -50.334],
    icon_color: "blue",
    specie: {
      name: "Risadinha",
      scientific_name: "Camptostoma obsoletum",
      order: "Passeriformes",
      family: "Tyrannidae",
      habitat: "Ocorre desde a floresta amazônica até áreas de caatinga e cerrados.",
      food: "Se alimenta de invertebrados e de frutos.",
      habits: "Desconfiado, está sempre movimentando-se bastante entre os galhos das árvores.",
      curiosities: "Apresenta um período reprodutivo que vai de julho a dezembro.",
      geographic_distribution: "Ocorre em todo o Brasil, também na América Central.",
      reference: "WikiAves (2023) WikiAves, a Enciclopédia das Aves...",
      image_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSWlFFxaxMTXPNm1RlFZOtZrV77zfUIay1Y1sqj-ulG6bDCNS5GfmzLLk7LzXW4mASHy38CRIzoC13IhCuo5_0hOA"
    }
  },
  {
    id: "b3aa9204-432f-4800-9516-9e15baead09d",
    coordinates: [-23.1088, -50.332],
    icon_color: "blue",
    specie: {
      name: "Saí-canário",
      scientific_name: "Thlypopsis sordida",
      order: "Passeriformes",
      family: "Thraupidae",
      habitat: "Vive em formações florestais secundárias e até mesmo em áreas urbanas arborizadas.",
      food: "Se alimenta de frutos, sementes e insetos capturados em folhas ou no solo.",
      habits: "Vive solitário ou em pares no período reprodutivo.",
      curiosities: "Autor das fotos: Lucas Cordeiro C. Silva.",
      geographic_distribution: "Possui ampla distribuição na América do Sul e em regiões brasileiras.",
      reference: "WikiAves (2023) WikiAves, a Enciclopédia das Aves do Brasil.",
      image_url: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSdxQ8XdUvcrgwGgLFsiN-jqw2JUBaoa3Yq2mPBFLwvpwhFPx6pueJEYoq_S42oMYEU-ukc7lymZ1Mt9bqT_N3k5w"
    }
  },
  {
    id: "0e2ed97e-ba74-4c45-933c-52e0f1749c13",
    coordinates: [-23.103, -50.3625],
    icon_color: "blue",
    specie: {
      name: "Tiziu",
      scientific_name: "Volatinia jacarina",
      order: "Passeriformes",
      family: "Thraupidae",
      habitat: "Geralmente visto em áreas desprovidas de vegetação densa, como campos e pastos.",
      food: "Sua principal alimentação são sementes de gramíneas.",
      habits: "Possui o hábito de saltar enquanto canta. Na época reprodutiva, apresenta comportamento territorial.",
      curiosities: "Possui dimorfismo sexual; a fêmea é marrom-oliva enquanto o macho é preto com brilho azul metálico.",
      geographic_distribution: "Presente em todo o Brasil e em todos os países da América do Sul.",
      reference: "WikiAves (2023) WikiAves, a Enciclopédia das Aves do Brasil.",
      image_url: " https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ5Wpm7JxA_YlBD8wZ_yUdzKboAkov0kMaAA8x3Uh73kO_iTPN9TBJmAx2aY51Xq7odDmjFTNPku0UXpaOzSk3cLw"
    }
  },
  {
    id: "0fc025a2-1025-4687-955a-432d8971992b",
    coordinates: [-23.1038, -50.3677],
    icon_color: "blue",
    specie: {
      name: "Sanhaço-cinzento",
      scientific_name: "Thraupis sayaca",
      order: "Passeriformes",
      family: "Thraupidae",
      habitat: "Habita matas abertas, capões, matas ciliares, zonas urbanas e rurais.",
      food: "Se alimenta de frutos, folhas, brotos, flores de plantas e ocasionalmente de insetos.",
      habits: "Anda quase sempre em casais ou pequenos bandos, tem voo curto e rápido.",
      curiosities: "Autor das fotos: Lucas Cordeiro C. Silva.",
      geographic_distribution: "Ocorre nas regiões tropicais e subtropicais ao sul da América do Sul.",
      reference: "WikiAves (2023) WikiAves, a Enciclopédia das Aves do Brasil.",
      image_url: " https://s3.amazonaws.com/media.wikiaves.com.br/images/4481/1844543_57c2f9fd80e85441e6d9995ce94edf6b.jpg"
    }
  },
  {
    id: "761a27c7-a12a-4083-b4ed-74e46f424032",
    coordinates: [-23.1070, -50.3530],
    icon_color: "red",
    specie: {
      name: "Piolho-de-cobra",
      scientific_name: "Ommatoiulus sp.",
      order: "Julida",
      family: "Julidae",
      habitat: "Rochas, serrapilheira e troncos em decomposição.",
      food: "São detritívoros, ou seja, se alimentam de restos orgânicos.",
      habits: "Possuem hábitos crípticos, evitando a presença de predadores.",
      curiosities: "Quando se sentem ameaçados, podem se enrolar como uma defesa contra predadores.",
      geographic_distribution: "Ampla distribuição no mundo, principalmente nos ambientes tropicais.",
      reference: "BRUSCA, Ricardo C.; MOORE, Wendy; SHUSTER, Stephen. (2023)",
      image_url: "https://s1.static.brasilescola.uol.com.br/be/2022/01/piolho-de-cobra.jpg"
    }
  }
]

// Inicializa o mapa
var map = L.map('map', {
  center: [-23.1111, -50.3606],
  zoom: 15,
  zoomControl: true,
  dragging: true,
  scrollWheelZoom: true,
  doubleClickZoom: true,
  boxZoom: true,
  keyboard: true,
  touchZoom: true
});

// Camada padrão do mapa
const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Limites da imagem
const bounds = [[-23.115, -50.366], [-23.106, -50.355]];
let imageOverlay;

// Função para tornar mapa interativo
function ativarInteracaoMapa(ativo) {
  if (ativo) {
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    map.zoomControl.addTo(map);
  } else {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.zoomControl.remove();
  }
}

// Trocar para imagem
function usarImagemFundo() {
  if (map.hasLayer(tileLayer)) {
    map.removeLayer(tileLayer);
  }

  if (!imageOverlay) {
    // Ajusta para que a imagem ocupe toda a tela
    imageOverlay = L.imageOverlay('./images/Mapa.png', map.getBounds());
  }

  imageOverlay.addTo(map);
  map.fitBounds(map.getBounds()); // Ajusta para mostrar a imagem inteira
  ativarInteracaoMapa(false); // Desativa interações
}

// Voltar para mapa interativo
function usarMapaNormal() {
  if (imageOverlay && map.hasLayer(imageOverlay)) {
    map.removeLayer(imageOverlay);
  }

  if (!map.hasLayer(tileLayer)) {
    tileLayer.addTo(map);
  }

  map.setView([-23.1111, -50.3606], 15);
  ativarInteracaoMapa(true); // Ativa interações
}

// Adiciona marcadores dos animais
animais.forEach(animal => {
  let iconUrl = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  if (animal.icon_color === 'red') {
    iconUrl = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
  }

  const checkpointIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -35]
  });

  L.marker(animal.coordinates, { icon: checkpointIcon })
    .addTo(map)
    .bindPopup(`
      <div style="text-align: center;">
        <h3 style="margin-bottom: 8px;">${animal.specie.name}</h3>
        <img src="${animal.specie.image_url}" alt="${animal.specie.name}" style="width: 150px; height: auto; border-radius: 8px; margin-bottom: 8px;">
        <br>
        <button onclick="window.location.href='info.html?name=${encodeURIComponent(animal.specie.name)}&scientific_name=${encodeURIComponent(animal.specie.scientific_name)}&family=${encodeURIComponent(animal.specie.family)}&habitat=${encodeURIComponent(animal.specie.habitat)}&habits=${encodeURIComponent(animal.specie.habits)}&food=${encodeURIComponent(animal.specie.food)}&curiosities=${encodeURIComponent(animal.specie.curiosities)}&geographic_distribution=${encodeURIComponent(animal.specie.geographic_distribution)}&image_url=${encodeURIComponent(animal.specie.image_url)}'"
          style="margin-top:5px; padding:8px 12px; background-color:#007BFF; color:white; border:none; border-radius:5px; cursor:pointer;">
          Saiba mais
        </button>
      </div>
    `);
});