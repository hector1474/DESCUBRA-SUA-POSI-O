/* ════════════════════════════════════════════════════════════════
   SportMatch · script.js
   Lógica principal: loading, nav, quiz, algoritmo, relatório
════════════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────
   1. DADOS DO QUIZ — habilidades avaliadas
────────────────────────────────────── */
const HABILIDADES = [
  { id: 'velocidade',       nome: 'Velocidade',          icon: '⚡', hint: 'Quão rápido você consegue se mover em quadra?' },
  { id: 'resistencia',      nome: 'Resistência Física',  icon: '🫁', hint: 'Por quanto tempo você mantém o rendimento sem cansar?' },
  { id: 'trabalhoEquipe',   nome: 'Trabalho em Equipe',  icon: '🤝', hint: 'Como você se comunica e coopera com seus companheiros?' },
  { id: 'reflexo',          nome: 'Reflexo',             icon: '👁️', hint: 'Sua capacidade de reagir rapidamente a situações inesperadas.' },
  { id: 'lideranca',        nome: 'Liderança',           icon: '👑', hint: 'Você organiza e motiva o grupo, especialmente em momentos difíceis?' },
  { id: 'precisao',         nome: 'Precisão',            icon: '🎯', hint: 'Acurácia nos passes, arremessos ou finalizações.' },
  { id: 'agilidade',        nome: 'Agilidade',           icon: '🔄', hint: 'Capacidade de mudar de direção rapidamente.' },
  { id: 'forca',            nome: 'Força Física',        icon: '💪', hint: 'Potência muscular para disputas de bola e contatos físicos.' },
  { id: 'tomadaDecisao',    nome: 'Tomada de Decisão',   icon: '🧠', hint: 'Escolher a melhor ação no menor tempo possível.' },
];

/* ──────────────────────────────────────
   2. MAPEAMENTO DE POSIÇÕES POR ESPORTE
   Cada posição tem pesos para cada habilidade (soma dos pesos
   define o "score" de compatibilidade).
────────────────────────────────────── */
const POSICOES = {
  futsal: [
    { nome: 'Goleiro', pesos: { reflexo:3, agilidade:3, tomadaDecisao:2, forca:1, resistencia:1 } },
    { nome: 'Fixo',    pesos: { lideranca:3, resistencia:3, tomadaDecisao:2, trabalhoEquipe:2 } },
    { nome: 'Ala',     pesos: { velocidade:3, agilidade:3, trabalhoEquipe:2, precisao:2 } },
    { nome: 'Pivô',    pesos: { forca:3, precisao:3, tomadaDecisao:2, resistencia:1 } },
  ],
  futebol: [
    { nome: 'Goleiro',     pesos: { reflexo:4, agilidade:3, tomadaDecisao:2, forca:1 } },
    { nome: 'Zagueiro',    pesos: { forca:4, resistencia:3, tomadaDecisao:2, lideranca:1 } },
    { nome: 'Lateral',     pesos: { velocidade:4, resistencia:3, trabalhoEquipe:2, precisao:1 } },
    { nome: 'Volante',     pesos: { resistencia:4, trabalhoEquipe:3, lideranca:2, forca:1 } },
    { nome: 'Meia',        pesos: { precisao:4, tomadaDecisao:3, trabalhoEquipe:2, agilidade:1 } },
    { nome: 'Ponta',       pesos: { velocidade:4, agilidade:3, precisao:2, trabalhoEquipe:1 } },
    { nome: 'Centroavante',pesos: { forca:3, precisao:4, tomadaDecisao:2, resistencia:1 } },
  ],
  volei: [
    { nome: 'Levantador', pesos: { precisao:4, tomadaDecisao:3, lideranca:2, trabalhoEquipe:1 } },
    { nome: 'Líbero',     pesos: { reflexo:4, agilidade:3, resistencia:3 } },
    { nome: 'Ponteiro',   pesos: { forca:3, velocidade:3, precisao:2, agilidade:2 } },
    { nome: 'Central',    pesos: { forca:4, reflexo:3, agilidade:2, tomadaDecisao:1 } },
    { nome: 'Oposto',     pesos: { forca:3, precisao:3, velocidade:2, tomadaDecisao:2 } },
  ],
  basquete: [
    { nome: 'Armador',    pesos: { tomadaDecisao:4, precisao:3, velocidade:2, lideranca:1 } },
    { nome: 'Ala-Armador',pesos: { velocidade:3, precisao:3, trabalhoEquipe:2, agilidade:2 } },
    { nome: 'Ala',        pesos: { velocidade:3, forca:3, resistencia:2, precisao:2 } },
    { nome: 'Ala-Pivô',   pesos: { forca:3, resistencia:3, agilidade:2, tomadaDecisao:2 } },
    { nome: 'Pivô',       pesos: { forca:4, resistencia:3, tomadaDecisao:2, lideranca:1 } },
  ],
  handebol: [
    { nome: 'Goleiro',         pesos: { reflexo:4, agilidade:3, tomadaDecisao:2, forca:1 } },
    { nome: 'Armador Central', pesos: { lideranca:3, tomadaDecisao:3, precisao:2, trabalhoEquipe:2 } },
    { nome: 'Armador Lateral', pesos: { velocidade:3, precisao:3, agilidade:2, trabalhoEquipe:2 } },
    { nome: 'Ponta',           pesos: { velocidade:4, agilidade:3, precisao:2, reflexo:1 } },
    { nome: 'Pivô',            pesos: { forca:4, resistencia:3, tomadaDecisao:2, agilidade:1 } },
  ],
};

