/*  =========================================================
    Global: Navbar + sticky header + (optional) home carousel
    ========================================================= */

// Navbar toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav?.classList.toggle('active');
    navToggle.classList.toggle('active'); // animate into X
});

// Close mobile menu on any link
document.querySelectorAll('.nav a').forEach(a =>
    a.addEventListener('click', () => {
        nav?.classList.remove('active');
        navToggle?.classList.remove('active');
        navToggle?.setAttribute('aria-expanded', 'false');
    })
);

// Collapse mobile menu if resizing to desktop
const mql = window.matchMedia('(min-width: 769px)');
function handleMqChange(e) {
    if (e.matches) {
        nav?.classList.remove('active');
        navToggle?.classList.remove('active');
        navToggle?.setAttribute('aria-expanded', 'false');
    }
}
if (mql.addEventListener) mql.addEventListener('change', handleMqChange);
else mql.addListener?.(handleMqChange); // older Safari

// Optional: home carousel arrows
const track = document.querySelector('[data-track]');
const btnPrev = document.querySelector('.props-controls .prev');
const btnNext = document.querySelector('.props-controls .next');
function scrollByCard(dir = 1) {
    if (!track) return;
    const card = track.querySelector('.prop-card');
    const amount = card ? card.getBoundingClientRect().width + 24 : 320; // width + gap
    track.scrollBy({ left: dir * amount, behavior: 'smooth' });
}
btnPrev?.addEventListener('click', () => scrollByCard(-1));
btnNext?.addEventListener('click', () => scrollByCard(1));

// Sticky header helpers
const header = document.querySelector('.site-header');
function setHeaderHeightVar() {
    if (!header) return;
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
}
setHeaderHeightVar();
window.addEventListener('resize', setHeaderHeightVar);
function toggleScrolledClass() {
    document.body.classList.toggle('has-scrolled', window.scrollY > 2);
}
toggleScrolledClass();
window.addEventListener('scroll', toggleScrolledClass);

/*  =========================================================
    VIVIENDA page 
    ========================================================= */
