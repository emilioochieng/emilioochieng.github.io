import { SITE, hasBackend } from '../config';
import type { Dict } from '../i18n/en';

interface ClientData { lang: string; locale: string; t: Dict }
const data: ClientData = JSON.parse(document.getElementById('client-data')?.textContent ?? '{}');
const { lang, locale, t } = data;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const fmt = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
const safeUrl = (u: unknown) => (typeof u === 'string' && /^https?:\/\//i.test(u) ? u : '');
const dateFmt = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' });
const fmtDate = (iso?: string) => { const d = iso ? new Date(iso) : null; return d && !isNaN(+d) ? dateFmt.format(d) : ''; };

type Child = Node | string | null | false | undefined;
function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, ...kids: Child[]): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  for (const kid of kids) if (kid) node.append(kid);
  return node;
}

/* ---------- storage-safe helpers ---------- */
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
async function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) { const { at, v } = JSON.parse(raw); if (Date.now() - at < ttlMs) return v as T; }
  } catch { /* ignore */ }
  const v = await load();
  try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), v })); } catch { /* ignore */ }
  return v;
}
async function getJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 10000);
  try {
    const r = await fetch(url, { ...init, signal: ctl.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return (await r.json()) as T;
  } finally { clearTimeout(timer); }
}
const sb = (path: string, init: RequestInit = {}) =>
  fetch(`${SITE.supabase.url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: SITE.supabase.anonKey, Authorization: `Bearer ${SITE.supabase.anonKey}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });

/* ---------- theme, menu, language ---------- */
$('#theme-toggle')?.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next); store.set('theme', next);
});
const nav = $('#nav'); const burger = $('#burger');
burger?.addEventListener('click', () => { const open = nav?.classList.toggle('open') ?? false; burger.setAttribute('aria-expanded', String(open)); });
nav?.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) { nav.classList.remove('open'); burger?.setAttribute('aria-expanded', 'false'); } });
$<HTMLSelectElement>('#lang-select')?.addEventListener('change', (e) => {
  const next = (e.target as HTMLSelectElement).value; store.set('lang', next);
  location.href = `/${next}/${location.hash}`;
});

/* ---------- images that fail to load ---------- */
$$<HTMLImageElement>('img[data-fallback]').forEach((img) => {
  const mark = () => img.classList.add('broken');
  img.addEventListener('error', mark);
  if (img.complete && img.naturalWidth === 0) mark();
});

/* ---------- reveal on scroll, active nav, back to top ---------- */
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.12 });
  $$('.reveal').forEach((el) => io.observe(el));
} else $$('.reveal').forEach((el) => el.classList.add('in'));