/* textos de perfil por posição/esporte */
const PERFIS_TEXTO = {
  futsal: {
    'Goleiro':    'Você possui reflexos excepcionais e lê o jogo com rapidez. Como goleiro de futsal, é o último recurso da equipe e age sob pressão com serenidade.',
    'Fixo':       'Sua liderança e resistência fazem de você o organizador do time. O fixo equilibra defesa e ataque com inteligência tática.',
    'Ala':        'Velocidade e trabalho coletivo são seus trunfos. Como ala, você domina as laterais e cria desequilíbrios com sua explosão.',
    'Pivô':       'Força e precisão na área definem seu jogo. O pivô é o referencial ofensivo e precisa manter compostura perto do gol.',
  },
  futebol: {
    'Goleiro':     'Reflexo e agilidade são seus pontos altos. Você é o guardião da meta, fundamental para a segurança defensiva da equipe.',
    'Zagueiro':    'Força e leitura de jogo são suas armas. Como zagueiro, você impõe respeito nos duelos e organiza a linha defensiva.',
    'Lateral':     'Velocidade e resistência permitem cobrir toda a lateral. Você é eficaz tanto na marcação quanto no apoio ao ataque.',
    'Volante':     'Resistência e inteligência coletiva definem seu perfil. O volante é o pulmão do time, sempre disponível em campo.',
    'Meia':        'Precisão e visão de jogo são suas qualidades-chave. Você conecta defesa e ataque com passes cirúrgicos.',
    'Ponta':       'Velocidade e agilidade fazem de você um pesadelo para os defensores. Sua explosão cria chances de gol importantes.',
    'Centroavante':'Força e precisão dentro da área definem seu perfil. Você é o homem-gol, responsável por decidir as partidas.',
  },
  volei: {
    'Levantador':  'Precisão e leitura de jogo são seu diferencial. O levantador é o maestro do time, distribuindo as jogadas com inteligência.',
    'Líbero':      'Seus reflexos e agilidade no chão são incomparáveis. Como líbero, você salva bolas que pareciam perdidas e é a segurança defensiva.',
    'Ponteiro':    'Você une força e velocidade de deslocamento. O ponteiro ataca com potência e equilibra defesa e ataque.',
    'Central':     'Força e reflexo no bloqueio são seus atributos. O central intimida no bloqueio e termina jogadas com eficiência.',
    'Oposto':      'Força aliada a precisão fazem de você o finalizador principal. O oposto é o ás de ataque da equipe.',
  },
  basquete: {
    'Armador':     'Visão de jogo e tomada de decisão são seus pilares. O armador conduz o ataque e é o maestro das jogadas coletivas.',
    'Ala-Armador': 'Versátil, você combina velocidade e precisão. O ala-armador é eficaz tanto como criador quanto como finalizador.',
    'Ala':         'Seu equilíbrio entre velocidade e força o torna polivalente. O ala domina a penetração e o arremesso de média distância.',
    'Ala-Pivô':    'Força e resistência o tornam dominante nas disputas de rebote. O ala-pivô conecta interior e exterior do ataque.',
    'Pivô':        'Força e resistência são sua marca registrada. O pivô domina o garrafão, protege a cesta e comanda o jogo interior.',
  },
  handebol: {
    'Goleiro':         'Reflexo e leitura de jogo são suas armas. O goleiro é fundamental para os contra-ataques rápidos e impõe respeito ao adversário.',
    'Armador Central': 'Liderança e visão de jogo fazem de você o comandante do ataque. Você organiza as jogadas e define o ritmo da partida.',
    'Armador Lateral': 'Velocidade e precisão nas finalizações são seu diferencial. O armador lateral cria espaços e arremessa com precisão.',
    'Ponta':           'Você possui a velocidade de um velocista. A ponta explora os corredores laterais e finaliza em ângulos difíceis.',
    'Pivô':            'Força e resistência ao contato físico definem seu jogo. O pivô é o apoio no ataque e incomoda constantemente a defesa.',
  },
};

