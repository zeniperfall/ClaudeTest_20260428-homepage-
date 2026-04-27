/**
 * Shared nav + footer injection for sub-pages.
 * Sub-pages declare:
 *   <header data-shell="nav"></header>
 *   <footer data-shell="foot"></footer>
 * and include this script. The script also wires smooth-scroll for in-page anchors.
 *
 * Use data-base attribute on <html> to point to the site root from any depth, e.g.
 *   <html data-base="../">    (for /product/m10.html)
 *   <html data-base="">       (for /support.html)
 */
(function () {
  const base = document.documentElement.getAttribute('data-base') || '';

  const navHtml = `
    <div class="nav-inner">
      <a href="${base}index.html" class="nav-logo" aria-label="SD BIOSENSOR">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M12 2 L22 12 L12 22 L2 12 Z M12 7 L17 12 L12 17 L7 12 Z"/>
        </svg>
        <span>SD BIOSENSOR</span>
      </a>
      <nav class="nav-menu" aria-label="주 메뉴">
        <a href="${base}index.html#products">제품</a>
        <a href="${base}product/m10.html">STANDARD M</a>
        <a href="${base}product/f2400.html">STANDARD F</a>
        <a href="${base}product/q.html">STANDARD Q</a>
        <a href="${base}product/g.html">STANDARD G</a>
        <a href="${base}index.html#compare">비교</a>
        <a href="${base}index.html#tech">기술</a>
        <a href="${base}support.html">지원</a>
        <a href="${base}index.html#contact">문의하기</a>
      </nav>
      <div class="nav-icons">
        <button class="icon-btn" aria-label="검색">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        </button>
        <button class="icon-btn" aria-label="장바구니">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 7h12l-1.5 11a2 2 0 0 1-2 1.8h-5a2 2 0 0 1-2-1.8L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>
        </button>
      </div>
    </div>
  `;

  const footHtml = `
    <div class="foot-inner">
      <p class="foot-note">
        ※ 본 페이지에 게시된 제품 정보는 의료 전문가 대상 정보이며, 일부 제품은 국가별 인허가 상태가 다를 수 있습니다.
        본 페이지는 SD BIOSENSOR의 공개된 제품 라인업(STANDARD M / F / Q / E / G)을 기반으로 제작된 디자인 컨셉 데모 페이지입니다.
      </p>
      <div class="foot-grid">
        <div>
          <h4>제품</h4>
          <ul>
            <li><a href="${base}product/m10.html">STANDARD M10</a></li>
            <li><a href="${base}product/f2400.html">STANDARD F2400</a></li>
            <li><a href="${base}product/f200.html">STANDARD F200</a></li>
            <li><a href="${base}product/q.html">STANDARD Q</a></li>
            <li><a href="${base}product/g.html">STANDARD G</a></li>
            <li><a href="${base}product/e.html">STANDARD E</a></li>
          </ul>
        </div>
        <div>
          <h4>지원</h4>
          <ul>
            <li><a href="${base}support.html#manual">사용 설명서</a></li>
            <li><a href="${base}support.html#qc">정도관리</a></li>
            <li><a href="${base}support.html#software">소프트웨어 업데이트</a></li>
            <li><a href="${base}support.html#faq">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4>도입 안내</h4>
          <ul>
            <li><a href="${base}partners.html#clinic">의원 · 클리닉</a></li>
            <li><a href="${base}partners.html#hospital">병원 · 종합병원</a></li>
            <li><a href="${base}partners.html#lab">검사센터</a></li>
            <li><a href="${base}partners.html#global">해외 파트너</a></li>
          </ul>
        </div>
        <div>
          <h4>회사</h4>
          <ul>
            <li><a href="${base}company.html#about">회사 소개</a></li>
            <li><a href="${base}company.html#news">뉴스룸</a></li>
            <li><a href="${base}company.html#careers">채용</a></li>
            <li><a href="${base}company.html#ir">투자정보</a></li>
          </ul>
        </div>
      </div>
      <div class="foot-bottom">
        <p>Copyright © 2026 SD BIOSENSOR Korea. All rights reserved.</p>
        <ul>
          <li><a href="${base}legal.html#privacy">개인정보처리방침</a></li>
          <li><a href="${base}legal.html#terms">이용약관</a></li>
          <li><a href="${base}legal.html#notice">법적 고지</a></li>
          <li><a href="${base}sitemap.html">사이트맵</a></li>
        </ul>
      </div>
    </div>
  `;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(() => {
    const nav = document.querySelector('header[data-shell="nav"]');
    if (nav) {
      nav.classList.add('nav');
      nav.id = 'nav';
      nav.innerHTML = navHtml;
    }
    const foot = document.querySelector('footer[data-shell="foot"]');
    if (foot) {
      foot.classList.add('foot');
      foot.innerHTML = footHtml;
    }

    // Smooth in-page anchor scroll
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        const y = t.getBoundingClientRect().top + window.scrollY - 56;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  });
})();
