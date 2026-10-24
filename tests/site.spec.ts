import { test, expect, type Page } from '@playwright/test';

const LANGS = ['en', 'sw', 'fr', 'es'];
const repos = Array.from({ length: 7 }, (_, i) => ({
  name: `repo-${i}`, description: i === 0 ? 'First repo' : null, html_url: `https://github.com/emilioochieng/repo-${i}`,
  language: 'Python', stargazers_count: i, pushed_at: '2026-10-01T10:00:00Z', fork: i === 6,
}));
const articles = [{ title: 'Cleaning data with pandas', description: 'A practical guide', url: 'https://dev.to/x/cleaning', cover_image: null, social_image: null,
  published_at: '2026-09-01T10:00:00Z', reading_time_minutes: 5, public_reactions_count: 12, tag_list: ['python'] }];

async function mockFeeds(page: Page, opts: { articlesFail?: boolean } = {}) {
  await page.route('https://api.github.com/users/emilioochieng', (r) => r.fulfill({ json: { public_repos: 7 } }));
  await page.route('https://api.github.com/users/emilioochieng/repos*', (r) => r.fulfill({ json: repos }));
  await page.route('https://dev.to/api/articles*', (r) => (opts.articlesFail ? r.abort() : r.fulfill({ json: articles })));
  await page.route('https://test.supabase.co/rest/v1/projects*', (r) => r.fulfill({ json: [] }));
  await page.route('https://test.supabase.co/rest/v1/visits*', (r) => r.fulfill({ status: 201, body: '' }));
}

test('root page sends visitors to their browser language', async ({ browser }) => {
  const ctx = await browser.newContext({ locale: 'fr-FR' }); const page = await ctx.newPage();
  await mockFeeds(page); await page.goto('/');
  await expect(page).toHaveURL(/\/fr\/$/); await ctx.close();
});

test('unsupported browser language falls back to English', async ({ browser }) => {
  const ctx = await browser.newContext({ locale: 'ja-JP' }); const page = await ctx.newPage();
  await mockFeeds(page); await page.goto('/'); await expect(page).toHaveURL(/\/en\/$/); await ctx.close();
});

for (const lang of LANGS) {
  test(`${lang}: page renders with SEO tags`, async ({ page }) => {
    await mockFeeds(page); await page.goto(`/${lang}/`);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('h1')).toContainText('Emilio');
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', new RegExp(`/${lang}/$`));
    expect(await page.locator('link[rel=alternate][hreflang]').count()).toBe(5);
    const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
    expect(ld['@type']).toBe('Person');
  });
}

test('language switcher changes language and is remembered', async ({ page }) => {
  await mockFeeds(page); await page.goto('/en/');
  const before = await page.locator('.hero .lead').textContent();
  await page.selectOption('#lang-select', 'sw');
  await expect(page).toHaveURL(/\/sw\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'sw');
  expect(await page.locator('.hero .lead').textContent()).not.toBe(before);
  expect(await page.evaluate(() => localStorage.getItem('lang'))).toBe('sw');
  await page.goto('/'); await expect(page).toHaveURL(/\/sw\/$/);
});

test('theme toggle works and persists', async ({ page }) => {
  await mockFeeds(page); await page.goto('/en/');
  const before = await page.locator('html').getAttribute('data-theme');
  await page.click('#theme-toggle');
  const after = await page.locator('html').getAttribute('data-theme'); expect(after).not.toBe(before);
  await page.reload(); await expect(page.locator('html')).toHaveAttribute('data-theme', after!);
});

test('project filters show the right cards', async ({ page }) => {
  await mockFeeds(page); await page.goto('/en/');
  const visible = () => page.locator('#projects-grid .card:visible').count();
  expect(await visible()).toBe(9);
  await page.click('[data-filter=data]'); expect(await visible()).toBe(2);
  await page.click('[data-filter=education]'); expect(await visible()).toBe(2);
  await page.click('[data-filter=apps]'); expect(await visible()).toBe(5);
  await page.click('[data-filter=all]'); expect(await visible()).toBe(9);
});