/* sugestões de treino por posição */
const TREINOS = {
  'Goleiro':          [{ icon:'🏃', nome:'Treino de Reação', desc:'Exercícios com bola surpresa e reflexos rápidos' },{ icon:'🧘', nome:'Posicionamento', desc:'Prática de saídas e ângulos de defesa' },{ icon:'💪', nome:'Força nas Mãos', desc:'Fortalecimento de punhos e antebraços' }],
  'Fixo':             [{ icon:'🔄', nome:'Marcação Pressão', desc:'Trabalhar a marcação individual intensa' },{ icon:'🏋️', nome:'Resistência Aeróbica', desc:'Corridas de longa duração e fartlek' },{ icon:'👑', nome:'Liderança Tática', desc:'Estudo de posicionamento e organização defensiva' }],
  'Ala':              [{ icon:'⚡', nome:'Sprint Curto', desc:'Tiros de 10 a 20 metros com mudança de direção' },{ icon:'🔄', nome:'Drible & Velocidade', desc:'Circuitos com cones para explosão lateral' },{ icon:'🤝', nome:'Combinação Coletiva', desc:'Tabelas e movimentações sem bola' }],
  'Pivô':             [{ icon:'💪', nome:'Força Funcional', desc:'Agachamentos, terra e exercícios de tronco' },{ icon:'🎯', nome:'Finalização Próxima', desc:'Arremates de curta distância sob pressão' },{ icon:'🧠', nome:'Leitura de Defesa', desc:'Exercícios de tomada de decisão no pivô' }],
  'Zagueiro':         [{ icon:'💪', nome:'Duelo Aéreo', desc:'Trabalho de cabeceio e disputa de bola parada' },{ icon:'🛡️', nome:'Cobertura Defensiva', desc:'Posicionamento de linha e interceptações' },{ icon:'🔄', nome:'Saída de Bola', desc:'Passes curtos e lançamentos sob pressão' }],
  'Lateral':          [{ icon:'🏃', nome:'Resistência Lateral', desc:'Corrida de 5 km com variações de ritmo' },{ icon:'⚡', nome:'Aceleração', desc:'Sprints de 30 m com partida parada' },{ icon:'🎯', nome:'Cruzamento', desc:'Finalização de cruzamentos e centros' }],
  'Volante':          [{ icon:'🫁', nome:'Cardio Intenso', desc:'Treino intervalado de alta intensidade (HIIT)' },{ icon:'🤝', nome:'Passe & Recepção', desc:'Exercícios de passe em espaços reduzidos' },{ icon:'🧠', nome:'Leitura de Jogo', desc:'Análise de vídeo e exercícios táticos' }],
  'Meia':             [{ icon:'🎯', nome:'Passe Longo', desc:'Passe em distâncias variadas e precisão' },{ icon:'🔄', nome:'Driblar sob Pressão', desc:'Manter posse de bola em marcação dupla' },{ icon:'🧠', nome:'Visão Periférica', desc:'Exercícios para ampliar a leitura do campo' }],
  'Ponta':            [{ icon:'⚡', nome:'Explosão Lateral', desc:'Sprints com mudança de direção e dribble' },{ icon:'🎯', nome:'Finalização com Pé Fraco', desc:'Chutes com perna não dominante' },{ icon:'🔄', nome:'1x1 Intenso', desc:'Duelos de 1 contra 1 para desenvolver o dribble' }],
  'Centroavante':     [{ icon:'💪', nome:'Proteção de Bola', desc:'Disputa de costas para o gol' },{ icon:'🎯', nome:'Finalização', desc:'Chutes de dentro e fora da área' },{ icon:'🧠', nome:'Movimento sem Bola', desc:'Timing de penetração e escapada de marcação' }],
  'Levantador':       [{ icon:'🎯', nome:'Levantamento de Precisão', desc:'Repetições de levantamentos variados' },{ icon:'🧠', nome:'Leitura do Bloqueio', desc:'Identificar brechas e distribuir com inteligência' },{ icon:'🔄', nome:'Deslocamento Lateral', desc:'Agilidade para chegar a bolas difíceis' }],
  'Líbero':           [{ icon:'🔄', nome:'Manchete & Toque', desc:'Fundamentos defensivos com alta repetição' },{ icon:'👁️', nome:'Leitura de Trajetória', desc:'Antecipar a direção do ataque adversário' },{ icon:'🫁', nome:'Resistência Defensiva', desc:'Treino de queda e rolamento contínuos' }],
  'Ponteiro':         [{ icon:'💪', nome:'Salto Vertical', desc:'Exercícios de pliometria para ganho de altitude' },{ icon:'🎯', nome:'Atacada em Paralela', desc:'Finalizar em diferentes zonas da quadra' },{ icon:'⚡', nome:'Transição Rápida', desc:'Defesa → ataque em velocidade máxima' }],
  'Central':          [{ icon:'💪', nome:'Bloqueio Reativo', desc:'Sincronizar com levantador para blocar' },{ icon:'🏋️', nome:'Ganho de Potência', desc:'Musculação focada em membros inferiores' },{ icon:'🎯', nome:'Ataque no Meio', desc:'Finalizações rápidas no centro da rede' }],
  'Oposto':           [{ icon:'💪', nome:'Potência no Saque', desc:'Desenvolver o saque em salto' },{ icon:'🎯', nome:'Ataque de Bola Alta', desc:'Finalizações potentes em tempo aberto' },{ icon:'🔄', nome:'Defesa de Ponta', desc:'Posição e reflexo nas pontas' }],
  'Armador':          [{ icon:'🧠', nome:'Visão de Jogo', desc:'Exercícios 3x2 e leitura de defesas' },{ icon:'🎯', nome:'Arremesso de 3 Pontos', desc:'Repetições longas com foco em forma' },{ icon:'⚡', nome:'Penetração', desc:'Drives de 1x1 e finalização no garrafão' }],
  'Ala-Armador':      [{ icon:'🎯', nome:'Catch & Shoot', desc:'Arremesso imediato após recepção' },{ icon:'⚡', nome:'Transição Ofensiva', desc:'Corrida em contra-ataque e layup' },{ icon:'🔄', nome:'Defesa Individual', desc:'Guardar armadores e alas com velocidade' }],
  'Ala':              [{ icon:'💪', nome:'Rebote Ofensivo', desc:'Disputa de posição no garrafão' },{ icon:'🎯', nome:'Arremesso de Média', desc:'Jumpshot da linha de 3 segundos' },{ icon:'⚡', nome:'Penetração ao Aro', desc:'Dribble e finalização em velocidade' }],
  'Ala-Pivô':         [{ icon:'💪', nome:'Jogo de Costas', desc:'Post moves e pivotamento' },{ icon:'🔄', nome:'Pick & Roll', desc:'Bloquear e rolar para o aro' },{ icon:'🏋️', nome:'Força de Tronco', desc:'Core e resistência para disputas físicas' }],
  'Armador Central':  [{ icon:'👑', nome:'Condução de Jogo', desc:'Exercícios de leitura defensiva e criação' },{ icon:'🎯', nome:'Arremesso 7 Metros', desc:'Falta máxima com alta eficiência' },{ icon:'🤝', nome:'Passe em Movim.', desc:'Passes de costas e laterais em velocidade' }],
  'Armador Lateral':  [{ icon:'⚡', nome:'Penetração', desc:'Finalizações em apoio e de curta distância' },{ icon:'🎯', nome:'Arremesso Diagonal', desc:'Finalização de ângulo externo' },{ icon:'🔄', nome:'Contra-Ataque', desc:'Transição defensiva para ofensiva rápida' }],
  'Ponta':            [{ icon:'⚡', nome:'Sprint Lateral', desc:'Explosão para receber nos extremos do ataque' },{ icon:'🎯', nome:'Finalização em Queda', desc:'Arremesso após corrida e desequilíbrio' },{ icon:'🔄', nome:'Marcação em Ponta', desc:'Defender o corredor lateral com agilidade' }],
};

