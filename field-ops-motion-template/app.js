(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const appShell = $('#appShell');
  const sidebarToggle = $('#sidebarToggle');
  const toastRegion = $('#toastRegion');
  const taskDrawer = $('#taskDrawer');
  const drawerBackdrop = $('#drawerBackdrop');
  const drawerClose = $('#drawerClose');
  const drawerCancel = $('#drawerCancel');
  const drawerSave = $('#drawerSave');
  const drawerTaskTitle = $('#drawerTaskTitle');
  const drawerOwner = $('#drawerOwner');
  const modalBackdrop = $('#modalBackdrop');
  const modalClose = $('#modalClose');
  const modalCancel = $('#modalCancel');
  const addTaskButton = $('#addTaskButton');
  const taskForm = $('#taskForm');
  const commandBackdrop = $('#commandBackdrop');
  const commandButton = $('#commandButton');
  const commandInput = $('#commandInput');
  const projectSwitcher = $('#projectSwitcher');

  let toastTimer = null;

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastRegion.append(toast);

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('leaving');
      setTimeout(() => toast.remove(), 240);
    }, 2300);
  }

  function setModalState(open) {
    modalBackdrop.classList.toggle('open', open);
    modalBackdrop.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) setTimeout(() => $('[name="taskName"]', taskForm)?.focus(), 120);
  }

  function setCommandState(open) {
    commandBackdrop.classList.toggle('open', open);
    commandBackdrop.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      commandInput.value = '';
      setTimeout(() => commandInput.focus(), 80);
    }
  }

  function setDrawerState(open, task = '', owner = '') {
    taskDrawer.classList.toggle('open', open);
    drawerBackdrop.classList.toggle('open', open);
    taskDrawer.setAttribute('aria-hidden', String(!open));
    if (task) drawerTaskTitle.textContent = task;
    if (owner) drawerOwner.textContent = owner;
  }

  function closeOverlays() {
    setModalState(false);
    setCommandState(false);
    setDrawerState(false);
  }

  sidebarToggle?.addEventListener('click', () => {
    const collapsed = appShell.classList.toggle('sidebar-collapsed');
    sidebarToggle.setAttribute('aria-label', collapsed ? 'サイドバーを展開する' : 'サイドバーを折りたたむ');
  });

  $$('.nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      $$('.nav-item').forEach((node) => node.classList.remove('active'));
      item.classList.add('active');
      const label = item.textContent.trim().replace(/\s+/g, ' ');
      showToast(`${label} に切り替えました`);
    });
  });

  $$('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach((node) => {
        node.classList.remove('active');
        node.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      showToast(`${tab.textContent.trim()} タブを選択しました`);
    });
  });

  $$('.segmented button').forEach((button) => {
    button.addEventListener('click', () => {
      $$('.segmented button').forEach((node) => node.classList.remove('active'));
      button.classList.add('active');
      showToast(`${button.textContent}表示に切り替えました`);
    });
  });

  $$('.stage').forEach((stage, index, stages) => {
    stage.addEventListener('click', () => {
      stages.forEach((node, nodeIndex) => {
        node.classList.toggle('done', nodeIndex < index);
        node.classList.toggle('active', nodeIndex === index);
      });
      showToast(`案件ステータス: ${stage.dataset.stage}`);
    });
  });

  $$('.group-row').forEach((row) => {
    row.addEventListener('click', () => {
      const group = row.closest('.gantt-group');
      const collapsed = group.classList.toggle('collapsed');
      group.classList.toggle('expanded', !collapsed);
    });
  });

  function bindDrawerTriggers(root = document) {
    $$('[data-task]', root).forEach((row) => {
      if (row.dataset.drawerBound === 'true') return;
      row.dataset.drawerBound = 'true';
      row.addEventListener('click', (event) => {
        if (event.target.closest('.gantt-bar')) return;
        setDrawerState(true, row.dataset.task, row.dataset.owner || '未設定');
      });
    });
  }
  bindDrawerTriggers();

  [drawerClose, drawerCancel, drawerBackdrop].forEach((node) => node?.addEventListener('click', () => setDrawerState(false)));
  drawerSave?.addEventListener('click', () => {
    setDrawerState(false);
    showToast('工程の変更を保存しました');
  });

  addTaskButton?.addEventListener('click', () => setModalState(true));
  [modalClose, modalCancel].forEach((node) => node?.addEventListener('click', () => setModalState(false)));
  modalBackdrop?.addEventListener('click', (event) => {
    if (event.target === modalBackdrop) setModalState(false);
  });

  commandButton?.addEventListener('click', () => setCommandState(true));
  commandBackdrop?.addEventListener('click', (event) => {
    if (event.target === commandBackdrop) setCommandState(false);
  });

  $$('.command-results button').forEach((button, index) => {
    button.addEventListener('click', () => {
      setCommandState(false);
      if (index === 0) setTimeout(() => setModalState(true), 120);
      else if (index === 1) $('#gantt')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else showToast('設備図面 Rev.04 を開きました');
    });
  });

  commandInput?.addEventListener('input', () => {
    const query = commandInput.value.trim().toLowerCase();
    $$('.command-results button').forEach((button) => {
      const matches = !query || button.textContent.toLowerCase().includes(query);
      button.hidden = !matches;
    });
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      setCommandState(!commandBackdrop.classList.contains('open'));
      return;
    }
    if (event.key === 'Escape') closeOverlays();
  });

  function dateToColumn(dateValue) {
    const baseline = new Date('2026-11-02T00:00:00');
    const current = new Date(`${dateValue}T00:00:00`);
    const diff = Math.round((current - baseline) / 86400000);
    return Math.min(7, Math.max(1, diff + 1));
  }

  function spanBetween(start, end) {
    const startDate = new Date(`${start}T00:00:00`);
    const endDate = new Date(`${end}T00:00:00`);
    return Math.min(7, Math.max(1, Math.round((endDate - startDate) / 86400000) + 1));
  }

  taskForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(taskForm);
    const name = String(formData.get('taskName') || '').trim();
    const start = String(formData.get('start'));
    const end = String(formData.get('end'));
    const owner = String(formData.get('owner'));
    if (!name) return;

    const group = $('.gantt-group');
    const startColumn = dateToColumn(start);
    const span = Math.min(spanBetween(start, end), 8 - startColumn);
    const initials = owner.split(/\s+/).map((part) => part[0]).join('').slice(0, 2);
    const row = document.createElement('div');
    row.className = 'task-row';
    row.dataset.task = name;
    row.dataset.owner = owner;
    row.innerHTML = `
      <div class="task-info">
        <span class="task-state pending"></span>
        <div><strong></strong><small><span class="tiny-avatar"></span> <span class="owner-name"></span></small></div>
      </div>
      <div class="timeline-grid">
        <button class="gantt-bar slate draggable" type="button" style="--start: ${startColumn}; --span: ${span}">
          <span>予定</span><i class="bar-handle left"></i><i class="bar-handle right"></i>
        </button>
      </div>`;
    $('strong', row).textContent = name;
    $('.tiny-avatar', row).textContent = initials;
    $('.owner-name', row).textContent = owner;
    group.append(row);
    bindDrawerTriggers(row);
    bindScheduleGestures(row);
    setModalState(false);
    taskForm.reset();
    showToast(`「${name}」を工程表に追加しました`);
    row.animate([
      { opacity: 0, transform: 'translateY(-8px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' });
  });

  projectSwitcher?.addEventListener('click', () => {
    document.body.classList.add('is-loading');
    setTimeout(() => {
      document.body.classList.remove('is-loading');
      showToast('案件データを同期しました');
    }, 520);
  });

  function createDragGhost(text) {
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    ghost.textContent = text;
    document.body.append(ghost);
    return ghost;
  }

  function readCssNumber(element, property) {
    return Number.parseInt(getComputedStyle(element).getPropertyValue(property), 10) || 1;
  }

  function bindScheduleGestures(root = document) {
    $$('.gantt-bar.draggable', root).forEach((bar) => {
      if (bar.dataset.gestureBound === 'true') return;
      bar.dataset.gestureBound = 'true';

      bar.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const timeline = bar.closest('.timeline-grid');
        const handle = event.target.closest('.bar-handle');
        const mode = handle?.classList.contains('right') ? 'resize-right' : handle?.classList.contains('left') ? 'resize-left' : 'move';
        const rect = timeline.getBoundingClientRect();
        const dayWidth = rect.width / 7;
        const initialX = event.clientX;
        const initialStart = readCssNumber(bar, '--start');
        const initialSpan = readCssNumber(bar, '--span');
        let nextStart = initialStart;
        let nextSpan = initialSpan;
        const label = $('span', bar)?.textContent || '工程';
        const ghost = createDragGhost(mode === 'move' ? '工程を移動' : '期間を変更');

        bar.classList.add('dragging');
        bar.setPointerCapture?.(event.pointerId);

        const move = (moveEvent) => {
          const deltaDays = Math.round((moveEvent.clientX - initialX) / dayWidth);

          if (mode === 'move') {
            nextStart = Math.max(1, Math.min(8 - initialSpan, initialStart + deltaDays));
            nextSpan = initialSpan;
          }
          if (mode === 'resize-right') {
            nextSpan = Math.max(1, Math.min(8 - initialStart, initialSpan + deltaDays));
          }
          if (mode === 'resize-left') {
            const end = initialStart + initialSpan;
            nextStart = Math.max(1, Math.min(end - 1, initialStart + deltaDays));
            nextSpan = Math.max(1, end - nextStart);
          }

          bar.style.setProperty('--start', nextStart);
          bar.style.setProperty('--span', nextSpan);
          ghost.style.left = `${moveEvent.clientX}px`;
          ghost.style.top = `${moveEvent.clientY}px`;
          ghost.textContent = `${mode === 'move' ? '開始' : '期間'}: ${nextStart}日目 / ${nextSpan}日`;
        };

        const end = () => {
          bar.classList.remove('dragging');
          ghost.remove();
          document.removeEventListener('pointermove', move);
          document.removeEventListener('pointerup', end);
          document.removeEventListener('pointercancel', end);
          if (nextStart !== initialStart || nextSpan !== initialSpan) showToast(`${label} の日程を更新しました`);
        };

        document.addEventListener('pointermove', move);
        document.addEventListener('pointerup', end, { once: true });
        document.addEventListener('pointercancel', end, { once: true });
      });
    });
  }
  bindScheduleGestures();
})();
