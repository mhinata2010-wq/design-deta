const data = window.SAAS_DATA || [];

const patterns = {
  field: {
    name: 'Field operations',
    description: '現場起点の案件一覧、工程、タスク、写真、協力会社連携を短い導線で束ねるパターン。',
    reuse: ['案件切替を常時表示', '今日の作業とAttentionを近接', '大きいタップターゲット', '現場→事務所の共有導線']
  },
  visual: {
    name: 'Drawing & visual workspace',
    description: '図面・写真・検査を主役にし、ファイルではなく現場の場所や指摘単位で情報を扱うパターン。',
    reuse: ['図面を最大面積で表示', 'ピン・検査・写真を重ねる', '左右ペインで詳細を展開', '現場で迷わない単純なツールバー']
  },
  schedule: {
    name: 'Scheduling & controls',
    description: '工程表を主役に、依存関係・遅延・Lookahead・What-ifを同一文脈で扱うパターン。',
    reuse: ['工程バーを直接操作', '遅延とクリティカル項目を強調', 'Lookaheadを近接表示', '変更前後の差分を確認']
  },
  erp: {
    name: 'Construction ERP',
    description: '案件・見積・原価・請求・顧客を経営指標までつなぐ、情報密度の高いバックオフィス型パターン。',
    reuse: ['案件損益を最上段に配置', '一覧から詳細へ段階表示', 'ステータスと金額を同時表示', '日常業務を1画面に集約']
  },
  enterprise: {
    name: 'Enterprise project controls',
    description: '巨大案件や複数組織を前提に、ドキュメント、承認、コスト、リスクを厳格に管理するパターン。',
    reuse: ['グローバルナビ＋ローカルナビ', '監査可能なActivity', '役割別のKPI', '大量情報をテーブル中心で整理']
  },
  bim: {
    name: 'BIM / CDE workspace',
    description: '3Dモデル、Issue、図面、変更履歴を同一空間で扱い、設計と施工の認識差を減らすパターン。',
    reuse: ['モデルを中心に据える', 'Issueを座標と紐付ける', '2D/3D切替を近接', '履歴と担当者を常に追える']
  },
  safety: {
    name: 'Safety & compliance',
    description: '安全書類、入退場、点検、是正を期限と責任者で追うコンプライアンス型パターン。',
    reuse: ['未提出・期限超過を即時可視化', '会社・作業員単位で追跡', 'チェックリストをモバイル優先', '証跡をActivityに残す']
  },
  workforce: {
    name: 'Workforce planning',
    description: '人員・技能・時間・機材をプロジェクト横断で配置するリソース計画型パターン。',
    reuse: ['人員配置をタイムライン表示', '空きと過負荷を色ではなく形でも表現', '現場別の必要人数を比較', '勤怠と配置を分離しすぎない']
  },
  ai: {
    name: 'AI / reality intelligence',
    description: '現場画像や実績データをAIで解析し、進捗・リスク・差分を意思決定に変換するパターン。',
    reuse: ['現況画像と計画を並列比較', 'AIの確信度を表示', '異常だけをAttentionへ集約', '人が確認・承認できる導線']
  },
  precon: {
    name: 'Preconstruction',
    description: '入札前の案件発見、協力会社、見積依頼、比較、選定を高速化するパターン。',
    reuse: ['案件パイプラインを可視化', 'Bid期限を強調', '協力会社比較を横並び', '未回答を自動で追跡']
  },
  estimate: {
    name: 'Estimating & takeoff',
    description: '図面から数量拾い、見積、原価比較へ最短で移る積算特化パターン。',
    reuse: ['図面と数量表を同時表示', '計測ツールを常時アクセス可能に', '原価差分を即時反映', 'AI提案を人が編集可能に']
  },
  commercial: {
    name: 'Commercial & risk',
    description: '変更契約、与信、契約書、リスクを金額インパクトと承認状態で扱うパターン。',
    reuse: ['金額インパクトを最優先', '承認フローを時系列表示', 'リスクと根拠資料を隣接', '未確定金額を明示']
  },
  procurement: {
    name: 'Procurement',
    description: '資材の依頼・見積・発注・配送・受領を現場スケジュールとつなぐ調達型パターン。',
    reuse: ['必要日を起点に逆算', '発注状態をステップ表示', '価格と納期を同時比較', '現場受領まで追跡']
  },
  practice: {
    name: 'Architecture practice management',
    description: '設計事務所の時間、フィー、稼働、案件収益をシンプルな経営指標に変換するパターン。',
    reuse: ['プロジェクト収益性を一目で確認', '時間入力を軽量化', 'スタッフ稼働率を比較', '設計フェーズと予算を連動']
  }
};

