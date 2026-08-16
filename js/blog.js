// ============================================================
// blog.js — carga posts/index.json y renderiza la lista
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

function formatDate(str) {
  const [y, m, d] = str.split('-');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function renderStats(posts) {
  const moods = new Set(posts.map(p => p.mood)).size;
  const last  = posts.length ? formatDate(posts[0].date) : '—';
  document.getElementById('blog-stats').innerHTML = `
    <div class="stat-item">
      <span class="stat-value">${posts.length}</span>
      <span class="stat-label">entradas</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${moods}</span>
      <span class="stat-label">estados</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${last}</span>
      <span class="stat-label">última entrada</span>
    </div>
  `;
}

function renderEntries(posts) {
  const list = document.getElementById('entries-list');

  if (!posts.length) {
    list.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">◌</span>
        Emilia aún no ha escrito nada.
      </div>`;
    return;
  }

  list.innerHTML = posts.map(post => {
    const color = moodColor(post.mood);
    const stats = post.stats || {};
    const statParts = [
      stats.tiempo_sesion,
      stats.conversaciones ? `${stats.conversaciones} conv` : null,
    ].filter(Boolean);

    return `
      <a href="post.html?date=${post.date}" class="entry-card">
        <div class="entry-card-top">
          <span class="entry-date">${formatDate(post.date)}</span>
          <span class="entry-mood-badge" style="color:${color};border-color:${color}">
            ${post.mood}
          </span>
        </div>
        <p class="entry-excerpt">${post.excerpt || ''}</p>
        <div class="entry-footer">
          ${statParts.map(s => `<span class="entry-stat">${s}</span>`).join('')}
          <span class="entry-read-more">leer →</span>
        </div>
      </a>`;
  }).join('');
}

async function init() {
  try {
    const res = await fetch('posts/index.json');
    if (!res.ok) throw new Error('No se pudo cargar el índice de posts.');
    const posts = await res.json();
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    renderStats(posts);
    renderEntries(posts);
  } catch (err) {
    document.getElementById('blog-stats').innerHTML = '';
    document.getElementById('entries-list').innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">◌</span>
        ${err.message}
      </div>`;
  }
}

init();
