import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Script } from 'node:vm';

const root = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(root, 'index.html'), 'utf8');
const css = readFileSync(join(root, 'styles.css'), 'utf8');
const js = readFileSync(join(root, 'app.js'), 'utf8');
const tokens = JSON.parse(readFileSync(join(root, 'tokens.json'), 'utf8'));

test('JavaScript syntax is valid', () => assert.doesNotThrow(() => new Script(js)));

test('all page-local anchors have a matching unique id', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Duplicate element id found');
  const links = [...html.matchAll(/\bhref="#([^"]+)"/g)].map(match => match[1]);
  assert.ok(links.length > 20, 'Too few navigation destinations');
  for (const id of links) assert.ok(ids.includes(id), 'Missing target #' + id);
});

test('main content is organized into the complete LP journey', () => {
  for (const id of ['main', 'problems', 'solutions', 'features', 'workflow',
    'outcomes', 'scenarios', 'faq', 'contact', 'sample']) {
    assert.ok(html.includes('id="' + id + '"'), 'Missing #' + id);
  }
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
});

test('six interactive feature tabs and panel exist', () => {
  for (const key of ['projects', 'schedule', 'files', 'reports', 'chat', 'approval']) {
    assert.match(html, new RegExp('data-feature="' + key + '"'));
    assert.match(js, new RegExp('(?:^|\\n)\\s*' + key + ':\\s*\\{'));
  }
  assert.equal((html.match(/role="tab"/g) || []).length, 6);
  assert.match(html, /role="tabpanel"/);
  assert.match(js, /ArrowLeft/);
  assert.match(js, /ArrowRight/);
  assert.match(js, /Home/);
  assert.match(js, /End/);
});

test('mobile navigation has accessible disclosure state', () => {
  assert.match(html, /id="mobileMenuButton"[^>]*aria-expanded="false"/);
  assert.match(html, /id="mobileMenu"[^>]*hidden/);
  assert.match(js, /Escape/);
  assert.match(js, /closeMenu/);
});

test('responsive layout and reduced-motion support exist', () => {
  for (const width of tokens.breakpoints) {
    assert.ok(css.includes('@media(max-width:' + width + 'px)'), 'Missing breakpoint ' + width);
  }
  assert.match(css, /prefers-reduced-motion/);
  assert.match(js, /IntersectionObserver/);
  assert.match(css, /focus-visible/);
  assert.match(html, /class="skip-link"/);
});

test('accessibility and disclosure content is present', () => {
  assert.match(html, /<details>/);
  assert.match(html, /公式サイトですか/);
  assert.match(html, /サンプルデータ/);
  assert.match(html, /サーバー処理や認証は実装していません/);
});

test('no third-party static assets or scripts are embedded', () => {
  assert.doesNotMatch(html, /<img\b[^>]*src=["']https?:/i);
  assert.doesNotMatch(html, /<script\b[^>]*src=["']https?:/i);
  assert.doesNotMatch(css, /url\(["']?https?:\/\//i);
});

test('template tokens and structural components are documented', () => {
  assert.equal(tokens.colors.brand, '#155b48');
  assert.ok(tokens.components.includes('Hero'));
  assert.ok(tokens.components.includes('FeatureTabs'));
  assert.ok(tokens.components.includes('FaqAccordion'));
});
