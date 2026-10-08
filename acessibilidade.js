// ==========================
// Acessibilidade do mapa (WCAG 2.1: Perceptivel e Operavel)
//  - leitor de tela anuncia o nome da especie ao passar o mouse / focar no ponto
//  - instrucoes visuais de uso do mapa (pinca e clique), com botao de ajuda
// O VLibras (traducao para Libras) e carregado direto no HTML.
// ==========================

// ---- Narracao por voz (som) ----
// O VLibras so sinaliza em Libras, nao fala. O "som" do recurso e este: o navegador le o
// nome da especie em voz alta (Web Speech API) ao passar o mouse ou focar no ponto.
// Fica ligada por padrao e pode ser desligada no botao Narracao (a escolha e lembrada).
// Obs.: o Chrome so libera a voz depois que a pessoa interage com a pagina (um clique).
const CHAVE_NARRACAO = 'cadetutatu_narracao';
const temVoz = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

function narracaoLigada() {
  try { return localStorage.getItem(CHAVE_NARRACAO) !== '0'; } catch (e) { return true; }
}

let narracaoAtiva = narracaoLigada();

function falar(texto) {
  if (!narracaoAtiva || !temVoz || !texto) return;
  // Cancela a fala anterior: passar o mouse por varios pontos nao forma fila
  window.speechSynthesis.cancel();
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = 'pt-BR';
  const voz = window.speechSynthesis.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith('pt'));
  if (voz) fala.voice = voz;
  window.speechSynthesis.speak(fala);
}

function iniciarNarracao() {
  const botao = document.getElementById('btn-narracao');
  if (!botao) return;
  if (!temVoz) {
    // Navegador sem voz: o botao nao faz sentido
    botao.hidden = true;
    return;
  }
  function atualizar() {
    botao.setAttribute('aria-pressed', String(narracaoAtiva));
    botao.textContent = narracaoAtiva ? 'Narração: ligada' : 'Narração: desligada';
  }
  atualizar();
  botao.addEventListener('click', () => {
    narracaoAtiva = !narracaoAtiva;
    try { localStorage.setItem(CHAVE_NARRACAO, narracaoAtiva ? '1' : '0'); } catch (e) { /* sem armazenamento */ }
    atualizar();
    if (narracaoAtiva) falar('Narração ligada');
    else window.speechSynthesis.cancel();
  });
  // Algumas vozes so ficam disponiveis depois de carregarem
  if (window.speechSynthesis.onvoiceschanged !== undefined) window.speechSynthesis.onvoiceschanged = () => {};
}

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

  // Tambem fala em voz alta, para quem nao usa leitor de tela
  falar(texto);
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
document.addEventListener('DOMContentLoaded', iniciarNarracao);
