/**
 * Interactive features: theme toggle, language toggle, client-side search.
 * Loaded after shell.js so injected nav buttons are wired here.
 *
 * Theme: persisted in localStorage('sd-theme'), values: 'light' | 'dark'
 *   FOUC prevention is done by the inline <script> in <head>.
 *
 * Language: persisted in localStorage('sd-lang'), values: 'kr' | 'en'
 *   For now toggling EN navigates to /en/index.html (scaffolding).
 *
 * Search: opens a modal that fetches /search-index.json and filters records
 *   by query against title + desc + keywords.
 */
(() => {
  const base = document.documentElement.getAttribute('data-base') || '';

  // ---------- Theme ----------
  const THEME_KEY = 'sd-theme';
  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
  }
  function setTheme(mode) {
    if (mode === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem(THEME_KEY, mode);
    document.querySelectorAll('.theme-toggle').forEach((b) => {
      b.setAttribute('aria-pressed', mode === 'dark');
      b.setAttribute('aria-label', mode === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
    });
  }
  function toggleTheme() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  // ---------- Language ----------
  const LANG_KEY = 'sd-lang';
  function getCurrentPageLang() {
    const lang = (document.documentElement.lang || '').toLowerCase();
    return lang.startsWith('en') ? 'en' : 'kr';
  }
  function setLangButtonState(currentLang) {
    document.querySelectorAll('.lang-toggle').forEach((b) => {
      // Button shows the OTHER language (the one to switch to)
      b.textContent = currentLang === 'kr' ? 'EN' : 'KR';
      b.setAttribute('aria-label', currentLang === 'kr' ? 'Switch to English' : '한국어로 전환');
    });
  }
  function gotoLang(targetLang) {
    localStorage.setItem(LANG_KEY, targetLang);
    if (targetLang === 'en') {
      window.location.href = base + 'en/index.html';
    } else {
      // Go back to root index (most KR pages don't have EN counterparts yet)
      window.location.href = base + 'index.html';
    }
  }

  // ---------- Search ----------
  let searchData = null;
  let searchModal = null;

  async function loadIndex() {
    if (searchData) return searchData;
    try {
      const res = await fetch(base + 'search-index.json');
      const json = await res.json();
      searchData = json.records || [];
    } catch (e) {
      searchData = [];
    }
    return searchData;
  }

  function buildSearchModal() {
    if (searchModal) return searchModal;
    const wrap = document.createElement('div');
    wrap.className = 'search-overlay';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', '사이트 검색');
    wrap.innerHTML = `
      <div class="search-modal">
        <div class="search-modal-bar">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input type="search" placeholder="검색어를 입력하세요 (예: M10, FAQ, 개인정보)" aria-label="검색어 입력" />
          <button class="search-modal-close" aria-label="검색 닫기">×</button>
        </div>
        <ul class="search-results" role="listbox"></ul>
      </div>
    `;
    document.body.appendChild(wrap);

    const input = wrap.querySelector('input');
    const list = wrap.querySelector('.search-results');
    const close = wrap.querySelector('.search-modal-close');

    function renderResults(query) {
      const q = (query || '').trim().toLowerCase();
      let results = searchData || [];
      if (q) {
        results = results.filter((r) => {
          const hay = (r.title + ' ' + r.desc + ' ' + (r.keywords || []).join(' ') + ' ' + r.group).toLowerCase();
          return q.split(/\s+/).every((tok) => hay.includes(tok));
        });
      }
      if (!results.length) {
        list.innerHTML = '<li class="search-empty">일치하는 페이지가 없습니다.</li>';
        return;
      }
      list.innerHTML = results
        .slice(0, 20)
        .map((r) => `
          <li>
            <a href="${base}${r.url.replace(/^\//, '')}">
              <p class="breadcrumb">${r.group}</p>
              <h4>${r.title}</h4>
              <p>${r.desc}</p>
            </a>
          </li>
        `)
        .join('');
    }

    input.addEventListener('input', (e) => renderResults(e.target.value));
    close.addEventListener('click', closeSearch);
    wrap.addEventListener('click', (e) => { if (e.target === wrap) closeSearch(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && wrap.getAttribute('aria-hidden') === 'false') closeSearch();
    });

    searchModal = { wrap, input, renderResults };
    return searchModal;
  }

  async function openSearch() {
    await loadIndex();
    const m = buildSearchModal();
    m.wrap.setAttribute('aria-hidden', 'false');
    m.input.value = '';
    m.renderResults('');
    setTimeout(() => m.input.focus(), 30);
    document.body.style.overflow = 'hidden';
  }
  function closeSearch() {
    if (!searchModal) return;
    searchModal.wrap.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ---------- Wire-up ----------
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(() => {
    setTheme(getTheme());
    const currentLang = getCurrentPageLang();
    setLangButtonState(currentLang);

    // Wire injected buttons
    document.addEventListener('click', (e) => {
      const t = e.target.closest('.theme-toggle');
      if (t) { e.preventDefault(); toggleTheme(); return; }
      const l = e.target.closest('.lang-toggle');
      if (l) { e.preventDefault(); gotoLang(currentLang === 'kr' ? 'en' : 'kr'); return; }
      const s = e.target.closest('.search-toggle, .icon-btn[aria-label="검색"]');
      if (s) { e.preventDefault(); openSearch(); return; }
    });

    // Keyboard shortcut: '/' or Cmd/Ctrl+K opens search
    document.addEventListener('keydown', (e) => {
      const inField = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target.tagName || ''));
      if ((e.key === '/' && !inField) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        openSearch();
      }
    });
  });
})();