const $ = (selector) => document.querySelector(selector);
const catalogList = $('#catalogList');
const searchInput = $('#searchInput');
const marketFilter = $('#marketFilter');
const archetypeFilter = $('#archetypeFilter');
const productPreview = $('#productPreview');
const previewViewport = $('#previewViewport');
let activeId = 1;

function tone(item) {
  const hues = [18, 32, 48, 156, 188, 212, 236, 266, 292, 326];
  const hue = hues[(item.id * 7) % hues.length];
  return { hue, hue2: (hue + 42 + item.id) % 360 };
}

function initials(text) {
  return text.split(/\s|\//).filter(Boolean).slice(0,2).map(v => v[0]).join('').toUpperCase();
}

function shell(item, body, options = {}) {
  const t = tone(item);
  const nav = options.nav || ['Overview', 'Projects', 'Tasks', 'Reports'];
  return `
    <div class="mock-app" style="--accent-h:${t.hue};--accent2-h:${t.hue2}">
      <aside class="mock-sidebar">
        <div class="mock-logo"><span>${initials(item.product)}</span><b>${item.product}</b></div>
        <div class="mock-project">Project <strong>${['Harbor','Central','North','Riverside','A-12'][item.id % 5]}</strong><small>ACTIVE SITE</small></div>
        <nav>${nav.map((n,i)=>`<button class="${i===0?'active':''}"><span>${['⌂','▦','✓','◫','◎','◇'][i%6]}</span>${n}</button>`).join('')}</nav>
        <div class="mock-sidebar-bottom"><span class="avatar">${initials(item.company)}</span><div><b>Site team</b><small>Synced just now</small></div></div>
      </aside>
      <section class="mock-main">
        <header class="mock-topbar"><div><small>${item.company}</small><strong>${options.title || 'Project workspace'}</strong></div><div class="mock-top-actions"><button>Search</button><button class="accent-btn">+ Add</button></div></header>
        ${body}
      </section>
    </div>`;
}

function kpi(label, value, delta) {
  return `<div class="kpi"><span>${label}</span><strong>${value}</strong><small>${delta}</small></div>`;
}

function fieldPreview(item) {
  return shell(item, `
    <div class="mock-content">
      <div class="kpi-row">${kpi('Planned','82%','+6 this week')}${kpi('Complete','68%','14 tasks open')}${kpi('Attention','07','2 urgent')}</div>
      <div class="two-col">
        <section class="panel"><div class="panel-head"><b>Today on site</b><span>Tue 03</span></div>
          ${['Concrete pour · Level 3','MEP rough-in · East wing','Facade inspection'].map((x,i)=>`<div class="task-row"><span class="task-check ${i===0?'done':''}"></span><div><b>${x}</b><small>${i+4} people · ${8+i}:00</small></div><em>${['Done','In progress','Next'][i]}</em></div>`).join('')}
        </section>
        <section class="panel"><div class="panel-head"><b>Attention queue</b><span>Live</span></div>
          <div class="attention-card danger"><b>Schedule risk</b><p>Drywall starts 2 days late if inspection moves.</p><button>Review impact</button></div>
          <div class="attention-card"><b>3 photos need review</b><p>Uploaded from East wing.</p></div>
        </section>
      </div>
      <section class="panel timeline-panel"><div class="panel-head"><b>6-day lookahead</b><span>Drag bars to plan</span></div><div class="mini-gantt">${[0,1,2,3].map((x)=>`<div class="gantt-row"><label>${['Structure','MEP','Facade','Interior'][x]}</label><div class="gantt-track"><span style="left:${8+x*9}%;width:${28+x*5}%"></span></div></div>`).join('')}</div></section>
    </div>`, {title:'Field overview', nav:['Today','Schedule','Photos','People','Reports']});
}

function visualPreview(item) {
  return shell(item, `
    <div class="visual-workspace">
      <div class="drawing-toolbar"><button>Pointer</button><button>Pin</button><button>Measure</button><button>Markup</button><span>Level 02 / Floor plan</span></div>
      <div class="drawing-canvas">
        <div class="plan-lines"><span></span><span></span><span></span><span></span><span></span><span></span></div>
        ${[1,2,3,4].map((n)=>`<button class="plan-pin p${n}">${n}</button>`).join('')}
        <div class="zoom-controls"><button>+</button><button>−</button></div>
      </div>
      <aside class="issue-panel"><div class="panel-head"><b>Issues</b><span>12 open</span></div>${['Door clearance','Ceiling finish','Fire seal'].map((x,i)=>`<div class="issue"><span>${i+1}</span><div><b>${x}</b><small>Assigned · Level 02</small></div><em>${i===0?'High':'Open'}</em></div>`).join('')}<button class="full-button">+ New issue</button></aside>
    </div>`, {title:'Drawing workspace', nav:['Drawings','Photos','Inspections','Issues','Files']});
}

function schedulePreview(item) {
  return shell(item, `
    <div class="mock-content schedule-content">
      <div class="kpi-row">${kpi('Finish','Mar 28','Baseline Mar 26')}${kpi('Variance','+2d','Recoverable')}${kpi('Critical','11','3 changed')}</div>
      <section class="panel gantt-large"><div class="panel-head"><div><b>Master schedule</b><small>Baseline vs current</small></div><div><button>Week</button><button>What-if</button></div></div>
        <div class="gantt-grid-head"><span>Activity</span>${['M','T','W','T','F','S','S'].map(d=>`<b>${d}</b>`).join('')}</div>
        ${['Structure L3','MEP rough-in','Inspection','Drywall','Ceiling close'].map((x,i)=>`<div class="gantt-line"><label><b>${x}</b><small>${i%2?'Trade partner':'Main contractor'}</small></label><div class="gantt-week"><i class="baseline" style="left:${5+i*4}%;width:${30+i*2}%"></i><i class="current ${i===2?'critical':''}" style="left:${10+i*5}%;width:${26+i*3}%"></i></div></div>`).join('')}
      </section>
      <div class="two-col"><section class="panel"><div class="panel-head"><b>Constraints</b><span>5 open</span></div><div class="list-line"><span>Inspection approval</span><em>Due tomorrow</em></div><div class="list-line"><span>Material delivery</span><em>Thu 05</em></div></section><section class="panel"><div class="panel-head"><b>Recovery options</b><span>AI assisted</span></div><div class="recovery"><strong>Recover 1.5 days</strong><p>Overlap ceiling prep with MEP zone B.</p><button>Simulate</button></div></section></div>
    </div>`, {title:'Schedule controls', nav:['Schedule','Lookahead','Constraints','Scenarios','Reports']});
}

function erpPreview(item) {
  return shell(item, `
    <div class="mock-content">
      <div class="kpi-row">${kpi('Revenue','¥42.8M','Forecast +4.2%')}${kpi('Gross profit','18.6%','Target 20%')}${kpi('Receivables','¥8.4M','3 overdue')}</div>
      <div class="two-col wide-left"><section class="panel"><div class="panel-head"><b>Projects</b><button>View all</button></div><div class="table-head"><span>Project</span><span>Status</span><span>Cost</span><span>Margin</span></div>${['K-214 Office','N-082 House','R-119 Renovation','M-332 Retail'].map((x,i)=>`<div class="table-row"><b>${x}</b><span class="status-pill">${['Active','Estimate','Active','Closing'][i]}</span><span>¥${[18.2,7.4,11.8,5.9][i]}M</span><strong>${[21,16,19,24][i]}%</strong></div>`).join('')}</section><section class="panel"><div class="panel-head"><b>Cash movement</b><span>90 days</span></div><div class="bars">${[42,66,51,83,72,91,63].map(h=>`<i style="height:${h}%"></i>`).join('')}</div><div class="split-stat"><span>Invoices<b>18</b></span><span>Approvals<b>06</b></span></div></section></div>
    </div>`, {title:'Business overview', nav:['Dashboard','Projects','Estimates','Costs','Invoices']});
}

function enterprisePreview(item) {
  return shell(item, `
    <div class="mock-content enterprise-content">
      <div class="project-banner"><div><small>PROGRAM / JP-204</small><h3>Central Infrastructure Program</h3></div><div><span>Stage</span><b>Delivery</b></div><div><span>Health</span><b class="good">On track</b></div></div>
      <div class="kpi-row">${kpi('Committed','¥12.4B','72% budget')}${kpi('Open RFIs','38','9 overdue')}${kpi('Documents','18,420','124 this week')}</div>
      <div class="two-col wide-left"><section class="panel"><div class="panel-head"><b>Control center</b><span>Updated 4 min ago</span></div><div class="control-grid">${['Cost','Schedule','Quality','Safety'].map((x,i)=>`<div><span>${x}</span><strong>${[92,84,96,89][i]}</strong><small>health score</small></div>`).join('')}</div><div class="activity"><b>Latest approvals</b>${['RFI-1024 approved','Drawing A-331 revised','Change CE-084 submitted'].map(x=>`<p><span></span>${x}<small>Today</small></p>`).join('')}</div></section><section class="panel"><div class="panel-head"><b>Risk register</b><span>Top 3</span></div>${['Utility relocation','Steel lead time','Permit package'].map((x,i)=>`<div class="risk-row"><strong>${i+1}</strong><div><b>${x}</b><small>Owner: PMO</small></div><em>${['High','Med','Med'][i]}</em></div>`).join('')}</section></div>
    </div>`, {title:'Program controls', nav:['Program','Documents','Cost','Schedule','Risk']});
}

function bimPreview(item) {
  return shell(item, `
    <div class="bim-workspace"><div class="model-toolbar"><button>Orbit</button><button>Section</button><button>Measure</button><button>Issue</button><span>Federated model · L02</span></div><div class="model-canvas"><div class="building-model"><div class="slab s1"></div><div class="slab s2"></div><div class="slab s3"></div><div class="core"></div><div class="column c1"></div><div class="column c2"></div><div class="column c3"></div></div><button class="model-issue">!</button><div class="model-axis">X&nbsp;&nbsp;Y&nbsp;&nbsp;Z</div></div><aside class="issue-panel"><div class="panel-head"><b>Coordination</b><span>24 issues</span></div>${['Duct clash','Beam clearance','Sleeve missing'].map((x,i)=>`<div class="issue"><span>${i+1}</span><div><b>${x}</b><small>MEP / Structure</small></div><em>${i===0?'Critical':'Open'}</em></div>`).join('')}<div class="model-tabs"><button class="active">2D</button><button>3D</button><button>History</button></div></aside></div>`, {title:'Model coordination', nav:['Models','Sheets','Issues','Clashes','Files']});
}

function safetyPreview(item) {
  return shell(item, `
    <div class="mock-content"><div class="kpi-row">${kpi('Compliance','94%','+2.4%')}${kpi('Workers onsite','126','8 companies')}${kpi('Actions due','09','3 today')}</div><div class="two-col wide-left"><section class="panel"><div class="panel-head"><b>Compliance board</b><span>Today</span></div>${['Safety induction','Insurance certificate','Daily inspection','Work permit'].map((x,i)=>`<div class="compliance-row"><span class="compliance-icon ${i===1?'warn':''}">${i===1?'!':'✓'}</span><div><b>${x}</b><small>${[126,8,14,5][i]} records</small></div><em>${['Complete','2 expiring','12 / 14','1 pending'][i]}</em></div>`).join('')}</section><section class="panel"><div class="panel-head"><b>Site access</b><span>Live</span></div><div class="donut"><span><b>126</b><small>onsite</small></span></div><div class="list-line"><span>Inducted today</span><b>18</b></div><div class="list-line"><span>Blocked access</span><b>2</b></div></section></div></div>`, {title:'Safety control', nav:['Overview','People','Documents','Inspections','Incidents']});
}

function workforcePreview(item) {
  return shell(item, `
    <div class="mock-content"><div class="kpi-row">${kpi('Allocated','84%','This week')}${kpi('Open needs','18','Across 4 sites')}${kpi('Overtime','6.2%','−1.4%')}</div><section class="panel resource-board"><div class="panel-head"><b>Workforce plan</b><span>Week 45</span></div><div class="resource-head"><span>Team</span>${['Mon','Tue','Wed','Thu','Fri'].map(x=>`<b>${x}</b>`).join('')}</div>${['Carpentry','Electrical','Plumbing','Site mgmt'].map((x,i)=>`<div class="resource-row"><label>${x}<small>${[12,9,7,4][i]} people</small></label>${[0,1,2,3,4].map((d)=>`<span class="load ${((i+d)%4===0)?'over':''}"><i style="width:${55+((i*13+d*9)%40)}%"></i><em>${6+((i+d)%5)}</em></span>`).join('')}</div>`).join('')}</section></div>`, {title:'Resource planning', nav:['Plan','People','Skills','Time','Equipment']});
}

function aiPreview(item) {
  return shell(item, `
    <div class="mock-content"><div class="kpi-row">${kpi('Verified progress','71.4%','Plan 74.0%')}${kpi('Variance','−2.6pt','3 zones at risk')}${kpi('AI observations','42','8 need review')}</div><div class="reality-grid"><section class="panel reality-view"><div class="panel-head"><b>Reality capture</b><span>Today 09:42</span></div><div class="site-image"><div class="site-structure"><i></i><i></i><i></i><i></i></div><span class="ai-box b1">Zone A · 84%</span><span class="ai-box b2 warning">Risk · 62%</span><div class="capture-path"></div></div></section><section class="panel"><div class="panel-head"><b>Plan vs actual</b><span>AI confidence</span></div>${['Structure','MEP rough-in','Partitions','Ceiling'].map((x,i)=>`<div class="progress-compare"><div><b>${x}</b><small>${[98,73,61,38][i]}% actual</small></div><div class="progress-track"><i style="width:${[98,73,61,38][i]}%"></i><span style="left:${[96,78,70,45][i]}%"></span></div><em>${[99,94,88,91][i]}%</em></div>`).join('')}<button class="full-button">Review exceptions</button></section></div></div>`, {title:'Progress intelligence', nav:['Capture','Progress','Compare','Issues','Reports']});
}

function preconPreview(item) {
  return shell(item, `
    <div class="mock-content"><div class="kpi-row">${kpi('Pipeline','$18.4M','12 opportunities')}${kpi('Bids due','05','Next 7 days')}${kpi('Coverage','78%','Subs responded')}</div><div class="board">${['New','Pricing','Review','Submitted'].map((col,c)=>`<section><header><b>${col}</b><span>${[4,3,2,3][c]}</span></header>${[0,1].map((_,i)=>`<article><small>${['Commercial','Residential','Healthcare'][((c+i)%3)]}</small><b>${['North Annex','Riverside Hub','Metro Clinic','Oak Residence'][(c+i)%4]}</b><p>Bid due ${3+c+i} days</p><div><span>${8+c*2} invited</span><em>$${1.2+c*.8}M</em></div></article>`).join('')}</section>`).join('')}</div></div>`, {title:'Bid pipeline', nav:['Pipeline','Opportunities','Invites','Bids','Companies']});
}

function estimatePreview(item) {
  return shell(item, `
    <div class="estimate-workspace"><div class="estimate-toolbar"><button>Select</button><button>Length</button><button>Area</button><button>Count</button><button>AI takeoff</button></div><div class="estimate-plan"><div class="plan-lines dense"><span></span><span></span><span></span><span></span><span></span><span></span></div><div class="measure-line"><i></i><b>6.42 m</b></div><div class="measure-area"><b>42.8 m²</b></div></div><aside class="estimate-sheet"><div class="panel-head"><b>Takeoff</b><span>Level 02</span></div>${['Concrete slab','Partition wall','Doors','Ceiling'].map((x,i)=>`<div class="takeoff-row"><span class="swatch s${i}"></span><div><b>${x}</b><small>${['m²','m','ea','m²'][i]}</small></div><strong>${[284.6,138.2,24,196.4][i]}</strong></div>`).join('')}<div class="estimate-total"><span>Estimate</span><b>$184,920</b><small>AI-assisted · 92% reviewed</small></div></aside></div>`, {title:'Takeoff workspace', nav:['Plans','Takeoff','Estimate','Quotes','Reports']});
}

function commercialPreview(item) {
  return shell(item, `
    <div class="mock-content"><div class="kpi-row">${kpi('Exposure','$428k','Open changes')}${kpi('Approved','$1.82M','This project')}${kpi('At risk','$96k','Needs action')}</div><div class="two-col wide-left"><section class="panel"><div class="panel-head"><b>Commercial items</b><span>18 open</span></div><div class="table-head"><span>Item</span><span>Owner</span><span>Value</span><span>Status</span></div>${['CE-084 Steel revision','CO-109 Access change','RISK-18 Delay claim','CE-091 MEP scope'].map((x,i)=>`<div class="table-row"><b>${x}</b><span>${['GC','Owner','Trade','GC'][i]}</span><span>$${[82,41,96,57][i]}k</span><strong>${['Review','Pending','Risk','Draft'][i]}</strong></div>`).join('')}</section><section class="panel"><div class="panel-head"><b>Approval path</b><span>CE-084</span></div><div class="approval-path">${['Submitted','PM review','Client','Final'].map((x,i)=>`<div class="${i<2?'done':''}"><span>${i<2?'✓':i+1}</span><b>${x}</b><small>${i<2?'Completed':'Waiting'}</small></div>`).join('')}</div></section></div></div>`, {title:'Commercial control', nav:['Changes','Contracts','Risk','Approvals','Reports']});
}

function procurementPreview(item) {
  return shell(item, `
    <div class="mock-content"><div class="kpi-row">${kpi('Open orders','34','8 arriving')}${kpi('At risk','06','Lead-time issue')}${kpi('Savings','$18.2k','vs baseline')}</div><section class="panel"><div class="panel-head"><b>Procurement tracker</b><span>Need-by driven</span></div><div class="proc-head"><span>Package</span><span>Quote</span><span>PO</span><span>Ship</span><span>Site</span><span>Need by</span></div>${['Steel studs','Lighting fixtures','Doorset','Tile'].map((x,i)=>`<div class="proc-row"><b>${x}</b>${[0,1,2,3].map(step=>`<span class="proc-step ${step<=i?'done':''}">${step<=i?'✓':'·'}</span>`).join('')}<em>${['Nov 06','Nov 08','Nov 12','Nov 14'][i]}</em></div>`).join('')}</section><div class="two-col"><section class="panel"><div class="panel-head"><b>Supplier comparison</b><span>Doorset</span></div><div class="supplier"><b>Supplier A</b><span>$42.8k</span><em>12 days</em></div><div class="supplier best"><b>Supplier B</b><span>$40.9k</span><em>10 days</em></div></section><section class="panel"><div class="panel-head"><b>Delivery risk</b><span>AI alert</span></div><div class="attention-card danger"><b>Lighting fixtures</b><p>Forecast 4 days after need-by date.</p><button>Open options</button></div></section></div></div>`, {title:'Procurement', nav:['Requests','Quotes','Orders','Deliveries','Suppliers']});
}

function practicePreview(item) {
  return shell(item, `
    <div class="mock-content"><div class="kpi-row">${kpi('Net revenue','$284k','This month')}${kpi('Utilization','74%','Target 72%')}${kpi('Forecast margin','31%','+3pt')}</div><div class="two-col wide-left"><section class="panel"><div class="panel-head"><b>Projects</b><span>Fee health</span></div>${['Civic Library','Studio Housing','River Office','Museum Fitout'].map((x,i)=>`<div class="project-health"><div><b>${x}</b><small>${['Design Development','Concept','Construction Docs','CA'][i]}</small></div><div class="fee-bar"><i style="width:${[66,42,81,58][i]}%"></i><span style="left:${[72,48,76,64][i]}%"></span></div><em>${['Healthy','Watch','Ahead','Watch'][i]}</em></div>`).join('')}</section><section class="panel"><div class="panel-head"><b>Team capacity</b><span>4 weeks</span></div>${['Design','Technical','PM'].map((x,i)=>`<div class="capacity"><b>${x}</b><div><i style="width:${[72,91,78][i]}%"></i></div><span>${[72,91,78][i]}%</span></div>`).join('')}<button class="full-button">Open staffing plan</button></section></div></div>`, {title:'Practice dashboard', nav:['Projects','Time','Staffing','Fees','Reports']});
}

function renderPreview(item) {
  const renderers = { field:fieldPreview, visual:visualPreview, schedule:schedulePreview, erp:erpPreview, enterprise:enterprisePreview, bim:bimPreview, safety:safetyPreview, workforce:workforcePreview, ai:aiPreview, precon:preconPreview, estimate:estimatePreview, commercial:commercialPreview, procurement:procurementPreview, practice:practicePreview };
  const renderer = renderers[item.archetype] || fieldPreview;
  productPreview.innerHTML = renderer(item);
}

function selectReference(id) {
  activeId = id;
  const item = data.find(x => x.id === id) || data[0];
  const pattern = patterns[item.archetype] || patterns.field;
  $('#referenceTitle').textContent = item.product;
  $('#referenceMeta').textContent = `${String(item.id).padStart(3,'0')} / 100 · ${item.company} · ${item.market} · ${item.category}`;
  $('#sourceLink').href = item.source;
  $('#patternName').textContent = pattern.name;
  $('#patternDescription').textContent = pattern.description;
  $('#reuseList').innerHTML = pattern.reuse.map(x => `<li>${x}</li>`).join('');
  $('#previewTags').innerHTML = [`#${String(item.id).padStart(3,'0')}`, item.market, pattern.name].map(x => `<span>${x}</span>`).join('');
  renderPreview(item);
  document.querySelectorAll('.catalog-item').forEach(el => el.classList.toggle('active', Number(el.dataset.id) === item.id));
  history.replaceState(null, '', `#${item.id}`);
}

function renderCatalog() {
  const query = searchInput.value.trim().toLowerCase();
  const market = marketFilter.value;
  const archetype = archetypeFilter.value;
  const filtered = data.filter(item => {
    const matchesText = `${item.company} ${item.product} ${item.category}`.toLowerCase().includes(query);
    return matchesText && (market === 'all' || item.market === market) && (archetype === 'all' || item.archetype === archetype);
  });
  $('#resultCount').textContent = `${filtered.length} references`;
  catalogList.innerHTML = filtered.map(item => `<button class="catalog-item ${item.id===activeId?'active':''}" data-id="${item.id}" type="button"><span class="catalog-index">${String(item.id).padStart(3,'0')}</span><span><b>${item.product}</b><small>${item.company} · ${patterns[item.archetype]?.name || item.archetype}</small></span></button>`).join('');
  catalogList.querySelectorAll('.catalog-item').forEach(button => button.addEventListener('click', () => selectReference(Number(button.dataset.id))));
}

[searchInput, marketFilter, archetypeFilter].forEach(el => el.addEventListener('input', renderCatalog));
$('#randomButton').addEventListener('click', () => selectReference(data[Math.floor(Math.random()*data.length)].id));
$('#cycleButton').addEventListener('click', () => selectReference(activeId >= data.length ? 1 : activeId + 1));

document.querySelectorAll('.device-button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.device-button').forEach(x => x.classList.remove('active'));
  button.classList.add('active');
  previewViewport.className = `preview-viewport ${button.dataset.device}`;
}));

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
  if (event.key === 'ArrowRight' && document.activeElement !== searchInput) selectReference(activeId >= data.length ? 1 : activeId + 1);
  if (event.key === 'ArrowLeft' && document.activeElement !== searchInput) selectReference(activeId <= 1 ? data.length : activeId - 1);
});

renderCatalog();
const hashId = Number(location.hash.replace('#',''));
selectReference(hashId >= 1 && hashId <= data.length ? hashId : 1);