(function viviendaModule(){
    const cardsEl = document.getElementById('cards');
    const fType  = document.getElementById('f-type');
    const fArea  = document.getElementById('f-area');
    const fPrice = document.getElementById('f-price');
    if (!cardsEl || !fType || !fArea || !fPrice) return; // not Vivienda → bail

    // --- Mobile filters FAB toggle ---
    const filtersWrap = document.querySelector('.filters');
    const fabBtn = filtersWrap?.querySelector('.filters-fab');

    if (filtersWrap && fabBtn) {
        // optional a11y wiring
        const adv = filtersWrap.querySelector('.filters-advanced');
        if (adv && !adv.id) adv.id = 'filters-advanced';
        if (adv?.id) fabBtn.setAttribute('aria-controls', adv.id);
        fabBtn.setAttribute('aria-expanded', 'false');

        fabBtn.addEventListener('click', () => {
        filtersWrap.classList.toggle('open');
        const open = filtersWrap.classList.contains('open');
        fabBtn.setAttribute('aria-expanded', String(open));
        });

        // close if you tap outside
        document.addEventListener('click', (e) => {
        if (!filtersWrap.classList.contains('open')) return;
        if (!filtersWrap.contains(e.target)) {
            filtersWrap.classList.remove('open');
            fabBtn.setAttribute('aria-expanded', 'false');
        }
        });

        // Esc to close
        document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && filtersWrap.classList.contains('open')) {
            filtersWrap.classList.remove('open');
            fabBtn.setAttribute('aria-expanded', 'false');
        }
        });
    }

    // Other Vivienda filters
    const fStatus = document.getElementById('f-status');
    const fZone   = document.getElementById('f-zone');
    const fRooms  = document.getElementById('f-rooms');
    const fBaths  = document.getElementById('f-baths');
    const fSort   = document.getElementById('f-sort');
    const areaValue  = document.getElementById('areaValue');
    const priceValue = document.getElementById('priceValue');

    const pesoFmt = new Intl.NumberFormat('es-CO');

    // Demo dataset
    const HOMES = [
        { id:1, status:'arriendo', type:'Apartamento', zone:'Chicó Norte', rooms:2, baths:2, park:2, area:100, priceSale:1685000000, priceRent:13233000, img:'Images/hero.png' },
        { id:2, status:'venta',    type:'Apartamento', zone:'Cedritos',    rooms:3, baths:2, park:1, area:88,  priceSale:980000000,  priceRent:6900000,  img:'Images/property-placeholder.png' },
        { id:3, status:'arriendo', type:'Oficina',     zone:'Chapinero',   rooms:0, baths:2, park:2, area:120, priceSale:2300000000, priceRent:18900000, img:'Images/property-placeholder.png' },
        { id:4, status:'venta',    type:'Casa',        zone:'Usaquén',     rooms:4, baths:3, park:2, area:210, priceSale:3200000000, priceRent:18900000, img:'Images/property-placeholder.png' },
        { id:5, status:'venta',    type:'Apartamento', zone:'Chicó Norte', rooms:2, baths:2, park:2, area:95,  priceSale:1450000000, priceRent:12300000, img:'Images/property-placeholder.png' },
        { id:6, status:'arriendo', type:'Apartamento', zone:'Cedritos',    rooms:2, baths:2, park:1, area:76,  priceSale:0,          priceRent:7200000,  img:'Images/property-placeholder.png' },
        { id:7, status:'venta',    type:'Apartamento', zone:'Usaquén',     rooms:3, baths:3, park:2, area:130, priceSale:2150000000, priceRent:13800000, img:'Images/property-placeholder.png' },
        { id:8, status:'arriendo', type:'Apartamento', zone:'Chicó Norte', rooms:1, baths:1, park:1, area:54,  priceSale:0,          priceRent:5200000,  img:'Images/property-placeholder.png' },
        { id:9, status:'venta',    type:'Casa',        zone:'Cedritos',    rooms:4, baths:3, park:2, area:190, priceSale:2850000000, priceRent:0,        img:'Images/property-placeholder.png' },
        { id:10,status:'venta',    type:'Apartamento', zone:'Chapinero',   rooms:2, baths:2, park:1, area:82,  priceSale:1100000000, priceRent:0,        img:'Images/property-placeholder.png' },
        { id:11,status:'arriendo', type:'Apartamento', zone:'Usaquén',     rooms:2, baths:2, park:1, area:70,  priceSale:0,          priceRent:6100000,  img:'Images/property-placeholder.png' },
        { id:12,status:'venta',    type:'Apartamento', zone:'Chicó Norte', rooms:3, baths:2, park:2, area:140, priceSale:2600000000, priceRent:0,        img:'Images/property-placeholder.png' },
    ];
    HOMES.forEach(h => h.address = 'Apto calle 92 con 13');

    // Slider fill for WebKit/Chromium
    function setRangeFill(input){
        const min = +input.min || 0, max = +input.max || 100, val = +input.value;
        const p = ((val - min) * 100) / (max - min);
        input.style.setProperty('--range-p', p + '%');
    }

    function priceForStatus(h){
        if (fStatus?.value === 'venta')    return h.priceSale || 0;
        if (fStatus?.value === 'arriendo') return h.priceRent || 0;
        return h.priceSale || h.priceRent || 0;
    }

    function renderVivienda(){
        // labels + slider fills
        if (areaValue)  areaValue.textContent  = `${fArea.value} m²`;
        if (priceValue) priceValue.textContent = `$${pesoFmt.format(Number(fPrice.value))}`;
        setRangeFill(fArea);
        setRangeFill(fPrice);

        // filter
        let list = HOMES.filter(h=>{
        if (fStatus?.value!=='all' && h.status!==fStatus.value) return false;
        if (fType?.value!=='all'   && h.type!==fType.value)     return false;
        if (fZone?.value!=='all'   && h.zone!==fZone.value)     return false;
        if (fRooms?.value!=='all'  && h.rooms < Number(fRooms.value)) return false;
        if (fBaths?.value!=='all'  && h.baths < Number(fBaths.value)) return false;
        if (h.area > Number(fArea.value)) return false;
        if (priceForStatus(h) > Number(fPrice.value)) return false;
        return true;
        });

        // sort
        list.sort((a,b)=>{
        switch(fSort?.value){
            case 'price-asc':  return priceForStatus(a) - priceForStatus(b);
            case 'price-desc': return priceForStatus(b) - priceForStatus(a);
            case 'area-asc':   return a.area - b.area;
            case 'area-desc':  return b.area - a.area;
            default:           return a.id - b.id;
        }
        });

        // render
        cardsEl.innerHTML = list.map(h=>{
        const hasVenta = h.priceSale > 0;
        const hasArr   = h.priceRent > 0;
        const venta    = hasVenta ? `$${pesoFmt.format(h.priceSale)}` : '—';
        const renta    = hasArr   ? `$${pesoFmt.format(h.priceRent)}` : '—';

        return `
        <article class="prop-card">
            <div class="prop-media">
            ${hasVenta ? '<span class="badge">Venta</span>' : ''}
            ${hasArr ? '<span class="badge" style="right:66px">Arriendo</span>' : ''}
            <img src="${h.img}" alt="">
            <div class="watermark"><img src="Images/mercantil-logo.png" alt=""></div>
            </div>
            <div class="prop-body">
            <h3 class="prop-title"><a href="apto.html">Espectacular apartamento en gran edificio de 100 m2</a></h3>
            <p class="prop-meta"><img src="Images/location.png" alt=""> ${h.address}</p>

            <div class="prop-prices">
                <div><strong>Precio Venta</strong><span>${venta}</span></div>
                <div><strong>Renta</strong><span>${renta}</span></div>
                <div><strong>Administración</strong><span>$1,233,000</span></div>
            </div>

            <ul class="prop-icons">
                <li><div class="feat-top"><span class="feat-val">${h.rooms}</span><img src="Images/bedroom.png" class="feat-icon" alt=""></div><span class="feat-label">Alcobas</span></li>
                <li><div class="feat-top"><span class="feat-val">${h.baths}</span><img src="Images/bathroom.png" class="feat-icon" alt=""></div><span class="feat-label">Baños</span></li>
                <li><div class="feat-top"><span class="feat-val">${h.park}</span><img src="Images/parking.png" class="feat-icon" alt=""></div><span class="feat-label">Parqueo</span></li>
                <li><div class="feat-top"><span class="feat-val">${h.area}</span><img src="Images/meterssquared.png" class="feat-icon" alt=""></div><span class="feat-label">m²</span></li>
            </ul>
            </div>
        </article>`;
        }).join('');
    }

    // listeners
    [fStatus,fType,fZone,fRooms,fBaths,fArea,fPrice,fSort].forEach(el=>{
        el?.addEventListener('input', renderVivienda);
        el?.addEventListener('change', renderVivienda);
    });

    renderVivienda();
})();