/* ──────────────────────────────────────
   3. ESTADO DA APLICAÇÃO
────────────────────────────────────── */
const estado = {
  usuario: { nome: '', idade: '', altura: '', peso: '', esporte: '' },
  respostas: Array(9).fill(5),
  questaoAtual: 0,
  etapa: 'home', // home | quiz | resultado
};

/* ──────────────────────────────────────
   4. UTILITÁRIOS
────────────────────────────────────── */

/**
 * Mostra um toast na tela.
 * @param {string} msg   - mensagem
 * @param {'info'|'success'|'error'} tipo
 */
function showToast(msg, tipo = 'info') {
  const icons = { info: 'ℹ️', success: '✅', error: '❌' };
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  toast.innerHTML = `<span>${icons[tipo]}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

/**
 * Anima um número de 0 até target.
 */
function animateCount(el, target, duration = 1500) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const val = Math.floor(progress * target);
    el.textContent = val;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

/**
 * Calcula a cor do slider com base no valor (1-10).
 */
function sliderColor(val) {
  if (val <= 3) return '#F44336';
  if (val <= 6) return '#FF9800';
  return '#00C853';
}

/** Rola suavemente até um elemento. */
function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ──────────────────────────────────────
   5. LOADING SCREEN
────────────────────────────────────── */
(function initLoading() {
  const screen  = document.getElementById('loading-screen');
  const bar     = document.getElementById('loader-bar');
  const txt     = document.getElementById('loader-text');
  const msgs    = ['Inicializando análise…', 'Carregando modalidades…', 'Preparando avaliação…', 'Pronto!'];
  let pct = 0;
  let msgIdx = 0;

  const interval = setInterval(() => {
    pct += Math.random() * 22 + 8;
    if (pct > 100) pct = 100;
    bar.style.width = pct + '%';
    if (msgIdx < msgs.length - 1 && pct > (msgIdx + 1) * 25) {
      msgIdx++;
      txt.textContent = msgs[msgIdx];
    }
    if (pct >= 100) {
      clearInterval(interval);
      setTimeout(() => screen.classList.add('fade-out'), 400);
    }
  }, 120);
})();

/* ──────────────────────────────────────
   6. HEADER — scroll effect
────────────────────────────────────── */
(function initHeader() {
  const header = document.getElementById('main-header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ──────────────────────────────────────
   7. MENU MOBILE
────────────────────────────────────── */
(function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // fecha ao clicar em link
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ──────────────────────────────────────
   8. ANIMAÇÕES DE ENTRADA (IntersectionObserver)
────────────────────────────────────── */
(function initAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
})();

/* ──────────────────────────────────────
   9. CONTADORES ANIMADOS (hero stats)
────────────────────────────────────── */
(function initCounters() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const target = parseInt(e.target.dataset.target, 10);
          animateCount(e.target, target);
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
})();

/* ──────────────────────────────────────
   10. SLIDER DO QUIZ — atualização visual
────────────────────────────────────── */
function initSliderVisual() {
  const slider = document.getElementById('quiz-slider');
  const display = document.getElementById('slider-value');

  function update() {
    const val = parseInt(slider.value, 10);
    display.textContent = val;
    display.style.color = sliderColor(val);

    // fundo gradiente do track
    const pct = ((val - 1) / 9) * 100;
    slider.style.background = `linear-gradient(to right, ${sliderColor(val)} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
  }

  slider.addEventListener('input', () => {
    update();
    // salva resposta
    estado.respostas[estado.questaoAtual] = parseInt(slider.value, 10);
    atualizarDots();
  });

  update();
}

