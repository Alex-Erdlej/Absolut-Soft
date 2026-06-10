/* =============================================
   ABSOLUT SOFT – scripts.js
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* =============================================
       SCROLL-CONTAINER FIX
       body ist der Scroll-Container (scroll-snap-type: y mandatory).
       window.scrollTo() funktioniert deshalb NICHT –
       es muss document.body.scrollTo() heißen.
       Der Header-Link hat onclick="window.scrollTo(...)" direkt
       im HTML – wir überschreiben dieses onclick hier.
       =============================================
    */
    const headerLink = document.querySelector('.header-title');
    if (headerLink) {
        headerLink.onclick = function (e) {
            e.preventDefault();
            document.body.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
        };
    }

    /* =============================================
       SECTION 5 + 9: Zwei Snap-Punkte
       
       Scroll-Snap funktioniert NUR für direkte Kinder
       des Scroll-Containers (body). .section-5-top und
       .section-5-bottom sind aber Kinder von .section-5
       (Enkelelemente von body) → der Browser ignoriert
       sie als Snap-Punkte.
       
       Lösung: Den .section-5-Wrapper entfernen und
       .section-5-top + .section-5-bottom als direkte
       body-Kinder einsetzen. Beide bekommen die Klasse
       "section" (→ scroll-snap-align: start greift).
       Gleiches für .section-9.
       =============================================
    */
    function unwrapSplitSections() {
        // section-5 und section-9 je in Top + Bottom aufteilen
        var pairs = [
            { wrapper: '.section-5', topCls: 'section-5-top', botCls: 'section-5-bottom' },
            { wrapper: '.section-9', topCls: 'section-5-top', botCls: 'section-5-bottom' }
        ];

        pairs.forEach(function (pair) {
            var wrapper = document.querySelector(pair.wrapper);
            if (!wrapper) return;

            var top = wrapper.querySelector('.' + pair.topCls);
            var bottom = wrapper.querySelector('.' + pair.botCls);
            if (!top || !bottom) return;

            // Klasse "section" ergänzen → scroll-snap-align greift
            top.classList.add('section');
            bottom.classList.add('section');

            // Bei section-9: eigene Kennung für Farbselektor
            if (pair.wrapper === '.section-9') {
                top.classList.add('section-9-top');
                bottom.classList.add('section-9-bottom');
            }

            // Direkt vor den Wrapper einsetzen (erhält DOM-Reihenfolge)
            wrapper.parentNode.insertBefore(top, wrapper);
            wrapper.parentNode.insertBefore(bottom, wrapper);

            // Leeren Wrapper entfernen
            wrapper.parentNode.removeChild(wrapper);
        });
    }
    unwrapSplitSections();

    /* ---------- Burger Menu + Nav Overlay ---------- */
    const burger = document.querySelector('.burger-menu');
    const navOverlay = document.getElementById('navOverlay');
    const navPanel = navOverlay ? navOverlay.querySelector('.nav-panel') : null;

    // Inject close X button into nav panel
    if (navPanel && !navPanel.querySelector('.nav-close-btn')) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'nav-close-btn';
        closeBtn.setAttribute('aria-label', 'Menü schließen');
        closeBtn.innerHTML = '&times;';
        navPanel.insertBefore(closeBtn, navPanel.firstChild);

        closeBtn.addEventListener('click', function () {
            burger.classList.remove('open');
            navOverlay.classList.remove('open');
        });
    }

    if (burger && navOverlay) {
        burger.addEventListener('click', function () {
            burger.classList.toggle('open');
            navOverlay.classList.toggle('open');
        });
        navOverlay.addEventListener('click', function (e) {
            if (!e.target.closest('.nav-panel')) {
                burger.classList.remove('open');
                navOverlay.classList.remove('open');
            }
        });
    }

    /* ---------- Section 6: Scent Slider (Desktop) ---------- */
    const slider = document.getElementById('scentSlider');
    const sliderViewport = slider ? slider.closest('.scent-slider-viewport') : null;
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');

    if (slider && sliderViewport && prevBtn && nextBtn) {
        const ITEM_GAP = 24;

        const getItemWidth = function () {
            const item = slider.querySelector('.scent-item');
            if (!item) return 168 + ITEM_GAP;
            return item.offsetWidth + ITEM_GAP;
        };

        let currentIndex = 0;
        const items = slider.querySelectorAll('.scent-item');
        const totalItems = items.length;

        function getMaxOffset() {
            const itemW = getItemWidth();
            const totalWidth = totalItems * itemW - ITEM_GAP;
            const viewportWidth = sliderViewport.offsetWidth;
            return Math.max(0, totalWidth - viewportWidth);
        }

        function getMaxIndex() {
            const itemW = getItemWidth();
            if (itemW <= 0) return 0;
            return Math.ceil(getMaxOffset() / itemW);
        }

        function updateSlider() {
            const maxIndex = getMaxIndex();
            const maxOffset = getMaxOffset();
            const itemW = getItemWidth();

            if (currentIndex < 0) currentIndex = 0;
            if (currentIndex > maxIndex) currentIndex = maxIndex;

            const rawOffset = currentIndex * itemW;
            const offset = Math.min(rawOffset, maxOffset);
            slider.style.transform = `translateX(-${offset}px)`;

            prevBtn.style.opacity = currentIndex <= 0 ? '0.3' : '1';
            prevBtn.style.pointerEvents = currentIndex <= 0 ? 'none' : '';
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
            nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : '';
        }

        prevBtn.addEventListener('click', function () {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        nextBtn.addEventListener('click', function () {
            if (currentIndex < getMaxIndex()) {
                currentIndex++;
                updateSlider();
            }
        });

        requestAnimationFrame(function () {
            updateSlider();
        });

        window.addEventListener('resize', function () {
            const maxIndex = getMaxIndex();
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updateSlider();
        });
    }

    /* ---------- Section 11 Mobile: Overlay ---------- */
    let sec11OverlayBuilt = false;

    function buildMobileSection11() {
        if (sec11OverlayBuilt) return;
        const section11Right = document.querySelector('.section-11-right');
        if (!section11Right) return;
        if (section11Right.querySelector('.section-11-mobile-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'section-11-mobile-overlay';
        overlay.innerHTML = `
            <h2 class="sec11-headline">ABSOLUT SOFT</h2>
            <p class="sec11-handwritten">HERGESTELLT<br>IN DEM DORF ÅHUS</p>
            <a href="#" class="sec11-mobile-link">
                Mehr<br>Erfahren <span class="sec11-arrow">&gt;</span>
            </a>
        `;
        section11Right.appendChild(overlay);
        sec11OverlayBuilt = true;
    }

    function removeMobileSection11() {
        const overlay = document.querySelector('.section-11-mobile-overlay');
        if (overlay) { overlay.remove(); sec11OverlayBuilt = false; }
    }

    /* ---------- Section 6 Mobile: Header-Block ---------- */
    let sec6MobileBuilt = false;

    function buildMobileSection6() {
        if (sec6MobileBuilt) return;
        const sec6Inner = document.querySelector('.section-6-inner');
        if (!sec6Inner) return;
        if (sec6Inner.querySelector('.sec6-mobile-header')) return;

        const headline = sec6Inner.querySelector('.sec6-headline');
        const bottomText = sec6Inner.querySelector('.sec6-bottom-text');
        const sliderWrapper = sec6Inner.querySelector('.scent-slider-wrapper');
        if (!headline || !bottomText || !sliderWrapper) return;

        const mobileHeader = document.createElement('div');
        mobileHeader.className = 'sec6-mobile-header';
        mobileHeader.appendChild(headline.cloneNode(true));
        mobileHeader.appendChild(bottomText.cloneNode(true));

        headline.style.display = 'none';
        bottomText.style.display = 'none';
        sec6Inner.insertBefore(mobileHeader, sliderWrapper);
        sec6MobileBuilt = true;
    }

    function removeMobileSection6() {
        const mobileHeader = document.querySelector('.sec6-mobile-header');
        if (mobileHeader) mobileHeader.remove();
        const headline = document.querySelector('.sec6-headline');
        const bottomText = document.querySelector('.sec6-bottom-text');
        if (headline) headline.style.display = '';
        if (bottomText) bottomText.style.display = '';
        sec6MobileBuilt = false;
    }

    /* ---------- Section 8 Mobile ---------- */
    let sec8MobileBuilt = false;

    function buildMobileSection8() {
        if (sec8MobileBuilt) return;
        const overlay = document.querySelector('.section-8-overlay');
        if (!overlay) return;

        const existingBtn = overlay.querySelector('.btn-white-more');
        if (existingBtn) existingBtn.style.display = 'none';

        if (overlay.querySelector('.sec8-mobile-link')) return;

        const mobileLink = document.createElement('a');
        mobileLink.href = '#';
        mobileLink.className = 'sec8-mobile-link sec11-mobile-link';
        mobileLink.innerHTML = 'Mehr<br>Erfahren <span class="sec11-arrow">&gt;</span>';
        overlay.appendChild(mobileLink);
        sec8MobileBuilt = true;
    }

    function removeMobileSection8() {
        const mobileLink = document.querySelector('.sec8-mobile-link');
        if (mobileLink) mobileLink.remove();
        const existingBtn = document.querySelector('.section-8-overlay .btn-white-more');
        if (existingBtn) existingBtn.style.display = '';
        sec8MobileBuilt = false;
    }

    /* ---------- Section 12 Mobile ---------- */
    let sec12MobileBuilt = false;

    function buildMobileSection12() {
        if (sec12MobileBuilt) return;
        const overlay = document.querySelector('.section-12-overlay');
        if (!overlay) return;

        const sub = overlay.querySelector('.sec12-sub');
        if (sub) sub.style.display = 'none';

        const existingBtn = overlay.querySelector('.btn-black-subscribe');
        if (existingBtn) existingBtn.style.display = 'none';

        if (overlay.querySelector('.sec12-mobile-link')) return;

        const mobileLink = document.createElement('a');
        mobileLink.href = '#';
        mobileLink.className = 'sec12-mobile-link sec11-mobile-link';
        mobileLink.innerHTML = 'Anmelden <span class="sec11-arrow">&gt;</span>';
        overlay.appendChild(mobileLink);
        sec12MobileBuilt = true;
    }

    function removeMobileSection12() {
        const mobileLink = document.querySelector('.sec12-mobile-link');
        if (mobileLink) mobileLink.remove();
        const sub = document.querySelector('.section-12-overlay .sec12-sub');
        if (sub) sub.style.display = '';
        const existingBtn = document.querySelector('.section-12-overlay .btn-black-subscribe');
        if (existingBtn) existingBtn.style.display = '';
        sec12MobileBuilt = false;
    }

    function handleResponsive() {
        if (window.innerWidth <= 768) {
            buildMobileSection11();
            buildMobileSection6();
            buildMobileSection8();
            buildMobileSection12();
        } else {
            removeMobileSection11();
            removeMobileSection6();
            removeMobileSection8();
            removeMobileSection12();
        }
    }

    handleResponsive();
    window.addEventListener('resize', handleResponsive);

    /* ---------- Footer: Accordion (Mobile) ---------- */
    document.querySelectorAll('.footer-col-title').forEach(function (title) {
        title.addEventListener('click', function () {
            const col = title.closest('.footer-col');
            if (!col) return;
            const links = col.querySelector('.footer-links');
            if (!links) return;
            title.classList.toggle('open');
            links.classList.toggle('open');
        });
    });

    /* ---------- Footer: Language selector → opens modal ---------- */
    const langDisplay = document.getElementById('footerLangDisplay');
    const langWrapper = document.getElementById('footerLanguage');
    const langModalBackdrop = document.getElementById('langModalBackdrop');
    const langModalClose = document.getElementById('langModalClose');
    const langModalOptions = document.querySelectorAll('.lang-modal-option');

    function openLangModal() {
        if (langModalBackdrop) langModalBackdrop.classList.add('open');
    }

    function closeLangModal() {
        if (langModalBackdrop) langModalBackdrop.classList.remove('open');
    }

    if (langWrapper) {
        langWrapper.addEventListener('click', function (e) {
            e.stopPropagation();
            openLangModal();
        });
    }

    if (langModalClose) {
        langModalClose.addEventListener('click', closeLangModal);
    }

    if (langModalBackdrop) {
        langModalBackdrop.addEventListener('click', function (e) {
            if (e.target === langModalBackdrop) closeLangModal();
        });
    }

    langModalOptions.forEach(function (opt) {
        opt.addEventListener('click', function () {
            langModalOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            if (langDisplay) langDisplay.textContent = opt.dataset.value;
            closeLangModal();
        });
    });

    /* ---------- Scent-buy: Arrow animation ---------- */
    document.querySelectorAll('.scent-buy').forEach(function (link) {
        link.innerHTML = link.innerHTML.replace('→', '<span class="scent-arrow" style="display:inline-block;transition:transform 0.2s ease;">→</span>');
        link.addEventListener('mouseenter', function () {
            const a = link.querySelector('.scent-arrow');
            if (a) a.style.transform = 'translateX(5px)';
        });
        link.addEventListener('mouseleave', function () {
            const a = link.querySelector('.scent-arrow');
            if (a) a.style.transform = 'translateX(0)';
        });
    });

    /* ---------- Mobile link arrow animation ---------- */
    document.addEventListener('mouseenter', function (e) {
        if (e.target.closest && e.target.closest('.sec11-mobile-link, .sec8-mobile-link, .sec12-mobile-link')) {
            const arrow = e.target.closest('a').querySelector('.sec11-arrow');
            if (arrow) arrow.style.transform = 'translateX(4px)';
        }
    }, true);

    document.addEventListener('mouseleave', function (e) {
        if (e.target.closest && e.target.closest('.sec11-mobile-link, .sec8-mobile-link, .sec12-mobile-link')) {
            const arrow = e.target.closest('a').querySelector('.sec11-arrow');
            if (arrow) arrow.style.transform = 'translateX(0)';
        }
    }, true);

});