/*  =========================================================
    COMERCIAL page
    ========================================================= */
(function comercialModule(){
    const cardsEl = document.getElementById('cards');
    const isComercial = !!document.querySelector('form.filters--no-sliders');
    if (!cardsEl || !isComercial) return; // not Comercial → bail

    // FAB toggle (tablet/mobile)
    const filtersForm = document.getElementById('filters');
    const filtersFab  = document.querySelector('.filters-fab');
    filtersFab?.addEventListener('click', () => {
        const expanded = filtersFab.getAttribute('aria-expanded') === 'true';
        filtersFab.setAttribute('aria-expanded', String(!expanded));
        filtersForm?.classList.toggle('open', !expanded);
    });

    // Filters present on Comercial
    const fStatus = document.getElementById('f-status');
    const fZone   = document.getElementById('f-zone');
    const fSort   = document.getElementById('f-sort');

    const pesoFmt = new Intl.NumberFormat('es-CO');

    // >>> Array JUST for Comercial (no overlap)
    const COMMERCIAL_LISTINGS = [
        { id:1, status:'arriendo', type:'Oficina', zone:'Chicó Norte',         area:120, park:2, rooms:4, baths:2, priceSale:2100000000, priceRent:18500000, img:'Images/property-placeholder.png' },
        { id:2, status:'venta',    type:'Local',   zone:'Zona T',               area:95,  park:1, rooms:4, baths:2, priceSale:2100000000, priceRent:18500000, img:'Images/property-placeholder.png' },
        { id:3, status:'venta',    type:'Local',   zone:'Chapinero',            area:140, park:0, rooms:4, baths:2, priceSale:2600000000, priceRent:18500000, img:'Images/property-placeholder.png' },
        { id:4, status:'arriendo', type:'Oficina', zone:'Centro Internacional', area:180, park:2, rooms:4, baths:2, priceSale:2100000000, priceRent:22800000, img:'Images/property-placeholder.png' },
        { id:5, status:'arriendo', type:'Local',   zone:'Cedritos',             area:75,  park:1, rooms:4, baths:2, priceSale:2100000000, priceRent:9500000, img:'Images/property-placeholder.png' },
        { id:6, status:'venta',    type:'Oficina', zone:'Chicó Norte',          area:220, park:3, rooms:4, baths:2, priceSale:3450000000, priceRent:18500000, img:'Images/property-placeholder.png' },
    ];
    COMMERCIAL_LISTINGS.forEach(s => s.address = 'Apto calle 92 con 13'); // placeholder

    const getFilters = () => ({
        status: fStatus?.value || 'all',
        zone:   fZone?.value   || 'all',
        sort:   fSort?.value   || 'relevance'
    });

    const priceForStatus = (s, status) => {
        if (status === 'venta')    return s.priceSale || 0;
        if (status === 'arriendo') return s.priceRent || 0;
        return s.priceSale || s.priceRent || 0;
    };

    function renderComercial(){
        const { status, zone, sort } = getFilters();

        let list = COMMERCIAL_LISTINGS.filter(s=>{
        if (status !== 'all' && s.status !== status) return false;
        if (zone   !== 'all' && s.zone   !== zone)   return false;
        return true;
        });

        list.sort((a,b)=>{
        switch (sort) {
            case 'price-asc':  return priceForStatus(a, status) - priceForStatus(b, status);
            case 'price-desc': return priceForStatus(b, status) - priceForStatus(a, status);
            case 'area-asc':   return a.area - b.area;
            case 'area-desc':  return b.area - a.area;
            default:           return a.id - b.id;
        }
        });

        cardsEl.innerHTML = list.map(s=>{
        const hasVenta = s.priceSale > 0;
        const hasArr   = s.priceRent > 0;
        const venta    = hasVenta ? `$${pesoFmt.format(s.priceSale)}` : '—';
        const renta    = hasArr   ? `$${pesoFmt.format(s.priceRent)}` : '—';

        return `
        <article class="prop-card">
            <div class="prop-media">
            ${hasVenta ? '<span class="badge">Venta</span>' : ''}
            ${hasArr ? '<span class="badge" style="right:66px">Arriendo</span>' : ''}
            <img src="${s.img}" alt="">
            <div class="watermark"><img src="Images/mercantil-logo.png" alt=""></div>
            </div>
            <div class="prop-body">
            <h3 class="prop-title"><a href="off.html">Linda y moderna oficina para 10 personas en Santa Barbara</a></h3>
            <p class="prop-meta"><img src="Images/location.png" alt=""> ${s.address}</p>

            <div class="prop-prices">
                <div><strong>Precio Venta</strong><span>${venta}</span></div>
                <div><strong>Renta</strong><span>${renta}</span></div>
                <div><strong>Administración</strong><span>$1,233,000</span></div>
            </div>

            <ul class="prop-icons">
                <li>
                    <div class="feat-top">
                        <span class="feat-val">${s.rooms > 0 ? s.rooms : '—'}</span>
                        <img src="Images/bedroom.png" class="feat-icon" alt="">
                    </div>
                    <span class="feat-label">Oficinas</span>
                </li>
                <li>
                    <div class="feat-top">
                        <span class="feat-val">${s.baths > 0 ? s.baths : '—'}</span>
                        <img src="Images/bathroom.png" class="feat-icon" alt="">
                    </div>
                    <span class="feat-label">Baños</span>
                </li>
                <li>
                    <div class="feat-top">
                        <span class="feat-val">${s.park}</span>
                        <img src="Images/parking.png" class="feat-icon" alt="">
                    </div>
                    <span class="feat-label">Parqueo</span>
                </li>
                <li>
                    <div class="feat-top">
                        <span class="feat-val">${s.area}</span>
                        <img src="Images/meterssquared.png" class="feat-icon" alt="">
                    </div>
                    <span class="feat-label">m²</span>
                </li>
            </ul>
            </div>
        </article>`;
        }).join('');
    }

    [fStatus, fZone, fSort].forEach(el=>{
        el?.addEventListener('input', renderComercial);
        el?.addEventListener('change', renderComercial);
    });

    renderComercial();
})();