/* ──────────────────────────────────────
   11. CADASTRO — validação e início do quiz
────────────────────────────────────── */
document.getElementById('btn-iniciar').addEventListener('click', () => {
  const nome    = document.getElementById('inp-nome').value.trim();
  const idade   = document.getElementById('inp-idade').value.trim();
  const altura  = document.getElementById('inp-altura').value.trim();
  const peso    = document.getElementById('inp-peso').value.trim();
  const esporte = document.getElementById('inp-esporte').value;

  // limpa erros
  ['inp-nome','inp-idade','inp-altura','inp-peso'].forEach(id => {
    document.getElementById(id).classList.remove('field-error');
  });

  const erros = [];
  if (!nome)    { document.getElementById('inp-nome').classList.add('field-error');    erros.push('nome'); }
  if (!idade)   { document.getElementById('inp-idade').classList.add('field-error');   erros.push('idade'); }
  if (!altura)  { document.getElementById('inp-altura').classList.add('field-error');  erros.push('altura'); }
  if (!peso)    { document.getElementById('inp-peso').classList.add('field-error');    erros.push('peso'); }
  if (!esporte) { showToast('Selecione uma modalidade esportiva.', 'error'); return; }

  if (erros.length) {
    showToast(`Preencha os campos obrigatórios: ${erros.join(', ')}.`, 'error');
    return;
  }

  // salva dados
  estado.usuario = { nome, idade, altura, peso, esporte };
  estado.respostas = Array(9).fill(5);
  estado.questaoAtual = 0;

  showToast(`Olá, ${nome}! Vamos começar sua avaliação.`, 'success');
  irParaQuiz();
});

