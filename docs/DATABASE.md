# データベース設計（初期）

この文書は、アプリの初期データ層（Prisma スキーマと Supabase 用SQL）の仕様をまとめたものです。現時点ではアプリ本体から未接続であり、デプロイに影響しません（ビルド可）。

## 目的
- 将来の実装（パーティー作成/参加、曲の追加、いいね集計）に備え、最小限のテーブルとリレーションを定義。
- Prisma（アプリ内のORM）と Supabase（PostgreSQL）で同等の構造を持つよう整備。

## Prisma スキーマ
- パス: `prisma/schema.prisma`
- 概要:
  - `Party`: パーティー情報（コード、ホスト、状態、終了時刻）
  - `PartyTrack`: パーティーに追加されたSpotify楽曲
  - `Like`: 楽曲への「いいね！」
- 主な制約:
  - `Party.code` は `unique`
  - `PartyTrack` は `partyId + trackId` で `unique`
  - `Like` はFKで `PartyTrack` に紐づく（将来、ユーザー単位で重複いいね制約を入れる余地あり）

## Supabase スキーマ
- パス: `supabase/schema.sql`
- 実行方法（例）:
  - Supabase SQLエディタで内容を実行、または `psql` で適用
- テーブル概要:
  - `public.parties`
    - `id` (uuid, PK), `code` (unique), `host_user_id`, `playlist_id`, `status`, `created_at`, `ended_at`
  - `public.party_tracks`
    - `id` (uuid, PK), `party_id` (FK→parties, cascade), `track_id`, `added_by`, `added_at`, unique(`party_id`,`track_id`)
  - `public.likes`
    - `id` (uuid, PK), `party_track_id` (FK→party_tracks, cascade), `user_id`, `created_at`
- インデックス:
  - `party_tracks(party_id)`, `likes(party_track_id)`
- 任意のユニーク制約（コメントアウト）:
  - 同一ユーザーが同一曲に複数いいねできないようにする `unique(party_track_id, user_id) where user_id is not null`

## 今後の拡張候補
- `PartyMember` テーブル（参加者の入退室・役割管理）
- `PlaylistSnapshot`（終了時点でのランキングや再生履歴の保存）
- パーティー状態遷移の厳密化（`status` の enum化/チェック制約強化）
- 監査用のイベントログ（曲追加/いいね/終了操作）

## 注意
- まだアプリコードからは使用していません。`DATABASE_URL` の設定や `prisma migrate` は、接続時のフェーズで導入します。
- 既存データとの互換が必要になった場合は、マイグレーション方針を `docs/DATABASE.md` に追記します。

## Prisma Client の準備（任意・ローカル）
- 依存関係: `@prisma/client`（prod）、`prisma`（dev）を追加済み。
- 環境変数: `.env.local` に `DATABASE_URL` を設定。
- 生成: `npm run prisma:generate`
- 検証: `npm run prisma:validate`
- Studio: `npm run prisma:studio`

注意: 本リポジトリでは `src/lib/prisma.ts` を用意していますが、現時点でアプリから未参照のため、生成前でもビルド可能です。
