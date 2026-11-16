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

let activeCaseFilter = 'all';
let modalCaseIndex = 0;
let modalImageIndex = 0;

function show(id){
  closeCaseModal();
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

document.addEventListener('click', (e) => {
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

  const go = e.target.closest('[data-go]')?.dataset.go;
  if (go) show(go);
  if (e.target.closest('[data-back]')) show('home');
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

if (tg) {
  tg.ready();
  tg.expand();
}
