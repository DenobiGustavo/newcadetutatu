// ==========================
// Acessibilidade do mapa (WCAG 2.1: Perceptivel e Operavel)
//  - leitor de tela anuncia o nome da especie ao passar o mouse / focar no ponto
//  - instrucoes visuais de uso do mapa (pinca e clique), com botao de ajuda
// O VLibras (traducao para Libras) e carregado direto no HTML.
// ==========================

// ---- Anuncio para leitores de tela ----
let ultimoAnuncio = '';
let ultimoAnuncioEm = 0;

function anunciar(texto) {
  const regiao = document.getElementById('anuncio-mapa');
  if (!regiao || !texto) return;

  // Evita repetir o mesmo nome varias vezes seguidas (mouse tremendo sobre o ponto)
  const agora = Date.now();
  if (texto === ultimoAnuncio && agora - ultimoAnuncioEm < 1500) return;
  ultimoAnuncio = texto;
  ultimoAnuncioEm = agora;

  // Limpa e reescreve, para o leitor de tela falar de novo mesmo se o texto for igual ao anterior
  regiao.textContent = '';
  setTimeout(() => { regiao.textContent = texto; }, 60);
}

function categoriaDaEspecie(division) {
  if (division === 'Plantae') return 'planta';
  if (division === '2') return 'animal invertebrado';
  return 'animal vertebrado';
}

// Faz um elemento (ex.: marcador) anunciar o nome ao passar o mouse ou receber foco
function anunciarAoInteragir(elemento, texto) {
  if (!elemento) return;
  elemento.addEventListener('mouseenter', () => anunciar(texto));
  elemento.addEventListener('focus', () => anunciar(texto));
}

// ---- Instrucoes visuais ----
const CHAVE_INSTRUCOES = 'cadetutatu_instrucoes_vistas';

function instrucoesJaVistas() {
  try { return localStorage.getItem(CHAVE_INSTRUCOES) === '1'; } catch (e) { return false; }
}

function marcarInstrucoesVistas() {
  try { localStorage.setItem(CHAVE_INSTRUCOES, '1'); } catch (e) { /* sem armazenamento: so mostra de novo */ }
}

function iniciarInstrucoes() {
  const painel = document.getElementById('instrucoes-mapa');
  const passoZoom = document.getElementById('instrucao-zoom');
  const passoClique = document.getElementById('instrucao-clique');
  const botaoAjuda = document.getElementById('ajuda-mapa');
  if (!painel || !passoZoom || !passoClique || !botaoAjuda) return;

  function mostrarPasso(passo) {
    passoZoom.hidden = passo !== 'zoom';
    passoClique.hidden = passo !== 'clique';
    const alvo = passo === 'zoom' ? 'instrucao-proximo' : 'instrucao-entendi';
    document.getElementById(alvo).focus();
  }

  function abrir() {
    painel.hidden = false;
    mostrarPasso('zoom');
  }

  function fechar() {
    painel.hidden = true;
    marcarInstrucoesVistas();
    botaoAjuda.focus();
  }

  document.getElementById('instrucao-proximo').addEventListener('click', () => mostrarPasso('clique'));
  document.getElementById('instrucao-entendi').addEventListener('click', fechar);
  botaoAjuda.addEventListener('click', abrir);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !painel.hidden) fechar();
  });

  // Primeira visita: mostra sozinho (sem roubar o foco do leitor de tela de cara)
  if (!instrucoesJaVistas()) {
    painel.hidden = false;
    passoZoom.hidden = false;
    passoClique.hidden = true;
  }
}

document.addEventListener('DOMContentLoaded', iniciarInstrucoes);
