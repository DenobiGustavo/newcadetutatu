// ==========================
// Cliente da API publica do Painel Cientifico CadeTuTatu (somente leitura,
// sem login). E a unica fonte de dados do mapa.
// ==========================
const PAINEL_API_URL = 'https://cadetutatu.onrender.com/api/publico';

// Busca todas as paginas e devolve um array unico com todas as especies.
async function listarEspeciesPublico() {
  const todas = [];
  let pagina = 1;

  for (;;) {
    const resposta = await fetch(`${PAINEL_API_URL}/especies?page=${pagina}&limit=100`);
    if (!resposta.ok) {
      throw new Error('Nao foi possivel carregar os dados do Painel Cientifico.');
    }
    const json = await resposta.json();
    todas.push(...json.especies);
    if (pagina >= json.paginacao.totalPaginas) break;
    pagina += 1;
  }

  return todas;
}

// Converte a ficha publica do Painel para o formato que o mapa ja usa
// (o mesmo do antigo dados.js), para nao reescrever popup e marcadores.
//   division: 'Plantae' = planta, '1' = vertebrado, '2' = invertebrado
//   coordinates: lista de {lat, lng, data}, ou null se a especie nao tem ponto
function adaptarParaMapa(especies) {
  return especies.map((e) => ({
    id: e.uuid,
    coordinates: e.pontos && e.pontos.length
      ? e.pontos.map((p) => ({ lat: p.latitude, lng: p.longitude, data: p.dataObservacao }))
      : null,
    specie: {
      name: e.nomePopular || e.nomeCientifico,
      scientific_name: e.nomeCientifico,
      family: e.familia || '',
      food: e.alimentacao || '',
      geographic_distribution: e.distribuicao || '',
      habitat: e.habitat || '',
      habits: e.habitos || '',
      order: e.ordem || '',
      curiosities: (e.curiosidades || []).join(' '),
      image_url: (e.foto && e.foto.url) || '',
      image_credit: (e.foto && e.foto.credito) || '',
      division: e.tipo === 'PLANTA' ? 'Plantae' : (e.vertebrado === false ? '2' : '1'),
    },
  }));
}
