# bon-voyage

https://bon-voyage.yancya.club の
ソースコード。

複数の旅（journey）の GPS 足あとを Google Maps 上に表示する、静的なアーカイブサイト。現在は 2024-05-07 〜 2024-05-27 の旅（105地点）のみを収録。

## 構成

- `docs/` … GitHub Pages で配信される本体（CNAME = bon-voyage.yancya.club）
  - `main.js` … `?journey=<slug>` で指定された旅（省略時は最新の旅）のデータを `journeys/<slug>/positions.json` から fetch し、Google Maps (JS API) にマーカーを描画。存在しない slug が指定された場合はメッセージを表示して最新の旅にフォールバックする。ページ下部に旅の一覧ナビゲーションを表示する
  - `journeys/` … 旅（journey）単位で分割されたデータ
    - `index.json` … 旅の一覧メタデータ。配列の各要素は `slug`（安定ID。旅の開始日ベースで採番し、以後変更しない） / `title` / `started_on` / `finished_on`（いずれも `YYYY-MM-DD`） / `points`（地点数） / `data`（`positions.json` への相対パス）
    - `<slug>/positions.json` … その旅の全足あとデータ。`visited_at` / `latitude` / `longitude` / `altitude` の配列
- `archive/journeys/<slug>/positions/` … 元データのバックアップ。旅ごとのディレクトリに分割。1地点 = 1ファイルで、ファイル名は `<ナノ秒 unix epoch>.txt`、中身は `緯度,経度,高度` の CSV 1行

## 新しい旅を追加する手順

1. `docs/journeys/<新しいslug>/positions.json` を配置する（slug は旅の開始日ベース、例 `2025-01-01`）
2. `docs/journeys/index.json` に一覧メタデータを追記する
3. 生データのバックアップを `archive/journeys/<新しいslug>/positions/` に配置する
4. どの journey を既定表示にするかは `main.js` が `started_on` の降順で自動判定するため、特別な設定は不要

## 歴史

かつては iPhone のショートカットから GCS バケット `yancya-club-bon-voyage` の `positions/` に txt を投入し、Cloud Functions（`kick-bon-voyage-json-builder`）が Cloud Run Job（`build-bon-voyage-yancya-club-posisions-json`）を kick して `positions.json` を集計・再生成する構成だった（詳細は issue #1 と、このコミット以前の `main.rb` / `functions/` を参照）。旅の終了に伴い更新の仕組みは破棄し、アーカイブ配信のみの静的サイトに移行した。GCP リソース（上記 Function / Run Job / GCS バケット、いずれも `us-central1`）は 2026-07-10 に削除済み。

## Google Maps API キーの制限（運用メモ）

`docs/main.js` の Maps JavaScript API キーには以下の制限を設定済み（2026-07-10 確認・設定）:

- アプリケーション制限（HTTP リファラー）: `https://*.yancya.club`, `http://localhost:8080/*`
- API 制限: Maps JavaScript API (`maps-backend.googleapis.com`) のみ

設定変更は `gcloud services api-keys describe <key>` で確認できる。ローカル確認時は `python3 -m http.server 8080` など、許可済みの `localhost:8080` を使うこと。