// ===== NEW: Contact form submission via Formspree =====
(function contactForm(){
    const form   = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form) return;

    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xgvnekkv';

    function show(msg, ok=true){
        status.textContent = msg;
        status.style.color = ok ? '#2e7d32' : '#b23b3b';
    }

    form.addEventListener('submit', async (e)=>{
        e.preventDefault();

        const data = new FormData(form);
        const name = (data.get('name')||'').trim();
        const email = (data.get('email')||'').trim();
        const message = (data.get('message')||'').trim();

        if (!name || !email || !message){
        show('Por favor completa los campos obligatorios.', false);
        return;
        }

        try {
        const resp = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: data
        });

        if (resp.ok) {
            show('¡Gracias! Tu mensaje fue enviado.');
            form.reset();
        } else {
            const err = await resp.json().catch(()=>({}));
            show(err?.errors?.[0]?.message || 'No se pudo enviar. Intenta de nuevo más tarde.', false);
        }
        } catch (err) {
        show('Error de red. Intenta de nuevo.', false);
        }
    });
})();

// ===== (APTO): simple gallery swap =====
(function aptoGallery(){
    const hero = document.getElementById('apto-hero');
    const strip = document.getElementById('apto-thumbs');
    if (!hero || !strip) return;

    strip.addEventListener('click', (e)=>{
        const btn = e.target.closest('.thumb');
        if (!btn) return;
        const img = btn.querySelector('img');
        if (!img) return;

        hero.src = img.src;

        // active state
        strip.querySelectorAll('.thumb').forEach(t => t.classList.remove('is-active'));
        btn.classList.add('is-active');
    });
})();