test('extra projects from the dashboard are added to the grid', async ({ page }) => {
  await mockFeeds(page);
  await page.route('https://test.supabase.co/rest/v1/projects*', (r) => r.fulfill({ json: [{ id: '1', title: 'From dashboard', description: '<b>safe</b>', category: 'data', stack: ['SQL'], live_url: 'javascript:alert(1)', code_url: 'https://github.com/x/y', status: 'in-progress' }] }));
  await page.goto('/en/');
  const card = page.locator('#projects-grid .card', { hasText: 'From dashboard' });
  await expect(card).toBeVisible();
  await expect(card.locator('b')).toHaveCount(0);                       // text is not parsed as HTML
  await expect(card.locator('a')).toHaveCount(1);                       // javascript: link is dropped
});

test('live GitHub repositories and count', async ({ page }) => {
  await mockFeeds(page); await page.goto('/en/');
  await expect(page.locator('#repos .card')).toHaveCount(6);            // forks excluded
  await expect(page.locator('#repos')).toContainText('First repo');
  await expect(page.locator('#stat-repos')).toHaveText('7');
});

test('GitHub failure shows a friendly message', async ({ page }) => {
  await page.route('https://api.github.com/**', (r) => r.abort()); await page.route('https://dev.to/**', (r) => r.abort());
  await page.route('https://test.supabase.co/**', (r) => r.fulfill({ json: [] }));
  await page.goto('/fr/'); await expect(page.locator('#repos .notice')).toContainText('Impossible de charger');
});

test('dev.to articles render, and failures degrade gracefully', async ({ page }) => {
  await mockFeeds(page); await page.goto('/en/');
  await expect(page.locator('#articles .article-card')).toContainText('Cleaning data with pandas');
  await expect(page.locator('#articles')).toContainText('5 min read');
  const p2 = await page.context().newPage(); await mockFeeds(p2, { articlesFail: true }); await p2.goto('/es/');
  await expect(p2.locator('#articles .notice')).toContainText('No se pudieron cargar');
});

test.describe('contact form', () => {
  const fill = async (page: Page, over: Partial<Record<string, string>> = {}) => {
    await page.fill('#c-name', over.name ?? 'Amina'); await page.fill('#c-email', over.email ?? 'amina@example.com');
    await page.fill('#c-msg', over.msg ?? 'Hello, I would like to work together.');
  };
  test('validates input', async ({ page }) => {
    await mockFeeds(page); await page.goto('/en/'); await fill(page, { email: 'nope' }); await page.click('#c-send');
    await expect(page.locator('#c-status')).toContainText('valid email');
  });
  test('sends a message to the backend, then rate-limits', async ({ page }) => {
    await mockFeeds(page); const posts: any[] = [];
    await page.route('https://test.supabase.co/rest/v1/messages', (r) => { posts.push(r.request().postDataJSON()); return r.fulfill({ status: 201, body: '' }); });
    await page.goto('/sw/'); await fill(page); await page.click('#c-send');
    await expect(page.locator('#c-status')).toContainText('Asante');
    expect(posts).toHaveLength(1); expect(posts[0]).toMatchObject({ name: 'Amina', email: 'amina@example.com', lang: 'sw' });
    await fill(page); await page.click('#c-send'); await expect(page.locator('#c-status')).toContainText('subiri');
    expect(posts).toHaveLength(1);
  });
  test('shows an error when the server rejects it', async ({ page }) => {
    await mockFeeds(page); await page.route('https://test.supabase.co/rest/v1/messages', (r) => r.fulfill({ status: 500, body: '{}' }));
    await page.goto('/en/'); await fill(page); await page.click('#c-send'); await expect(page.locator('#c-status')).toContainText('could not be sent');
  });
  test('ignores bots that fill the honeypot', async ({ page }) => {
    await mockFeeds(page); let hit = false; await page.route('https://test.supabase.co/rest/v1/messages', (r) => { hit = true; return r.fulfill({ status: 201, body: '' }); });
    await page.goto('/en/'); await fill(page); await page.evaluate(() => ((document.querySelector('input[name=website]') as HTMLInputElement).value = 'spam'));
    await page.click('#c-send'); expect(hit).toBe(false);
  });
});

