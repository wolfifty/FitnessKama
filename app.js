const tg = window.Telegram?.WebApp;

const CASE_TAGS = [
  { id: 'all', label: 'Все' },
  { id: 'before-after', label: 'До/после' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'postpartum', label: 'После родов' },
  { id: 'weight', label: 'Минус вес' },
  { id: 'posture', label: 'Осанка/боли' },
  { id: 'energy', label: 'Энергия' }
];

const CASES = [
  { title: 'Восстановление после родов', tags: ['postpartum', 'reviews'], images: ['case-01-cover-postpartum.webp'] },
  { title: 'Отзыв о занятиях в студии', tags: ['reviews'], images: ['case-02-review-long-studio.webp'] },
  { title: 'История из сообщений', tags: ['reviews'], images: ['case-03-review-story-16.webp'] },
  { title: 'После первой тренировки', tags: ['reviews', 'energy'], images: ['case-04-review-first-training.webp'] },
  { title: 'Отзыв на английском', tags: ['reviews'], images: ['case-05-review-english.webp'] },
  { title: 'До/после: спина и осанка', tags: ['before-after', 'posture'], images: ['case-06-before-after-back.webp'] },
  { title: 'Отзыв из Telegram', tags: ['reviews'], images: ['case-07-review-telegram-blue.webp'] },
  { title: 'Энергия и самочувствие', tags: ['reviews', 'energy'], images: ['case-08-review-energy.webp'] },
  { title: 'До/после: силуэт', tags: ['before-after', 'weight'], images: ['case-09-before-after-front.webp'] },
  { title: 'Ангелина: одно большое сообщение', tags: ['reviews'], images: ['case-11-angelina-part-1.webp', 'case-10-angelina-part-2.webp'] },
  { title: 'После второй тренировки', tags: ['reviews', 'energy'], images: ['case-12-review-second-training.webp'] },
  { title: 'Отзыв с фото', tags: ['reviews', 'posture'], images: ['case-13-review-photo-lake.webp'] },
  { title: 'Короткий отзыв', tags: ['reviews'], images: ['case-14-review-white-card.webp'] },
  { title: 'Длинный отзыв из Telegram', tags: ['reviews', 'weight'], images: ['case-15-review-telegram-long.webp'] },
  { title: 'До/после: осанка', tags: ['before-after', 'posture'], images: ['case-16-before-after-crown.webp'] },
  { title: 'Подборка отзывов', tags: ['reviews'], images: ['case-17-reviews-collage.webp'] },
  { title: 'Отзыв из VK', tags: ['reviews'], images: ['case-18-review-vk.webp'] },
  { title: 'Юлия: до и после', tags: ['before-after', 'weight'], images: ['case-22-yulia-before.webp', 'case-19-yulia-after.webp'] },
  { title: 'Минус 10 кг', tags: ['weight', 'before-after'], images: ['case-20-minus-10.webp'] },
  { title: 'Отзыв после занятия', tags: ['reviews'], images: ['case-21-review-airdrop.webp'] },
  { title: 'Анастасия: после родов', tags: ['postpartum', 'reviews'], images: ['case-23-anastasia-postpartum.webp'] }
];

const MINI_IMAGES = {
  'IMG_1621.jpeg': 'https://www.notion.so/image/attachment%3Aed7c1e15-ae04-4aa5-b62e-3d27755f6d3d%3AIMG_1621.jpeg?table=block&id=3c30fab9-991e-80cd-af47-eecc30a61862&spaceId=086d1b99-8c2b-452d-854f-769c39194a8a&width=800&cache=v2',
  'IMG_1620.jpeg': 'https://www.notion.so/image/attachment%3A99d322a3-621d-41e6-92c3-be73a46d08d8%3AIMG_1620.jpeg?table=block&id=3c30fab9-991e-800d-a983-d1b4d735d99f&spaceId=086d1b99-8c2b-452d-854f-769c39194a8a&width=1200&cache=v2',
  'IMG_1617.jpeg': 'https://www.notion.so/image/attachment%3Aef2606ae-9577-4268-a115-65d4dc0c6ed0%3AIMG_1617.jpeg?table=block&id=3c30fab9-991e-80e0-89ac-dbbd4c70b9bf&spaceId=086d1b99-8c2b-452d-854f-769c39194a8a&width=1200&cache=v2'
};

const HEART = '<span class="heart">♥︎</span>';

let activeCaseFilter = 'all';
let modalCaseIndex = 0;
let modalImageIndex = 0;

function show(id){
  closeCaseModal();
  document.querySelectorAll('.lesson-video').forEach(video => video.pause());
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  window.scrollTo(0, 0);
}

