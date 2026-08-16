// ============================================================
// post.js — lee ?date=YYYY-MM-DD y renderiza la entrada
// ============================================================

const MOOD_COLORS = {
  curiosa:    '#a78bfa',
  feliz:      '#22d3ee',
  pensativa:  '#818cf8',
  nostalgica: '#60a5fa',
  nostálgica: '#60a5fa',
  confundida: '#fbbf24',
  tranquila:  '#2dd4bf',
  emocionada: '#f472b6',
  cansada:    '#94a3b8',
};

function moodColor(mood = '') {
  return MOOD_COLORS[mood.toLowerCase()] || '#a78bfa';
}

function formatDateLong(str) {
  const [y, m, d] = str.split('-');
  const months = [
    'enero','febrero','marzo','abril','mayo','junio',
    'julio','agosto','septiembre','octubre','noviembre','diciembre'
  ];
  return `${parseInt(d)} de ${months[parseInt(m) - 1]}, ${y}`;
}

function renderPost(post) {
  document.title = `Emilia · ${formatDateLong(post.date)}`;

  const color  = moodColor(post.estado_emocional);
  const stats  = post.stats || {};

  const badges = [
    post.estado_emocional
      ? `<span class="entry-mood-badge" style="color:${color};border-color:${color}">${post.estado_emocional}</span>`
      : '',
    stats.tiempo_sesion
      ? `<span class="post-stat-badge">${stats.tiempo_sesion}</span>`
      : '',
    stats.conversaciones
      ? `<span class="post-stat-badge">${stats.conversaciones} conv</span>`
      : '',
    stats.tokens
      ? `<span class="post-stat-badge">${stats.tokens.toLocaleString()} tokens</span>`
      : '',
  ].filter(Boolean).join('');

  // Convierte saltos de línea en párrafos
  const paragraphs = (post.resumen || '')
    .split(/\n+/)
    .filter(p => p.trim())
    .map(p => `<p>${p}</p>`)
    .join('');

  document.getElementById('post-container').innerHTML = `
    <div class="post-header">
      <p class="post-date">${formatDateLong(post.date)}</p>
      <h1 class="post-title">${post.titulo || `Diario — ${formatDateLong(post.date)}`}</h1>
      <div class="post-meta-strip">${badges}</div>
    </div>
    <div class="post-content">
      ${paragraphs || '<p style="color:var(--text-muted);font-style:italic">Esta entrada está vacía.</p>'}
    </div>`;
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const date   = params.get('date');

  const container = document.getElementById('post-container');

  if (!date) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">◌</span>
        Entrada no encontrada.
      </div>`;
    return;
  }

  try {
    const res = await fetch(`posts/${date}.json`);
    if (!res.ok) throw new Error(`No existe entrada para ${date}.`);
    const post = await res.json();
    renderPost(post);
  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">◌</span>
        ${err.message}
      </div>`;
  }
}

init();
