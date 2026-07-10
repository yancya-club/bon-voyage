# bon-voyage

https://bon-voyage.yancya.club の
ソースコード。

2024-05-07 〜 2024-05-27 の旅の GPS 足あと（105地点）を Google Maps 上に表示する、静的なアーカイブサイト。旅はゴール済みで、今後データが増えることはない。

## 構成

- `docs/` … GitHub Pages で配信される本体（CNAME = bon-voyage.yancya.club）
  - `positions.json` … 全足あとデータ（現行 `main.js` が読む本番データ）。`visited_at` / `latitude` / `longitude` / `altitude` の配列
  - `main.js` … `./positions.json` を fetch して Google Maps (JS API) にマーカーを描画
  - `journeys/` … 旅（journey）単位でデータを分割したレイアウト。複数journey対応のフロント実装（#8）で `main.js` から参照する予定。現時点では準備のみで `main.js` は未接続
    - `index.json` … 旅の一覧メタデータ。配列の各要素は `slug`（安定ID。旅の開始日ベースで採番し、以後変更しない） / `title` / `started_on` / `finished_on`（いずれも `YYYY-MM-DD`） / `points`（地点数） / `data`（`positions.json` への相対パス）
    - `<slug>/positions.json` … その旅の全足あとデータ（`docs/positions.json` と同一スキーマ）
- `archive/journeys/<slug>/positions/` … 元データのバックアップ。旅ごとのディレクトリに分割。1地点 = 1ファイルで、ファイル名は `<ナノ秒 unix epoch>.txt`、中身は `緯度,経度,高度` の CSV 1行

## 歴史

かつては iPhone のショートカットから GCS バケット `yancya-club-bon-voyage` の `positions/` に txt を投入し、Cloud Functions が Cloud Run Job を kick して `positions.json` を集計・再生成する構成だった（詳細は issue #1 と、このコミット以前の `main.rb` / `functions/` を参照）。旅の終了に伴い更新の仕組みは破棄し、アーカイブ配信のみの静的サイトに移行した。

## GCP リソースの後片付け（オーナー実行用）

データは `docs/positions.json` と `archive/positions/` に退避済みなので、以下は削除してよい。

```sh
# Cloud Functions（Run Job を kick していたやつ）
gcloud functions delete kick_run_jobs --project=yancya-club --region=asia-northeast1

# Cloud Run Job（positions.json の集計）
gcloud run jobs delete bon-voyage --project=yancya-club --region=asia-northeast1

# GCS バケット（生データごと削除）
gcloud storage rm -r gs://yancya-club-bon-voyage
```

※ Functions / Job の正確な名前・リージョンは削除前に `gcloud functions list` / `gcloud run jobs list` で確認のこと。