function escapeHtml(value){
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

function fmt(value){
  return escapeHtml(value)
    .replaceAll('🩷', HEART)
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
}

function caseSrc(name){
  return window.CASE_IMAGE_SRC?.[name] || `./assets/cases/${name}`;
}

function tagLabel(id){
  return CASE_TAGS.find(tag => tag.id === id)?.label || id;
}

function filteredCases(){
  if (activeCaseFilter === 'all') return CASES;
  return CASES.filter(item => item.tags.includes(activeCaseFilter));
}

function renderCaseFilters(){
  const holder = document.getElementById('caseFilters');
  if (!holder) return;

  holder.innerHTML = CASE_TAGS.map((tag) => {
    const count = tag.id === 'all'
      ? CASES.length
      : CASES.filter(item => item.tags.includes(tag.id)).length;

    return `
      <button class="case-chip ${tag.id === activeCaseFilter ? 'is-active' : ''}" type="button" data-case-filter="${tag.id}">
        ${escapeHtml(tag.label)}<span>${count}</span>
      </button>
    `;
  }).join('');
}

function renderCases(){
  const grid = document.getElementById('casesGrid');
  if (!grid) return;

  const items = filteredCases();
  if (!items.length) {
    grid.innerHTML = '<p class="cases-empty">В этой группе пока пусто.</p>';
    return;
  }

  grid.innerHTML = items.map((item) => {
    const caseIndex = CASES.indexOf(item);
    const cover = caseSrc(item.images[0]);
    const badges = item.tags.map(tag => `<span class="case-badge">${escapeHtml(tagLabel(tag))}</span>`).join('');
    const count = item.images.length > 1 ? `<span class="case-count">${item.images.length} фото</span>` : '';

    return `
      <article class="case-card" data-case-open="${caseIndex}" tabindex="0" role="button" aria-label="Открыть кейс: ${escapeHtml(item.title)}">
        <div class="case-card__media">
          <img src="${cover}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">
          ${count}
        </div>
        <div class="case-card__body">
          <h3 class="case-card__title">${escapeHtml(item.title)}</h3>
          <div class="case-card__tags">${badges}</div>
        </div>
      </article>
    `;
  }).join('');
}

function renderCaseModal(){
  const modal = document.getElementById('caseModal');
  const img = document.getElementById('caseModalImg');
  const title = document.getElementById('caseModalTitle');
  const counter = document.getElementById('caseModalCounter');
  const tags = document.getElementById('caseModalTags');
  const prev = document.querySelector('[data-case-prev]');
  const next = document.querySelector('[data-case-next]');
  if (!modal || !img || !title || !counter || !tags) return;

  const item = CASES[modalCaseIndex];
  if (!item) return;

  modalImageIndex = Math.max(0, Math.min(modalImageIndex, item.images.length - 1));
  img.src = caseSrc(item.images[modalImageIndex]);
  img.alt = item.title;
  title.textContent = item.title;
  counter.textContent = item.images.length > 1
    ? `Фото ${modalImageIndex + 1} из ${item.images.length}`
    : '1 фото';
  tags.innerHTML = item.tags.map(tag => `<span class="case-badge">${escapeHtml(tagLabel(tag))}</span>`).join('');

  const many = item.images.length > 1;
  if (prev) prev.hidden = !many;
  if (next) next.hidden = !many;
}

function openCaseModal(caseIndex, imageIndex = 0){
  const modal = document.getElementById('caseModal');
  if (!modal || !CASES[caseIndex]) return;

  modalCaseIndex = caseIndex;
  modalImageIndex = imageIndex;
  renderCaseModal();
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}

function closeCaseModal(){
  const modal = document.getElementById('caseModal');
  if (!modal || !modal.classList.contains('is-open')) return;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

function stepCaseModal(direction){
  const item = CASES[modalCaseIndex];
  if (!item || item.images.length < 2) return;

  modalImageIndex = (modalImageIndex + direction + item.images.length) % item.images.length;
  renderCaseModal();
}

async function renderMiniProduct(){
  const holder = document.getElementById('miniArticle');
  if (!holder) return;

  try {
    const response = await fetch('./mini-product.txt', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    holder.innerHTML = miniTextToHtml(text);
  } catch (error) {
    holder.innerHTML = '<h2>FITNESS KAMA 🫦🤍</h2><p class="muted">Не удалось загрузить программу.</p>';
  }
}

function miniTextToHtml(text){
  const lines = String(text).split(/\r?\n/);
  const tariffIndex = lines.findIndex(line => /ТАРИФ/i.test(line));
  const bodyLines = tariffIndex >= 0 ? lines.slice(0, tariffIndex) : lines;
  const tariffLines = tariffIndex >= 0 ? lines.slice(tariffIndex) : [];

  let html = '<h2>FITNESS KAMA 🫦🤍</h2>';
  let listOpen = false;
  const closeList = () => {
    if (listOpen) {
      html += '</ul>';
      listOpen = false;
    }
  };

  for (const rawLine of bodyLines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/\.(jpe?g|png|webp)$/i.test(line)) {
      closeList();
      const src = MINI_IMAGES[line];
      if (src) html += `<img class="mini-image" src="${src}" alt="" loading="lazy" decoding="async">`;
      continue;
    }

    if (line.startsWith('- ')) {
      if (!listOpen) {
        html += '<ul>';
        listOpen = true;
      }
      html += `<li>${fmt(line.slice(2))}</li>`;
      continue;
    }

    closeList();

    if (line.startsWith('> ')) {
      html += `<blockquote>${fmt(line.slice(2))}</blockquote>`;
    } else if (/^\d\s*ЗАНЯТИЕ/i.test(line) || /^(ПРОГРАММА|БОНУСЫ)/.test(line)) {
      html += `<h3>${fmt(line)}</h3>`;
    } else if (/^(Стоимость|Свободно|Рекомендую|Все занятия|❗️)/.test(line)) {
      html += `<p class="mini-note">${fmt(line)}</p>`;
    } else {
      html += `<p>${fmt(line)}</p>`;
    }
  }

  closeList();
  if (tariffLines.length) html += renderTariff(tariffLines);
  return html;
}

function renderTariff(lines){
  let html = '<section class="tariff-card">';
  let listOpen = false;
  let titleDone = false;
  const closeList = () => {
    if (listOpen) {
      html += '</ul>';
      listOpen = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('- ')) {
      if (!listOpen) {
        html += '<ul class="tariff-list">';
        listOpen = true;
      }
      html += `<li>${fmt(line.slice(2))}</li>`;
      continue;
    }

    closeList();

    if (!titleDone) {
      html += `<h3 class="tariff-card__title">${fmt(line)}</h3>`;
      titleDone = true;
    } else if (/^Свободно/i.test(line)) {
      html += `<p class="tariff-seats"><span class="tariff-seats__dot" aria-hidden="true"></span>${fmt(line)}</p>`;
    } else if (/^Рекомендую/i.test(line)) {
      html += `<p class="tariff-note">${fmt(line)}</p>`;
    } else {
      html += `<p class="tariff-text">${fmt(line)}</p>`;
    }
  }

  closeList();
  html += '</section>';
  return html;
}

function initLessonVideos(){
  document.querySelectorAll('.lesson-video').forEach((video) => {
    video.addEventListener('error', () => {
      video.closest('.lesson-card')?.classList.add('is-empty');
    });
  });
}

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-pay]')) {
    e.preventDefault();
    show('materials');
    return;
  }

  const filter = e.target.closest('[data-case-filter]');
  if (filter) {
    activeCaseFilter = filter.dataset.caseFilter;
    renderCaseFilters();
    renderCases();
    return;
  }

  const card = e.target.closest('[data-case-open]');
  if (card) {
    openCaseModal(Number(card.dataset.caseOpen));
    return;
  }

  if (e.target.closest('[data-case-close]')) {
    closeCaseModal();
    return;
  }

  if (e.target.closest('[data-case-prev]')) {
    stepCaseModal(-1);
    return;
  }

  if (e.target.closest('[data-case-next]')) {
    stepCaseModal(1);
    return;
  }

  const back = e.target.closest('[data-back]');
  if (back) {
    show(back.dataset.back || 'home');
    return;
  }

  const go = e.target.closest('[data-go]')?.dataset.go;
  if (go) show(go);
});

document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('caseModal');
  const isModalOpen = modal?.classList.contains('is-open');

  if (isModalOpen && e.key === 'Escape') {
    closeCaseModal();
    return;
  }
  if (isModalOpen && e.key === 'ArrowLeft') {
    stepCaseModal(-1);
    return;
  }
  if (isModalOpen && e.key === 'ArrowRight') {
    stepCaseModal(1);
    return;
  }

  const card = e.target.closest?.('[data-case-open]');
  if (card && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    openCaseModal(Number(card.dataset.caseOpen));
  }
});

renderCaseFilters();
renderCases();
renderMiniProduct();
initLessonVideos();

if (tg) {
  tg.ready();
  tg.expand();
}
