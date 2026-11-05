# FIELDGRID / KANNA-inspired Marketing Template

> **独立したデザイン研究・再利用用サンプルです。KANNAの公式サイト、KANNAが提供する製品、アルダグラムの関連会社ではありません。**
> 公式の写真・ロゴ・商標・顧客企業ロゴ・文章・ソースコードを転載していません。

施工管理SaaS「KANNA」の**公開マーケティングサイトの情報設計**を調査し、HTML/CSS/JavaScriptで独自制作した、施工管理SaaS向けレスポンシブLPテンプレートです。
これは **マーケティングLP** のテンプレートであり、既存の [\`field-ops-motion-template\`](../field-ops-motion-template/)（プロダクト内部画面の参考）とは役割が異なります。

## 参照元（2026-11-05確認）

- [KANNA公式トップ](https://lp.kanna4u.com/)
- [KANNAのキャンペーンLP](https://lp.kanna4u.com/campaign/lp202605/)
- [アルダグラムの製品紹介](https://aldagram.com/service/)
- [KANNAの工程表ベースライン機能・2026-10-08](https://lp.kanna4u.com/news/w44bql_neu/)

> 研究範囲は**公開ページ**のみです。サインイン後のプロダクト画面や非公開ページの完全再現ではありません。取得できなかったアセット・内部仕様は推測して模倣せず、独自のサンプル画面に置き換えています。

## 実装範囲

| 参考サイトの情報設計 | テンプレート側の独自実装 | 採用理由 |
| --- | --- | --- |
| 上部ナビ + CTA | 固定ヘッダー・アンカーリンク・折りたたみモバイルメニュー | 長いLPで迷子にならない |
| 大きなヒーローと製品紹介 | グリーン基調のヒーロー・CSS製ダッシュボードサンプル | 数秒でプロダクトの対象と価値を伝える |
| 導入企業・社会的信用 | **架空導入社数は表示せず**「使いやすさの3原則」に置換 | 検証されていない実績を捏造しない |
| KANNAプロジェクト / レポート | 2種類のワークスペースカード | 異なる仕事を同じUIに押し込まない |
| 案件一覧・工程表・写真・報告など | 6つの機能タブとオリジナルのサンプルデータ | 機能を一覧ではなく操作で理解できる |
| 利用メリット | Before的なPain cards・UX原則4枚 | 何を解決するかの因果を示す |
| 製品説明と導入手順 | 3段階のワークフロー | オンボーディングの心理的負荷を減らす |
| 導入事例や用途 | 実績を偽らない3人の**想定ユーザーシナリオ** | 役割別利用を説明 |
| FAQ・利用開始CTA | ネイティブ\`details\` FAQとページ内CTA | デモとして実際に機能する |
| 会社情報・フッター | オリジナルのフッターと出典 | 独立したテンプレートであることを明確にする |

## 画面と動作

1. **Desktop (1180px content width)**: Sticky header / 2-column hero / CSS dashboard / paired product cards / 6 tabs / UX sections / scenarios / FAQ / CTA / footer
2. **Tablet (951–1160px)**: ナビの余白とモックUIを縮小
3. **Tablet-Mobile (≤950px)**: ハンバーガーナビ・縦積みヒーロー・機能パネル1列
4. **Mobile (≤720px)**: すべてのセクションカードを縦積み
5. **Small Mobile (≤490px)**: カード密度・タイポグラフィ・CTAを調整
6. **Accessibility**: スキップリンク、フォーカスリング、キーボードで操作できる機能タブ、閉じられるモバイルナビ、native FAQ、\`prefers-reduced-motion\`対応
7. **Micro-interaction**: タブ切替、IntersectionObserverの控えめなReveal、hover、press、背景の固定グリッド
8. **No backend**: メールフォーム、会員登録・クラウド保存などの機能は実装していません。**ボタンはデモ内の有効なページ内リンクのみ**です。

## デザインシステム（主要トークン）

| Token | Value | Usage |
| --- | --- | --- |
| \`--green-900\` | \`#155b48\` | Hero / Brand |
| \`--green-800\` | \`#1d745a\` | Primary accents |
| \`--orange\` | \`#f27b4b\` | Conversion CTA |
| \`--ink\` | \`#162721\` | Text |
| \`--paper\` | \`#fff\` | Surfaces |
| \`--bg\` | \`#f7f9f7\` | Section backgrounds |
| \`--line\` | \`#dae5de\` | Borders |
| \`--container\` | \`1180px\` | Page grid |
| \`--fast\` | \`160ms\` | Hover / Press |
| \`--base\` | \`250ms\` | Switching |
| \`--slow\` | \`580ms\` | Reveals |

色は「ブランド背景・CTA・状態表現」に限定。無意味な過剰グラデーション、巨大な影の多用、架空の数字やレビューを避けています。

## フォルダ構成

\`\`\`text
kanna-inspired-marketing-template/
├── index.html            # 10の主要LPセクション・ヒーローモックUI
├── styles.css            # Design Tokens / Responsive / Animation
├── app.js                # 機能タブ切替 / Mobile Nav / Reveal / Scrollspy
├── tokens.json           # 意味別のトークン・ブレークポイント情報
├── README.md             # このファイル
├── DESIGN_AUDIT.md       # 採用・不採用の判断根拠
└── test.mjs              # HTML/CSS/JS整合性の静的テスト
\`\`\`

## 起動・検証

ローカルのリポジトリ直下から以下を実行します。

\`\`\`sh
python3 -m http.server 8080
# http://localhost:8080/kanna-inspired-marketing-template/
node --check kanna-inspired-marketing-template/app.js
node --test kanna-inspired-marketing-template/test.mjs
\`\`\`

**確認すべき操作**
- PCのヘッダーアンカーが存在する
- スマートフォンでメニューが開閉し、遷移後に閉じる
- 機能タブを6つ切り替えると説明とサンプルデータが変わる
- Tab / ArrowLeft / ArrowRight / Home / End / Escape キーで操作できる
- FAQが開閉する
- Reduced Motionでアニメーションが抑制される
- 360px～1440pxで水平スクロールやクリップが発生しない

## Building Scheduleへの移植判断

**採用候補**: セクションの明快な見出しと説明、アンカーナビ、機能の分類、グリーンの意味付け、アクセシビリティと余白ルール。
**そのまま移植しない**: マーケティングヒーロー、コンバージョン用のオレンジCTA、ランディングページの長いスクロール構造、存在しない機能を完成済みに見せるコピー。

本テンプレートは\`design-deta\`にのみ置き、Productionの\`building-schedule\`には自動でマージしません。

## 品質と制約

- 現在の実装は、**公式サイトのピクセル単位のコピーではなく**、公開サイトから抽出した構成原則を使う独立デザインです。
- クラウド保存、写真アップロード、チャット、承認フロー、料金、会員登録の実処理は含みません。
- 計測値、導入社数、顧客名、App Storeレビューなどの第三者の事実をテンプレート内では主張していません。
- KANNAの名前は**研究出典としてのみ**登場します。
- 静的テストとブラウザ動作検証は別です。E2E検証の実施状況はPRのTesting欄で管理します。