/* ===============================
    LIGHTBOX
    =============================== */

// Elements
const lbBackdrop = document.getElementById('lightbox'); // .lb-backdrop
const lbContent  = lbBackdrop?.querySelector('.lb-content');
const lbClose    = lbBackdrop?.querySelector('.lb-close');
const lbPrev     = lbBackdrop?.querySelector('.lb-arrow.lb-prev');
const lbNext     = lbBackdrop?.querySelector('.lb-arrow.lb-next');
const lbImage    = lbBackdrop?.querySelector('#lb-image');
const lbStrip    = lbBackdrop?.querySelector('#lb-strip');

// Source gallery on the page
const heroImg    = document.getElementById('apto-hero');
const thumbsWrap = document.getElementById('apto-thumbs');

// Internal state
let gallerySrcs = [];
let currentIdx  = 0;

// Helpers
function collectGallerySources() {
    const thumbs = [...document.querySelectorAll('#apto-thumbs img')].map(i => i.src);
    const hero   = document.getElementById('apto-hero')?.src;
    // Ensure the hero is included as first item, without duplicating
    const list = hero && !thumbs.includes(hero) ? [hero, ...thumbs] : thumbs.length ? thumbs : (hero ? [hero] : []);
    return list;
}

function buildStrip(activeIndex) {
    if (!lbStrip) return;
    lbStrip.innerHTML = `
        <div class="lb-strip-inner">
        ${gallerySrcs.map((src, i) =>
            `<button class="lb-thumb${i === activeIndex ? ' is-active' : ''}" data-idx="${i}">
            <img src="${src}" alt="">
            </button>`
        ).join('')}
        </div>`;
}

function setActive(i) {
    if (!lbImage || !gallerySrcs.length) return;
    currentIdx = (i + gallerySrcs.length) % gallerySrcs.length;
    lbImage.src = gallerySrcs[currentIdx];

    // highlight thumb in strip
    lbStrip?.querySelectorAll('.lb-thumb').forEach(btn =>
        btn.classList.toggle('is-active', Number(btn.dataset.idx) === currentIdx)
    );

    // keep active thumb centered
    const activeBtn = lbStrip?.querySelector('.lb-thumb.is-active');
    activeBtn?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
}

function openLightbox(startIndex = 0) {
    if (!lbBackdrop) return;
    gallerySrcs = collectGallerySources();
    if (!gallerySrcs.length) return;

    buildStrip(startIndex);
    setActive(startIndex);

    lbBackdrop.classList.add('is-open');
    lbBackdrop.setAttribute('aria-hidden', 'false');

    // Lock background scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!lbBackdrop) return;
    lbBackdrop.classList.remove('is-open');
    lbBackdrop.setAttribute('aria-hidden', 'true');

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
}

// Wire up page gallery clicks
heroImg?.addEventListener('click', () => {
    // If hero is also in thumbs list, find its index; else treat as first
    const list = collectGallerySources();
    const idx  = list.indexOf(heroImg.src);
    openLightbox(idx >= 0 ? idx : 0);
});

thumbsWrap?.addEventListener('click', (e) => {
    const t = e.target.closest('.thumb');
    if (!t) return;
    const img = t.querySelector('img');
    if (!img) return;
    const list = collectGallerySources();
    const idx  = Math.max(0, list.indexOf(img.src));
    openLightbox(idx);
});

// Lightbox controls
lbClose?.addEventListener('click', closeLightbox);
lbBackdrop?.addEventListener('click', (e) => {
  // click outside the white content closes
    if (e.target === lbBackdrop) closeLightbox();
});
lbPrev?.addEventListener('click', () => setActive(currentIdx - 1));
lbNext?.addEventListener('click', () => setActive(currentIdx + 1));

lbStrip?.addEventListener('click', (e) => {
    const b = e.target.closest('.lb-thumb');
    if (!b) return;
    const idx = Number(b.dataset.idx || 0);
    setActive(idx);
});

// Keyboard nav when open
document.addEventListener('keydown', (e) => {
    if (!lbBackdrop?.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); setActive(currentIdx - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); setActive(currentIdx + 1); }
});