if ('IntersectionObserver' in window) {
  const links = new Map($$<HTMLAnchorElement>('[data-nav]').map((a) => [a.dataset.nav!, a]));
  const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { links.forEach((a) => a.classList.remove('active')); links.get(en.target.id)?.classList.add('active'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
}
const toTop = $('#to-top');
addEventListener('scroll', () => toTop?.classList.toggle('show', scrollY > 700), { passive: true });
toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

/* ---------- typing roles ---------- */
(function typing() {
  const holder = $('#role-line'); const out = $('#role-text');
  if (!holder || !out || reduceMotion) return;
  const roles: string[] = JSON.parse(holder.dataset.roles ?? '[]'); if (roles.length < 2) return;
  let i = 0, n = roles[0].length, del = true;
  const tick = () => {
    const word = roles[i];
    if (del) { n--; if (n <= 0) { del = false; i = (i + 1) % roles.length; } }
    else { n++; if (n >= roles[i].length) { del = true; out.textContent = roles[i]; return void setTimeout(tick, 1800); } }
    out.textContent = (del ? word : roles[i]).slice(0, Math.max(n, 0));
    setTimeout(tick, del ? 35 : 70);
  };
  setTimeout(tick, 1800);
})();

/* ---------- animated counters ---------- */
function countTo(el: HTMLElement, to: number) {
  if (reduceMotion || to === 0) { el.textContent = String(to); return; }
  const t0 = performance.now();
  const step = (now: number) => { const p = Math.min((now - t0) / 900, 1); el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
$$('[data-count]').forEach((el) => { const to = Number(el.dataset.count); if (to > 0) countTo(el, to); });

/* ---------- projects: filter + extra projects from the dashboard ---------- */
let activeFilter = 'all';
function applyFilter() {
  let visible = 0;
  $$('#projects-grid .card').forEach((c) => { const show = activeFilter === 'all' || c.dataset.category === activeFilter; c.hidden = !show; if (show) visible++; });
  const empty = $('#projects-empty'); if (empty) empty.hidden = visible > 0;
}
$$('.filter').forEach((b) => b.addEventListener('click', () => {
  activeFilter = b.dataset.filter ?? 'all';
  $$('.filter').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  applyFilter();
}));

interface DbProject { id: string; title: string; description: string; category: string; stack: string[]; live_url?: string; code_url?: string; status: string }
async function loadExtraProjects() {
  if (!hasBackend) return;
  try {
    const rows = await cached<DbProject[]>('ev:projects', 5 * 60_000, async () => {
      const r = await sb('projects?select=*&published=eq.true&order=sort_order.asc,created_at.desc');
      if (!r.ok) throw new Error('projects'); return r.json();
    });
    const grid = $('#projects-grid'); const empty = $('#projects-empty'); if (!grid || !rows.length) return;
    for (const p of rows) {
      const live = safeUrl(p.live_url), code = safeUrl(p.code_url);
      const links = (live || code) && h('div', { class: 'links' },
        live && h('a', { href: live, target: '_blank', rel: 'noopener noreferrer' }, `${t.projects.live} →`),
        code && h('a', { href: code, target: '_blank', rel: 'noopener noreferrer' }, `${t.projects.code} →`));
      const card = h('article', { class: 'card', 'data-category': p.category },
        h('span', { class: 'kind' }, p.category),
        h('h3', {}, p.title, p.status === 'in-progress' && h('span', { class: 'badge' }, t.projects.inProgress)),
        h('p', {}, p.description),
        h('ul', { class: 'chips' }, ...(p.stack ?? []).map((s) => h('li', { class: 'chip' }, s))), links);
      grid.insertBefore(card, empty);
    }
    $('#stat-projects')?.replaceChildren(String($$('#projects-grid .card').length));
    applyFilter();
  } catch (e) { console.warn('Extra projects unavailable', e); }
}

/* ---------- GitHub ---------- */
interface Repo { name: string; description: string | null; html_url: string; language: string | null; stargazers_count: number; pushed_at: string; fork: boolean }
async function loadRepos() {
  const box = $('#repos'); const stat = $('#stat-repos'); if (!box) return;
  const user = SITE.social.github;
  try {
    const [profile, repos] = await Promise.all([
      cached<{ public_repos: number }>('ev:gh-user', 30 * 60_000, () => getJson(`https://api.github.com/users/${user}`)),
      cached<Repo[]>('ev:gh-repos', 30 * 60_000, () => getJson(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=12&type=owner`)),
    ]);
    if (stat) countTo(stat, profile.public_repos);
    const list = repos.filter((r) => !r.fork).slice(0, 6);
    box.replaceChildren(...(list.length ? list.map((r) =>
      h('a', { class: 'card', href: safeUrl(r.html_url), target: '_blank', rel: 'noopener noreferrer', style: 'text-decoration:none;color:inherit' },
        h('span', { class: 'kind' }, r.language ?? 'repo'),
        h('h3', {}, r.name),
        h('p', {}, r.description || t.github.noDescription),
        h('div', { class: 'meta' }, h('span', {}, `★ ${r.stargazers_count}`), h('span', {}, `${t.github.updated} ${fmtDate(r.pushed_at)}`)))
    ) : [h('div', { class: 'empty' }, t.github.empty)]));
  } catch (e) {
    console.warn('GitHub unavailable', e);
    if (stat) stat.textContent = '–';
    box.replaceChildren(h('div', { class: 'notice' }, t.github.error));
  } finally { box.setAttribute('aria-busy', 'false'); }
}

/* ---------- dev.to ---------- */
interface Article { title: string; description: string; url: string; cover_image: string | null; social_image: string | null; published_at: string; reading_time_minutes: number; public_reactions_count: number; tag_list: string[] | string }
async function loadArticles() {
  const box = $('#articles'); if (!box) return;
  const user = SITE.social.devto;
  if (!user) { box.replaceChildren(h('div', { class: 'notice' }, t.articles.empty)); box.setAttribute('aria-busy', 'false'); return; }
  try {
    const list = await cached<Article[]>('ev:devto', 30 * 60_000, () => getJson(`https://dev.to/api/articles?username=${encodeURIComponent(user)}&per_page=6`));
    box.replaceChildren(...(list.length ? list.map((a) => {
      const cover = safeUrl(a.cover_image || a.social_image);
      return h('a', { class: 'card article-card', href: safeUrl(a.url), target: '_blank', rel: 'noopener noreferrer' },
        h('div', { class: 'cover' }, cover && h('img', { src: cover, alt: '', loading: 'lazy', width: '640', height: '320' })),
        h('div', { class: 'body' },
          h('span', { class: 'kind' }, fmtDate(a.published_at)),
          h('h3', {}, a.title),
          h('p', {}, a.description),
          h('div', { class: 'meta' }, h('span', {}, fmt(t.articles.minRead, { n: a.reading_time_minutes })), h('span', {}, `♥ ${a.public_reactions_count} ${t.articles.reactions}`))));
    }) : [h('div', { class: 'empty' }, t.articles.empty)]));
  } catch (e) {
    console.warn('dev.to unavailable', e);
    box.replaceChildren(h('div', { class: 'notice' }, t.articles.error));
  } finally { box.setAttribute('aria-busy', 'false'); }
}

/* ---------- contact form ---------- */
(function contact() {
  const form = $<HTMLFormElement>('#contact-form'); const status = $('#c-status'); const btn = $<HTMLButtonElement>('#c-send');
  if (!form || !status || !btn) return;
  const say = (msg: string, kind: '' | 'ok' | 'err' = '') => { status.textContent = msg; status.className = `status ${kind}`.trim(); };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const name = String(f.get('name') ?? '').trim(), email = String(f.get('email') ?? '').trim(), message = String(f.get('message') ?? '').trim();
    if (String(f.get('website') ?? '')) { say(t.contact.sent, 'ok'); form.reset(); return; } // honeypot: bots see "success"
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || message.length < 5) return say(t.contact.invalid, 'err');
    if (Date.now() - Number(store.get('ev:lastMsg') ?? 0) < 30_000) return say(t.contact.tooFast, 'err');
    if (!hasBackend) {
      say(t.contact.offline);
      location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(`Portfolio message from ${name}`)}&body=${encodeURIComponent(`${message}\n\n${name} <${email}>`)}`;
      return;
    }
    btn.disabled = true; const label = btn.textContent; btn.textContent = t.contact.sending; say('');
    try {
      const r = await sb('messages', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ name, email, message, lang }) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      store.set('ev:lastMsg', String(Date.now())); say(t.contact.sent, 'ok'); form.reset();
    } catch (err) { console.warn(err); say(t.contact.error, 'err'); }
    finally { btn.disabled = false; btn.textContent = label; }
  });
})();

/* ---------- privacy-friendly visit counter (no cookies, no IDs, honours Do Not Track) ---------- */
function trackVisit() {
  if (!hasBackend || navigator.doNotTrack === '1') return;
  const key = `ev:visit:${location.pathname}`;
  try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1'); } catch { return; }
  sb('visits', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ path: location.pathname, lang }), keepalive: true }).catch(() => {});
}

loadRepos(); loadArticles(); loadExtraProjects(); trackVisit();