/* ──────────────────────────────────────
   12. QUIZ — renderização e navegação
────────────────────────────────────── */
const ESPORTE_LABEL = {
  futsal:'⚽ Futsal', futebol:'🏟️ Futebol de Campo',
  volei:'🏐 Vôlei', basquete:'🏀 Basquete', handebol:'🤾 Handebol'
};

function irParaQuiz() {
  // esconde seções de landing, mostra quiz
  document.querySelectorAll('.section:not(#questionario):not(#resultado)').forEach(s => s.classList.add('hidden'));
  document.getElementById('resultado').classList.add('hidden');
  document.getElementById('questionario').classList.remove('hidden');
  document.getElementById('quiz-sport-label').textContent = ESPORTE_LABEL[estado.usuario.esporte];
  renderizarQuestao();
  criarDots();
  scrollTo('#questionario');
}

function renderizarQuestao() {
  const q = HABILIDADES[estado.questaoAtual];
  const total = HABILIDADES.length;

  // progresso
  const pct = Math.round((estado.questaoAtual / total) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-label').textContent = `Habilidade ${estado.questaoAtual + 1} de ${total}`;
  document.getElementById('progress-pct').textContent   = pct + '%';
  document.getElementById('progress-bar-wrap').setAttribute('aria-valuenow', estado.questaoAtual);

  // conteúdo
  document.getElementById('quiz-q-icon').textContent    = q.icon;
  document.getElementById('quiz-question').textContent  = q.nome;
  document.getElementById('quiz-hint').textContent      = q.hint;

  // slider
  const slider = document.getElementById('quiz-slider');
  slider.value = estado.respostas[estado.questaoAtual];
  initSliderVisual();

  // botões
  document.getElementById('btn-prev').style.visibility = estado.questaoAtual === 0 ? 'hidden' : 'visible';
  const isLast = estado.questaoAtual === total - 1;
  document.getElementById('btn-next-text').textContent = isLast ? 'Ver Resultado' : 'Próximo';

  atualizarDots();

  // animação no card
  const card = document.getElementById('quiz-card');
  card.style.animation = 'none';
  card.offsetHeight; // reflow
  card.style.animation = 'section-enter .35s ease both';
}

function criarDots() {
  const container = document.getElementById('quiz-dots');
  container.innerHTML = '';
  HABILIDADES.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'quiz-dot';
    dot.setAttribute('role', 'listitem');
    dot.setAttribute('aria-label', `Habilidade ${i + 1}`);
    container.appendChild(dot);
  });
}

function atualizarDots() {
  const dots = document.querySelectorAll('.quiz-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === estado.questaoAtual);
    dot.classList.toggle('answered', i < estado.questaoAtual);
  });
}

// botão próximo
document.getElementById('btn-next').addEventListener('click', () => {
  // salva valor atual
  estado.respostas[estado.questaoAtual] = parseInt(document.getElementById('quiz-slider').value, 10);

  if (estado.questaoAtual < HABILIDADES.length - 1) {
    estado.questaoAtual++;
    renderizarQuestao();
  } else {
    // última questão → calcular e mostrar resultado
    calcularEMostrarResultado();
  }
});

// botão anterior
document.getElementById('btn-prev').addEventListener('click', () => {
  if (estado.questaoAtual > 0) {
    estado.questaoAtual--;
    renderizarQuestao();
  }
});

