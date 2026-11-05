/* FIELDGRID marketing UI study: no user data or external APIs are sent. */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const menuButton = $('#mobileMenuButton');
  const mobileMenu = $('#mobileMenu');
  const navigationLinks = $$('.mobile-menu a');

  function closeMenu() {
    if (!menuButton || !mobileMenu) return;
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'メニューを開く');
  }
  function openMenu() {
    if (!menuButton || !mobileMenu) return;
    mobileMenu.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'メニューを閉じる');
  }
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      if (mobileMenu.hidden) openMenu();
      else closeMenu();
    });
    navigationLinks.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !mobileMenu.hidden) {
        closeMenu();
        menuButton.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!mobileMenu.hidden && !event.target.closest('.site-header')) closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 950 && !mobileMenu.hidden) closeMenu();
    });
  }

  // This data is original UI demonstration content, not a claim that the SaaS
  // features have been implemented or that any KANNA screenshot is embedded.
  const features = {
    projects: {
      number: '01 / 06',
      title: '複数案件を、同じ視点で把握。',
      description: '現場ごとの進捗と担当を一覧化。何を先に確認するか、ひと目で分かる構成です。',
      points: ['進捗と担当状況をまとめる', 'ステータスごとに絞り込む', '案件単位で情報を整理する'],
      eyebrow: 'PROJECTS', demoTitle: '現場一覧', action: '＋ 現場を追加', count: '3 PROJECTS',
      rows: [['01', '神山テラス改修', '進行中'], ['02', '東町オフィス新築', '準備中'], ['03', '南山設備更新', '確認待ち']]
    },
    schedule: {
      number: '02 / 06',
      title: '工程の前後関係まで、見渡せる。',
      description: 'スケジュールの全体像と、これから着手する作業をひとつの画面で確認します。',
      points: ['日付と進捗を一覧化', '変更した工程を見つけやすくする', '次に必要な作業が分かる'],
      eyebrow: 'SCHEDULE', demoTitle: '工程一覧', action: '期間を変更', count: '3 TASKS',
      rows: [['01', '仮設・準備工事', '11/04–11/08'], ['02', '基礎工事', '11/09–11/20'], ['03', '建方', '11/21–11/27']]
    },
    files: {
      number: '03 / 06',
      title: '必要な図面へ、迷わず到達。',
      description: '写真や資料を現場と結びつけ、更新日と種類で見つけられるように設計します。',
      points: ['案件ごとの資料分類', '更新情報とファイル種別を表示', '図面・写真の所在を明確化'],
      eyebrow: 'FILES', demoTitle: '現場資料', action: '＋ 資料を追加', count: '3 FILES',
      rows: [['PDF', '施工図面_改訂版', '11/05 更新'], ['IMG', '現場写真_南側', '11/04 更新'], ['XLS', '資材確認表', '11/03 更新']]
    },
    reports: {
      number: '04 / 06',
      title: '報告を、現場の流れのなかに。',
      description: '入力する項目と確認する情報を分けることで、必要な報告を短時間でまとめます。',
      points: ['報告ステータスを表示', '入力項目を目的ごとに整理', '未提出の書類を一覧化'],
      eyebrow: 'REPORTS', demoTitle: '報告書一覧', action: '＋ 報告書を作成', count: '3 REPORTS',
      rows: [['01', '11月5日 現場日報', '下書き'], ['02', '安全確認チェック', '確認中'], ['03', '設備点検報告', '提出済み']]
    },
    chat: {
      number: '05 / 06',
      title: '伝える内容と相手を、明確に。',
      description: '案件に紐づいた連絡をまとめることで、確認漏れを減らす画面構成です。',
      points: ['現場単位でやり取りを分類', '担当者と確認状態を表示', '大切な更新の見落としを防ぐ'],
      eyebrow: 'COMMUNICATION', demoTitle: '現場の連絡', action: '＋ 連絡を作成', count: '3 THREADS',
      rows: [['AM', '工程変更の確認', '要返信'], ['PM', '搬入予定について', '共有済み'], ['QA', '点検写真の確認', '完了']]
    },
    approval: {
      number: '06 / 06',
      title: '確認が必要な仕事を、先に。',
      description: '申請・承認・差し戻しのステータスを一覧化し、次の担当を分かりやすくします。',
      points: ['確認待ちを優先表示', '担当者を明確にする', '処理状況を一目で把握'],
      eyebrow: 'APPROVAL', demoTitle: '確認依頼', action: '＋ 確認を依頼', count: '3 REQUESTS',
      rows: [['01', '工程変更の承認', '確認待ち'], ['02', '安全計画の更新', '確認中'], ['03', '点検報告の提出', '承認済み']]
    }
  };

  const tabs = $$('.feature-tab');
  const panel = $('#featurePanel');

  function createRow(parts) {
    const item = document.createElement('div');
    item.className = 'demo-item';
    const icon = document.createElement('span');
    icon.className = 'demo-item-icon';
    icon.textContent = parts[0];
    const name = document.createElement('span');
    name.textContent = parts[1];
    const status = document.createElement('b');
    status.textContent = parts[2];
    item.append(icon, name, status);
    return item;
  }

  function showFeature(key, focusTab = false) {
    if (!Object.prototype.hasOwnProperty.call(features, key) || !panel) return;
    const item = features[key];
    const active = tabs.find(tab => tab.dataset.feature === key);
    if (!active) return;

    tabs.forEach(tab => {
      const selected = tab === active;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    if (focusTab) active.focus();
    panel.setAttribute('aria-labelledby', active.id);
    $('#featureNumber').textContent = item.number;
    $('#featureTitle').textContent = item.title;
    $('#featureDescription').textContent = item.description;
    $('#demoEyebrow').textContent = item.eyebrow;
    $('#demoTitle').textContent = item.demoTitle;
    $('#demoAction').textContent = item.action;
    $('#demoCount').textContent = item.count;

    const points = $('#featurePoints');
    points.replaceChildren();
    item.points.forEach(value => {
      const li = document.createElement('li');
      li.textContent = value;
      points.appendChild(li);
    });
    const list = $('#demoList');
    list.replaceChildren(...item.rows.map(createRow));

    panel.classList.remove('is-switching');
    void panel.offsetWidth;
    panel.classList.add('is-switching');
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showFeature(tab.dataset.feature));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      showFeature(tabs[next].dataset.feature, true);
    });
  });

  // Reveal content is progressive enhancement: without IntersectionObserver
  // all sections remain visible.
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const reveals = $$('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
    document.documentElement.classList.add('js-ready');
    reveals.forEach(el => observer.observe(el));
  }

  // Highlight section links for people who navigate by scrolling.
  const sectionLinks = $$('.desktop-nav a');
  if ('IntersectionObserver' in window && sectionLinks.length) {
    const targets = sectionLinks
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-25% 0px -60% 0px' });
    targets.forEach(el => navObserver.observe(el));
  }
})();
