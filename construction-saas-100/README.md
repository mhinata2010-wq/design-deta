# Construction SaaS 100 — Design Pattern Library

建設・建築向けSaaS 100社を、公開Webサイトと公開プロダクト情報から分析し、第三者の商用コード・ロゴ・画像をコピーせずに再実装したUI/UXリファレンスです。

## Purpose

このライブラリの目的は、100個のサイトをスクリーンショット置き場にすることではなく、各社のデザイン原則を比較可能な形に変換することです。

- 情報設計
- 画面密度
- ナビゲーション
- CTA
- 工程・図面・BIM・安全・積算などのワークフロー
- Dashboard / Workspace の構成
- Responsive behavior
- UI motion の考え方

を `data.js` と `app.js` の組み合わせで切り替えます。

## Included references

`data.js` に100社を登録しています。

- Japan: 30 references
- Global: 70 references
- Total: 100 references

主なカテゴリー:

1. Field operations
2. Drawing / inspection
3. Scheduling / project controls
4. Construction ERP
5. Enterprise project controls
6. BIM / CDE
7. Safety / compliance
8. Workforce planning
9. AI / reality intelligence
10. Preconstruction
11. Estimating / takeoff
12. Commercial / risk
13. Procurement
14. Architecture practice management

## Public references used for design research

代表的な一次情報:

- ANDPAD — https://andpad.jp/
- KANNA — https://kanna4u.com/
- Photoruction — https://www.photoruction.com/
- SPIDERPLUS — https://spider-plus.com/
- Buildee — https://service.buildee.jp/
- Procore — https://www.procore.com/
- Autodesk Construction Cloud — https://construction.autodesk.com/
- Fieldwire — https://www.fieldwire.com/
- Oracle Construction & Engineering — https://www.oracle.com/construction-engineering/
- PlanRadar — https://www.planradar.com/
- OpenSpace — https://www.openspace.ai/
- Buildots — https://buildots.com/
- ALICE Technologies — https://www.alicetechnologies.com/
- Planera — https://planera.io/
- STACK — https://www.stackct.com/
- Togal.AI — https://www.togal.ai/
- Kojo — https://www.usekojo.com/
- Monograph — https://monograph.com/

各100社の参照URLは `data.js` に保存しています。

## Files

```text
construction-saas-100/
├── index.html     # Catalog / Preview shell
├── styles.css     # UI system + archetype layouts
├── app.js         # Filtering + 14 archetype renderers
├── data.js        # 100 SaaS references
└── README.md
```

## Interaction

- Search: 会社・プロダクト名で検索
- Market filter: Japan / Global
- Pattern filter: 14 archetype
- `←` / `→`: 前後のreferenceへ移動
- `⌘K` / `Ctrl+K`: 検索へフォーカス
- Desktop / Tablet / Mobile: preview width切替
- Original site: 参照元の公開サイトを開く

## Design policy

これは pixel-perfect clone を目的にしていません。

### Reuse

- Layout principles
- Information hierarchy
- Workflow patterns
- Component composition
- Interaction principles
- Density / spacing concepts

### Do not copy

- Third-party logos
- Brand photography
- Product screenshots
- Proprietary source code
- Long-form marketing copy
- Trademarked visual assets

同じ課題に対するデザイン原則を抽出し、独自UIとして再構成します。

## Why data-driven

100社を100個の孤立したHTMLとして保存すると、比較も更新も難しくなります。そのため、各社をreference recordとして保存し、`archetype` からUIを生成する構成にしています。

これにより、例えば工程表プロダクトだけを抽出して比較したり、AI進捗系だけを横断してUX原則を確認できます。

## Current limitations

- 公開Webサイトから確認できないログイン後UIは、公開情報から抽出したUX原則をもとにした独自再実装です。
- ブランド固有アセットは意図的に再現していません。
- 100社すべてについて、公開サイト更新後にURLやプロダクト名称が変わる可能性があります。
- Productionへの直接利用ではなく、`building-schedule` に採用するUI原則を選定するためのreference libraryです。

## Next use in building-schedule

このライブラリから特に比較価値が高いのは以下です。

- Schedule: ANDPAD / Photoruction / Oracle Primavera / ALICE / Planera / Touchplan / SmartPM
- Field UX: KANNA / Fieldwire / PlanRadar / Raken
- AI progress: OpenSpace / Buildots / Doxel / Disperse
- Estimating: STACK / Togal.AI / Beam AI / Kreo

Productionへ移植するときは、クライアント要件をSource of Truthとして、必要なcomponent / interactionだけをFeature Branchへ移植してください。