test('visit is recorded once per page per session', async ({ page }) => {
  await mockFeeds(page); let n = 0;
  await page.route('https://test.supabase.co/rest/v1/visits*', (r) => { n++; return r.fulfill({ status: 201, body: '' }); });
  await page.goto('/en/'); await page.reload(); await page.waitForTimeout(300); expect(n).toBe(1);
});

for (const lang of LANGS) {
  test(`${lang}: no horizontal scroll on a 375px phone`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } }); const page = await ctx.newPage();
    await mockFeeds(page); await page.goto(`/${lang}/`); await page.waitForSelector('#repos .card');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await ctx.close();
  });
}

test('mobile menu opens and navigates', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } }); const page = await ctx.newPage();
  await mockFeeds(page); await page.goto('/en/');
  await expect(page.locator('#nav')).toBeHidden(); await page.click('#burger');
  await expect(page.locator('#nav')).toBeVisible(); await page.click('#nav a[data-nav=contact]');
  await expect(page.locator('#nav')).toBeHidden(); await expect(page.locator('#contact')).toBeInViewport(); await ctx.close();
});

test('social links point to the right accounts', async ({ page }) => {
  await mockFeeds(page); await page.goto('/en/');
  await expect(page.locator('.social[href*="github.com/emilioochieng"]')).toHaveCount(1);
  await expect(page.locator('.social[href*="linkedin.com/in/emilio-ochieng-3b11b73ab"]')).toHaveCount(1);
  await expect(page.locator('.social[href^="https://wa.me/"]')).toHaveCount(1);
  await expect(page.locator('.social[href^="mailto:"]')).toHaveCount(1);
});

test('admin: login is required and wrong credentials are rejected', async ({ page }) => {
  await page.route('https://test.supabase.co/auth/v1/**', (r) => r.fulfill({ status: 400, json: { error: 'invalid_grant', error_description: 'Invalid login credentials' } }));
  await page.goto('/admin/');
  await expect(page.locator('#login')).toBeVisible(); await expect(page.locator('#app')).toBeHidden();
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', /noindex/);
  await page.fill('#l-email', 'a@b.co'); await page.fill('#l-pass', 'wrong'); await page.click('#login-form button');
  await expect(page.locator('#login-status')).toContainText('Sign-in failed'); await expect(page.locator('#app')).toBeHidden();
});

test('admin: a signed-in admin sees messages and can mark them read', async ({ page }) => {
  const user = { id: 'u1', aud: 'authenticated', role: 'authenticated', email: 'a@b.co', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
  await page.route('https://test.supabase.co/auth/v1/token*', (r) => r.fulfill({ json: { access_token: 'a.b.c', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: 'r', user } }));
  await page.route('https://test.supabase.co/auth/v1/user*', (r) => r.fulfill({ json: user }));
  await page.route('https://test.supabase.co/rest/v1/admins*', (r) => r.fulfill({ json: { user_id: 'u1' } }));
  let read = false;
  await page.route('https://test.supabase.co/rest/v1/messages*', (r) => {
    if (r.request().method() === 'PATCH') { read = true; return r.fulfill({ status: 204, body: '' }); }
    return r.fulfill({ json: [{ id: 'm1', name: 'Amina', email: 'amina@example.com', message: 'Hello there', lang: 'en', is_read: false, created_at: '2026-10-20T10:00:00Z' }] });
  });
  await page.route('https://test.supabase.co/rest/v1/projects*', (r) => r.fulfill({ json: [] }));
  await page.route('https://test.supabase.co/rest/v1/visits*', (r) => r.fulfill({ json: [{ path: '/en/', lang: 'en', created_at: new Date().toISOString() }] }));
  await page.goto('/admin/'); await page.fill('#l-email', 'a@b.co'); await page.fill('#l-pass', 'secret'); await page.click('#login-form button');
  await expect(page.locator('#app')).toBeVisible(); await expect(page.locator('#messages-list')).toContainText('Hello there');
  await expect(page.locator('#unread')).toHaveText('1');
  await page.click('text=Mark read'); await expect.poll(() => read).toBe(true);
  await page.click('[data-tab=traffic]'); await expect(page.locator('#traffic-stats')).toContainText('Visits, 30 days');
});