/* ──────────────────────────────────────
   13. ALGORITMO DE PONTUAÇÃO
────────────────────────────────────── */
/**
 * Calcula o score de compatibilidade de cada posição para o esporte escolhido.
 * Score = soma de (nota_habilidade * peso_posição) para cada habilidade com peso definido.
 * @returns {{ posicao, score, pct }[]} - ordenado do maior para o menor
 */
function calcularScores() {
  const esporte  = estado.usuario.esporte;
  const posicoes = POSICOES[esporte];
  const resp     = estado.respostas;

  // monta um objeto { habilidadeId: valor }
  const notas = {};
  HABILIDADES.forEach((h, i) => { notas[h.id] = resp[i]; });

  const resultados = posicoes.map(pos => {
    let score = 0;
    let totalPesos = 0;

    Object.entries(pos.pesos).forEach(([hId, peso]) => {
      score      += (notas[hId] || 0) * peso;
      totalPesos += peso * 10; // nota máxima é 10
    });

    const pct = Math.round((score / totalPesos) * 100);
    return { posicao: pos.nome, score, pct };
  });

  return resultados.sort((a, b) => b.score - a.score);
}

/* ──────────────────────────────────────
   14. EXIBIR RESULTADO
────────────────────────────────────── */
function calcularEMostrarResultado() {
  const scores   = calcularScores();
  const melhor   = scores[0];
  const esporte  = estado.usuario.esporte;
  const usuario  = estado.usuario;

  // — Posição e esporte
  document.getElementById('result-title').textContent       = melhor.posicao;
  document.getElementById('result-sport-label').textContent = `${ESPORTE_LABEL[esporte]} • ${usuario.nome}, ${usuario.idade} anos`;

  // — Animar anel de compatibilidade
  const arc    = document.getElementById('compat-arc');
  const pctEl  = document.getElementById('compat-pct');
  const circum = 2 * Math.PI * 50; // r=50

  arc.style.stroke = melhor.pct >= 80 ? '#00C853' : melhor.pct >= 60 ? '#FF9800' : '#F44336';
  let current = 0;
  const target = melhor.pct;
  const step = () => {
    if (current < target) {
      current = Math.min(current + 1.5, target);
      const offset = circum - (circum * current / 100);
      arc.style.strokeDashoffset = offset;
      pctEl.textContent = Math.round(current) + '%';
      requestAnimationFrame(step);
    }
  };
  setTimeout(step, 400);

  // — Barras de desempenho (todas as posições)
  const perfContainer = document.getElementById('perf-bars');
  perfContainer.innerHTML = '';
  scores.forEach(s => {
    const item = document.createElement('div');
    item.className = 'perf-bar-item';
    item.innerHTML = `
      <div class="perf-bar-label">
        <span>${s.posicao}</span>
        <span>${s.pct}%</span>
      </div>
      <div class="perf-bar-track">
        <div class="perf-bar-fill" data-pct="${s.pct}"></div>
      </div>`;
    perfContainer.appendChild(item);
  });
  // anima as barras com delay
  setTimeout(() => {
    document.querySelectorAll('.perf-bar-fill').forEach((bar, i) => {
      setTimeout(() => { bar.style.width = bar.dataset.pct + '%'; }, i * 80);
    });
  }, 300);

  // — Pontos fortes e fracos
  const notasOrdenadas = HABILIDADES.map((h, i) => ({ nome: h.nome, val: estado.respostas[i] }))
                                     .sort((a, b) => b.val - a.val);
  const fortes  = notasOrdenadas.slice(0, 3);
  const fracos  = notasOrdenadas.slice(-3).reverse();

  const listaForte = document.getElementById('result-strong-list');
  const listaFraca = document.getElementById('result-weak-list');
  listaForte.innerHTML = fortes.map(h => `<li>${h.nome} <strong style="margin-left:auto;color:var(--green)">${h.val}/10</strong></li>`).join('');
  listaFraca.innerHTML = fracos.map(h => `<li>${h.nome} <strong style="margin-left:auto;color:var(--orange)">${h.val}/10</strong></li>`).join('');

  // — Perfil esportivo
  const perfTextos = PERFIS_TEXTO[esporte] || {};
  const perfTexto  = perfTextos[melhor.posicao] || `${usuario.nome}, seu perfil esportivo é muito especial. Continue se dedicando e desenvolvendo suas habilidades!`;
  document.getElementById('result-profile-text').textContent = perfTexto;

  // — Sugestões de treino
  const treinos = TREINOS[melhor.posicao] || [
    { icon:'🏃', nome:'Treino Físico Geral', desc:'Cardio, força e flexibilidade' },
    { icon:'🎯', nome:'Técnica Específica', desc:'Fundamentos da sua posição' },
    { icon:'🧠', nome:'Estudo Tático', desc:'Análise de vídeo e posicionamento' },
  ];
  const tGrid = document.getElementById('training-grid');
  tGrid.innerHTML = treinos.map(t => `
    <div class="training-card">
      <div class="tc-icon">${t.icon}</div>
      <h4>${t.nome}</h4>
      <p>${t.desc}</p>
    </div>`).join('');

  // — Exibe seção resultado
  document.getElementById('questionario').classList.add('hidden');
  document.getElementById('resultado').classList.remove('hidden');
  scrollTo('#resultado');

  showToast(`Análise concluída! Sua posição ideal é ${melhor.posicao}.`, 'success');

  // trigger animações de entrada
  setTimeout(() => {
    document.querySelectorAll('#resultado [data-animate]').forEach(el => el.classList.add('visible'));
  }, 100);
}

