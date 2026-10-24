import { createClient, type Session } from '@supabase/supabase-js';
import { SITE, hasBackend } from '../config';

const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
type Child = Node | string | null | false | undefined;
function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, ...kids: Child[]) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  for (const k of kids) if (k) n.append(k);
  return n;
}
const when = (iso: string) => new Date(iso).toLocaleString();

$('#theme-toggle').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next); try { localStorage.setItem('theme', next); } catch { /* ignore */ }
});

if (!hasBackend) { $('#no-backend').hidden = false; } else {
  const db = createClient(SITE.supabase.url, SITE.supabase.anonKey);

  async function enter(session: Session | null) {
    $('#login').hidden = true; $('#app').hidden = true; $('#signout').hidden = true;
    if (!session) { $('#login').hidden = false; return; }
    const { data } = await db.from('admins').select('user_id').eq('user_id', session.user.id).maybeSingle();
    if (!data) { await db.auth.signOut(); $('#login').hidden = false; $('#login-status').textContent = 'This account is not an admin.'; return; }
    $('#app').hidden = false; $('#signout').hidden = false;
    loadMessages(); loadProjects(); loadTraffic();
  }
  db.auth.getSession().then(({ data }) => enter(data.session));
  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); $('#login-status').textContent = '';
    const { data, error } = await db.auth.signInWithPassword({ email: $<HTMLInputElement>('#l-email').value, password: $<HTMLInputElement>('#l-pass').value });
    if (error) $('#login-status').textContent = 'Sign-in failed. Check your email and password.'; else enter(data.session);
  });
  $('#signout').addEventListener('click', async () => { await db.auth.signOut(); location.reload(); });

  document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    for (const t of ['messages', 'projects', 'traffic']) $(`#tab-${t}`).hidden = t !== b.dataset.tab;
  }));

  /* ----- messages ----- */
  async function loadMessages() {
    const { data, error } = await db.from('messages').select('*').order('created_at', { ascending: false }).limit(200);
    const list = $('#messages-list'); list.replaceChildren();
    if (error) return void list.append(h('p', { class: 'notice' }, `Could not load messages: ${error.message}`));
    $('#unread').textContent = String((data ?? []).filter((m) => !m.is_read).length);
    if (!data?.length) return void list.append(h('p', { class: 'notice' }, 'No messages yet.'));
    for (const m of data) {
      const toggle = h('button', { class: 'btn ghost small', type: 'button' }, m.is_read ? 'Mark unread' : 'Mark read');
      toggle.addEventListener('click', async () => { await db.from('messages').update({ is_read: !m.is_read }).eq('id', m.id); loadMessages(); });
      const del = h('button', { class: 'btn ghost small', type: 'button' }, 'Delete');
      del.addEventListener('click', async () => { if (confirm('Delete this message?')) { await db.from('messages').delete().eq('id', m.id); loadMessages(); } });
      list.append(h('article', { class: `row ${m.is_read ? '' : 'unread'}` },
        h('div', { class: 'head' }, h('strong', {}, m.name), h('span', { class: 'meta' }, `${when(m.created_at)} · ${m.lang ?? ''}`)),
        h('a', { href: `mailto:${m.email}` }, m.email), h('p', { class: 'msg' }, m.message),
        h('div', { class: 'actions' }, h('a', { class: 'btn small', href: `mailto:${m.email}?subject=Re: your message` }, 'Reply'), toggle, del)));
    }
  }

  /* ----- projects ----- */
  type P = { id: string; title: string; description: string; category: string; stack: string[]; live_url: string | null; code_url: string | null; status: string; sort_order: number; published: boolean };
  let editing: P | null = null;
  const dialog = $<HTMLDialogElement>('#project-dialog'); const form = $<HTMLFormElement>('#project-form');
  async function loadProjects() {
    const { data, error } = await db.from('projects').select('*').order('sort_order').order('created_at', { ascending: false });
    const list = $('#projects-list'); list.replaceChildren();
    if (error) return void list.append(h('p', { class: 'notice' }, `Could not load projects: ${error.message}`));
    if (!data?.length) return void list.append(h('p', { class: 'notice' }, 'No extra projects yet. Curated ones live in src/data/projects.ts.'));
    for (const p of data as P[]) {
      const edit = h('button', { class: 'btn ghost small', type: 'button' }, 'Edit'); edit.addEventListener('click', () => open(p));
      const del = h('button', { class: 'btn ghost small', type: 'button' }, 'Delete');
      del.addEventListener('click', async () => { if (confirm(`Delete "${p.title}"?`)) { await db.from('projects').delete().eq('id', p.id); loadProjects(); } });
      list.append(h('article', { class: 'row' },
        h('div', { class: 'head' }, h('strong', {}, p.title), h('span', { class: 'meta' }, `${p.category} · ${p.status}${p.published ? '' : ' · hidden'}`)),
        h('p', { class: 'msg' }, p.description), h('div', { class: 'actions' }, edit, del)));
    }
  }
  function open(p: P | null) {
    editing = p; form.reset(); $('#pd-status').textContent = ''; $('#pd-title').textContent = p ? 'Edit project' : 'Add project';
    const f = form.elements as unknown as Record<string, HTMLInputElement>;
    if (p) {
      f.title.value = p.title; f.description.value = p.description; f.category.value = p.category; f.stack.value = p.stack.join(', ');
      f.live_url.value = p.live_url ?? ''; f.code_url.value = p.code_url ?? ''; f.status.value = p.status; f.sort_order.value = String(p.sort_order); f.published.checked = p.published;
    }
    dialog.showModal();
  }
  $('#new-project').addEventListener('click', () => open(null));
  $('#pd-cancel').addEventListener('click', () => dialog.close());
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); const f = form.elements as unknown as Record<string, HTMLInputElement>; const btn = $<HTMLButtonElement>('#pd-save');
    const row = {
      title: f.title.value.trim(), description: f.description.value.trim(), category: f.category.value,
      stack: f.stack.value.split(',').map((s) => s.trim()).filter(Boolean),
      live_url: f.live_url.value.trim() || null, code_url: f.code_url.value.trim() || null,
      status: f.status.value, sort_order: parseInt(f.sort_order.value, 10) || 0, published: f.published.checked,
    };
    btn.disabled = true;
    const res = editing ? await db.from('projects').update(row).eq('id', editing.id) : await db.from('projects').insert(row);
    btn.disabled = false;
    if (res.error) { $('#pd-status').textContent = res.error.message; return; }
    dialog.close(); loadProjects();
  });

  /* ----- traffic ----- */
  async function loadTraffic() {
    const since = new Date(Date.now() - 30 * 864e5).toISOString();
    const { data, error } = await db.from('visits').select('path,lang,created_at').gte('created_at', since).order('created_at', { ascending: false }).limit(5000);
    const stats = $('#traffic-stats'), list = $('#traffic-list'); stats.replaceChildren(); list.replaceChildren();
    if (error) return void list.append(h('p', { class: 'notice' }, `Could not load traffic: ${error.message}`));
    const rows = data ?? []; const week = Date.now() - 7 * 864e5;
    const stat = (n: number, label: string) => h('div', { class: 'stat' }, h('b', {}, String(n)), h('span', {}, label));
    stats.append(stat(rows.length, 'Visits, 30 days'), stat(rows.filter((r) => +new Date(r.created_at) > week).length, 'Visits, 7 days'),
      stat(new Set(rows.map((r) => r.lang)).size, 'Languages used'), stat(new Set(rows.map((r) => r.path)).size, 'Pages seen'));
    const tally = (key: 'lang' | 'path') => Object.entries(rows.reduce<Record<string, number>>((a, r) => { const k = String(r[key] ?? '?'); a[k] = (a[k] ?? 0) + 1; return a; }, {})).sort((a, b) => b[1] - a[1]);
    for (const [title, key] of [['By language', 'lang'], ['Top pages', 'path']] as const)
      list.append(h('article', { class: 'row' }, h('strong', {}, title), ...tally(key).slice(0, 8).map(([k, n]) => h('div', { class: 'head' }, h('span', {}, k), h('span', { class: 'meta' }, String(n))))));
  }
}
