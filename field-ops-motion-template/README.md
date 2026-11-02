# FieldOps Motion Template

建築現場で使われる施工管理SaaSの情報設計を研究し、`KANNA` の公開UIから抽出した設計原則を中心に、独自実装したデザイン / モーション検証用テンプレートです。

> このテンプレートはKANNAの公式プロダクトではありません。第三者の商用ソースコード、ロゴ、画像アセット、固有文言はコピーしていません。

## 解決する課題

建築現場向けSaaSでは、情報量を増やしすぎると「全体が小さく見える」「どこを触ればいいか分からない」という問題が起きやすくなります。このテンプレートでは、現場監督・職人・協力会社が短時間で状況判断できることを優先しています。

## 想定ユーザー

- 現場監督 / 施工管理者
- 工務店の責任者
- 協力会社の担当者
- 工程調整を行うプロジェクトマネージャー

## バリュープロポジション

- 案件ステータス → KPI → 今週工程 → 要確認事項の順で、判断フローを1画面に集約
- 工程バーを直接ドラッグ / リサイズでき、手書きに近い編集感を作る
- 詳細編集はDrawer、追加はModalに分離し、工程表のコンテキストを失わない
- Motion Tokenを共通化し、UI全体の反応速度を揃える

## 参考UI

### KANNA

- https://lp.kanna4u.com/
- https://lp.kanna4u.com/feature/
- https://aldagram.com/service/

参考にした要素:

- 左サイドナビ + 案件単位の情報構造
- 案件ヘッダーとステータス管理
- 案件内タブで「概要 / 工程 / 報告 / 写真 / 資料」を切り替える考え方
- ドラッグ&ドロップで工程を調整する工程表UX
- グリーンを中心にした、現場で判読しやすい状態表現

採用理由:

- 建設現場の主要情報が案件単位にまとまっており、機能の所在が理解しやすい
- PCとモバイルを横断する施工管理プロダクトとして、操作対象が明確
- 工程、写真、資料、チャットを同じ案件コンテキストに置く設計が、現場の情報分断を減らす

### ANDPAD / Photoruction

比較対象として、工程表・図面・写真・報告を一元管理する構造を確認。テンプレートでは個別の見た目をコピーせず、「現場情報の集約」と「工程変更の即時反映」という共通原則だけを取り入れています。

- https://andpad.jp/products/construction_management
- https://www.photoruction.com/

## 実装コンポーネント

- Fixed Sidebar / Collapsed Sidebar
- Project Switcher
- Sticky Topbar
- Project Status Stepper
- Project Tabs
- KPI Cards
- Weekly Gantt Board
- Collapsible Work Groups
- Draggable / Resizable Schedule Bars
- Attention Queue
- Activity Feed
- Task Detail Drawer
- Add Schedule Modal
- Command Palette (`⌘K` / `Ctrl+K`)
- Toast Feedback
- Skeleton Loading State

## Motion System

| Token | 値 | 用途 |
| --- | --- | --- |
| `--dur-fast` | `140ms` | hover / press / icon feedback |
| `--dur-base` | `220ms` | tab / nav / small state transition |
| `--dur-slow` | `360ms` | drawer / modal / sidebar |
| `--ease-standard` | `cubic-bezier(.2,.8,.2,1)` | 一般的な状態変化 |
| `--ease-spring` | `cubic-bezier(.22,1,.36,1)` | drawer / bar / reveal |
| `--ease-exit` | `cubic-bezier(.4,0,1,1)` | toastなどの退出 |

### Animation Rules

1. **Hover**: 140ms以内。位置変化は最大2px。
2. **Press**: `scale(.94-.97)` で押下を即時フィードバック。
3. **Drawer**: 右から360msで入る。背景を18%暗くし、作業中の画面コンテキストを維持。
4. **Modal**: `translateY + scale` の組み合わせで、追加操作であることを明示。
5. **Gantt Drag**: ドラッグ中は影を強め、日単位でスナップ。左右ハンドルで期間を変更。
6. **Loading**: Project Switch時にSkeleton Shimmerを表示。
7. **Reduced Motion**: `prefers-reduced-motion` ではアニメーションを実質無効化。

## ファイル

```text
field-ops-motion-template/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## ローカル確認

静的ファイルのみなので、任意のHTTPサーバーで確認できます。

```bash
python3 -m http.server 8080
```

`http://localhost:8080/field-ops-motion-template/` を開きます。

## 現在の開発状況

- [x] Dashboard layout
- [x] Gantt direct manipulation
- [x] Drawer / Modal / Command Palette
- [x] Motion tokens
- [x] Reduced-motion support
- [ ] Mobile field view
- [ ] Network schedule view
- [ ] Photo / drawing viewer reference

## Roadmap

1. `building-schedule` のクライアント要件と比較
2. 有効なコンポーネントだけProduction側Feature Branchへ移植
3. 手書き感覚のバー作成をPointer操作で拡張
4. 前後関係入力からNetwork工程表を自動生成
5. A4工程表出力のUIを追加
