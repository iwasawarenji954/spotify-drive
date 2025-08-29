# Supabase 初期セットアップ手順（テーブル作成）

この手順では、リポジトリ同梱の `supabase/schema.sql` を適用して、Supabase(PostgreSQL) に必要なテーブルを作成します。Prismaを使った作成手順（db push）も併記します。どちらか一方でOKです。

## 前提
- Supabase プロジェクトが作成済み
- DB の接続情報（ホスト、DB名、パスワード）がわかる

## 方式A（推奨・ダッシュボードから実行）
1. Supabase Dashboard → SQL エディタを開く
2. リポジトリの `supabase/schema.sql` を開き、内容をコピーして貼り付け
3. 実行（Run）
4. 成功したら、`public.parties` / `public.party_tracks` / `public.likes` が作成されます

補足:
- スクリプト先頭で `create extension if not exists "pgcrypto";` を実行します。`gen_random_uuid()` を使用するための拡張です。
- 必要に応じてコメントアウトのユニーク制約（「同一ユーザーの二重いいねを禁止」）を有効化してください。

## 方式B（Prismaで作成：開発向け）
1. `.env.local` に `DATABASE_URL` を設定（例）
   - `postgresql://postgres:YOUR_PASSWORD@db.YOUR_HOST.supabase.co:5432/postgres?schema=public`
2. 依存の生成（初回のみ）
   - `npm run prisma:generate`
3. DBへスキーマ同期（テーブル作成）
   - `npx prisma db push`
4. 確認
   - `npm run prisma:studio` でテーブルを確認可能

注意:
- `db push` はマイグレーションを発行しない“同期”方式です。本番運用では `prisma migrate` を推奨します。
- このリポジトリではまだマイグレーションは管理していません（今後追加予定）。

## アプリ側の環境変数
- `.env.local`（本番はホスティング側の環境変数）に以下を設定:
  - `DATABASE_URL`: Supabase の接続文字列
  - 既存の `NEXTAUTH_*` と Spotify クレデンシャルもお忘れなく

## 動作確認
- `/party/create` から「参加コードを発行してルームへ」を実行
- `DATABASE_URL` が設定されていれば `Party` レコードが作成され、`/party/{code}` に遷移します
- 未設定やDBエラー時は保存をスキップし、従来どおりコード生成のみで遷移します