/* ──────────────────────────────────────
   15. BOTÕES DE RESULTADO
────────────────────────────────────── */

// Refazer avaliação — mantém dados do usuário, volta ao quiz
document.getElementById('btn-refazer').addEventListener('click', () => {
  estado.respostas   = Array(9).fill(5);
  estado.questaoAtual = 0;
  document.getElementById('resultado').classList.add('hidden');
  document.getElementById('questionario').classList.remove('hidden');
  renderizarQuestao();
  criarDots();
  scrollTo('#questionario');
  showToast('Avaliação reiniciada. Boa sorte!', 'info');
});

// Voltar ao início — reseta tudo
document.getElementById('btn-inicio').addEventListener('click', () => {
  resetarApp();
  scrollTo('#hero');
});

function resetarApp() {
  // mostra seções do landing
  document.querySelectorAll('.section:not(#questionario):not(#resultado)').forEach(s => s.classList.remove('hidden'));
  document.getElementById('questionario').classList.add('hidden');
  document.getElementById('resultado').classList.add('hidden');

  // limpa formulário
  document.getElementById('inp-nome').value    = '';
  document.getElementById('inp-idade').value   = '';
  document.getElementById('inp-altura').value  = '';
  document.getElementById('inp-peso').value    = '';
  document.getElementById('inp-esporte').value = '';

  // reseta estado
  estado.usuario     = { nome:'', idade:'', altura:'', peso:'', esporte:'' };
  estado.respostas   = Array(9).fill(5);
  estado.questaoAtual = 0;
}

/* ──────────────────────────────────────
   16. LINKS DO HERO / CTA → scroll
────────────────────────────────────── */
(function initScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ──────────────────────────────────────
   17. MODAL / CARDS de modalidade
       Clicar em uma modalidade preenche o select
────────────────────────────────────── */
(function initModCards() {
  const mapEsporte = {
    'Futsal':'futsal', 'Futebol de Campo':'futebol',
    'Vôlei':'volei', 'Basquete':'basquete', 'Handebol':'handebol'
  };

  document.querySelectorAll('.mod-card').forEach(card => {
    card.addEventListener('click', () => {
      const nome = card.querySelector('h3').textContent.trim();
      const val  = mapEsporte[nome];
      if (val) {
        document.getElementById('inp-esporte').value = val;
        scrollTo('#cadastro');
        showToast(`${nome} selecionado! Complete seu cadastro.`, 'info');
      }
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });
})();

/* ──────────────────────────────────────
   18. OBSERVER PARA RESULTADO (re-animar
       barras ao exibir seção)
────────────────────────────────────── */
(function initResultObserver() {
  const resultSection = document.getElementById('resultado');
  const observer = new MutationObserver(() => {
    if (!resultSection.classList.contains('hidden')) {
      // já tratado em calcularEMostrarResultado
    }
  });
  observer.observe(resultSection, { attributes: true, attributeFilter: ['class'] });
})();

/* ──────────────────────────────────────
   FIM · SportMatch script.js
────────────────────────────────────── */