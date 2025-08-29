# 変更・追加ファイル一覧（初期実装: Spotifyログインとページ骨組み）

本ドキュメントは、このコミットで「新たに作成／編集」したファイルの目的・役割・補足情報をまとめたものです。

## 概要
- 目的: 匿名DJパーティーアプリの最小機能として、Spotifyログイン（NextAuth）と主要ページの骨組み、認証保護を追加。
- 影響範囲: 認証API、トップページ、ダッシュボード、パーティーページ群、レイアウト、CSS、ミドルウェア、環境変数テンプレート、依存パッケージ。

---

## 追加ファイル

- `src/app/api/auth/[...nextauth]/route.ts`
  - 種別: 追加
  - 役割: NextAuth のルートハンドラ（GET/POST）を提供。Spotifyプロバイダでの認証を処理。
  - 主要点: `@/lib/auth` の `authOptions` を使用。App Router 構成。

- `src/lib/auth.ts`
  - 種別: 追加
  - 役割: NextAuth の共通設定（Spotifyプロバイダ、JWTセッション、コールバック、シークレット）。
  - 補足: JWT に `accessToken`/`refreshToken` を格納。`getServerSession` から再利用。`any` を使わない実装に修正（型ガードで `profile.id` を安全に抽出、`session`/`token` は型拡張で対応）。

- `src/components/providers/session-provider.tsx`
  - 種別: 追加
  - 役割: クライアント側の `SessionProvider`。App のレイアウトに提供。

- `src/components/auth/sign-in-button.tsx`
  - 種別: 追加
  - 役割: Spotify でログインするためのクライアントボタン。`signIn("spotify")` を実行。

- `src/components/auth/sign-out-button.tsx`
  - 種別: 追加
  - 役割: サインアウトボタン。`signOut()` を実行。

- `src/app/dashboard/page.tsx`
  - 種別: 追加
  - 役割: ログイン後のダッシュボード。パーティー作成リンク、参加コード入力→遷移（Server Action の `redirect`）。
  - 認証: 未ログインなら `/` に `redirect`。

- `src/app/party/create/page.tsx`
  - 種別: 追加（更新あり）
  - 役割: パーティー作成ページ。現時点ではモックとして6文字の英数字の参加コードをサーバーアクションで生成し、`/party/{code}` に `redirect`。
  - 認証: 未ログインなら `/` に `redirect`。
  - 補足: 今後の実装予定（プレイリスト選択/共有URL/DB保存）を明記。

- `src/app/party/[partyId]/page.tsx`
  - 種別: 追加
  - 役割: パーティールームの骨組み。再生中情報/いいね/検索UIのプレースホルダー。
  - 認証: 未ログインなら `/` に `redirect`。

- `src/app/party/[partyId]/results/page.tsx`
  - 種別: 追加
  - 役割: 結果発表ページの骨組み（ランキング/個人スコアは後続）。
  - 認証: 未ログインなら `/` に `redirect`。

- `src/middleware.ts`
  - 種別: 追加
  - 役割: 認証ミドルウェア。`/dashboard` と `/party/:path*` を保護。
  - 補足: ルートアクセス時に未認証なら NextAuth の仕組みに従いサインインへ誘導。

- `.env.example`
  - 種別: 追加
  - 役割: 必要な環境変数のサンプル。
  - 変数: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`

---

## 変更ファイル

- `src/app/layout.tsx`
  - 変更点: `<AuthSessionProvider>` を組み込み、全体にセッションを供給。`next/font/google` の `Geist`/`Geist_Mono` を削除し、ビルド時のフォント取得（ネットワーク依存）を回避。
  - 目的: クライアントコンポーネントで `useSession` 等を利用可能にする基盤。オフライン/制限環境でもビルド可能に。

- `src/app/page.tsx`
  - 変更点: 初期テンプレートを置き換え。ログイン状態に応じて「ダッシュボードへ」or「Spotifyでログイン」ボタンを表示。
  - 目的: トップページをアプリ紹介 + 認証導線に最適化。

- `src/app/dashboard/page.tsx`
  - 変更点: フォーム `action` を Server Action の要件に合わせて `async` 化（`"use server"` を使用）。
  - 目的: 参加コード入力後、サーバーサイドで `/party/{code}` へ `redirect` できるよう修正。

- `src/app/party/[partyId]/page.tsx`
  - 変更点: Next.js v15 の型仕様に合わせて `params: Promise<{ partyId: string }>` を維持し、`await params` で取得する形に統一。
  - 目的: Next.js の `PageProps` 互換性を満たしビルドを安定化。

- `src/app/party/[partyId]/results/page.tsx`
  - 変更点: 上記と同様に `params: Promise<{ partyId: string }>` を維持し、`await params` で取得する形に統一。
  - 目的: ビルド安定化。

- `src/app/globals.css`
  - 変更点: `--spotify` カラー変数を追加。`--font-geist-sans`/`--font-geist-mono` にシステムフォントスタックを設定（`next/font` 非依存化）。
  - 目的: Spotify ブランドカラーの再利用性向上。フォント取得のネットワーク依存を解消。

- `package.json`
  - 変更点: 依存関係に `next-auth` を追加。
  - 目的: NextAuth を利用した Spotify 認証のため。

---

## 追加ファイル（型拡張）

- `src/types/next-auth.d.ts`
  - 種別: 追加
  - 役割: NextAuth の型拡張。`Session.user` に `id`/`accessToken` を追加し、`JWT` に `accessToken`/`refreshToken` を追加。
  - 目的: ESLint の `@typescript-eslint/no-explicit-any` を回避しつつ、安全にトークン情報をやりとりするため。未使用インポート警告を避けるため `type` のみのインポートに修正。

---

## 設定変更

- `tsconfig.json`
  - 変更点: `include` に `**/*.d.ts` を追加。
  - 目的: 型拡張（`src/types/next-auth.d.ts`）をTypeScriptのコンパイル対象に含めるため。

---

## データ層（初期準備）

- `prisma/schema.prisma`
  - 種別: 追加
  - 役割: Prisma スキーマ。`Party` / `PartyTrack` / `Like` と `PartyStatus` を定義。
  - 補足: provider は `postgresql`、`DATABASE_URL` を参照。まだアプリから未接続。

- `supabase/schema.sql`
  - 種別: 追加
  - 役割: Supabase(PostgreSQL) 向けの初期テーブル定義SQL。Prismaと同等の構造。
  - 補足: ユニーク・FK・インデックス定義を含む。実行は後続フェーズで実施。

- `docs/DATABASE.md`
  - 種別: 追加
  - 役割: DB設計の意図、テーブル概要、適用手順（例）を整理。
  - 補足: 今後の拡張候補も記載。

---

## データ接続準備（Prisma Client導入のみ）

- `package.json`
  - 変更点: スクリプト追加 `prisma:generate` / `prisma:validate` / `prisma:studio`。
  - 目的: ローカルでのPrisma操作を簡易化。

- 依存関係
  - 追加: `@prisma/client`（dependencies）、`prisma`（devDependencies）
  - 目的: Prisma Client の利用準備（現時点ではアプリ未接続のためビルド影響なし）。

- `src/lib/prisma.ts`
  - 種別: 追加
  - 役割: Prisma Client のシングルトン初期化（開発時の多重生成を回避）。
  - 備考: まだアプリからインポートしていないため、生成未実行でもビルド可能。

- `.env.example`
  - 変更点: `DATABASE_URL` を追記（PostgreSQL/Supabaseの接続例コメント付き）。
  - 目的: 接続時の環境変数を明示。

---

## Supabase セットアップ手順（ドキュメント）

- `docs/SUPABASE_SETUP.md`
  - 種別: 追加
  - 役割: Supabase のテーブル作成方法（SQL実行／Prisma db push）、環境変数設定、動作確認手順を整理。
  - 目的: Supabase 側の初期構築をスムーズに進めるための手引き。

---

## DB 接続（パーティー作成の保存・任意）

- `src/app/party/create/actions.ts`
  - 種別: 追加
  - 役割: サーバーアクションでパーティーを作成。`DATABASE_URL` が設定されている場合は Prisma で `Party` レコードを作成（`code` のユニーク衝突は再生成で最大5回リトライ）。未設定/失敗時はDB保存をスキップしてコード生成のみで遷移。
  - リダイレクト: 成功/スキップに関わらず `/party/{code}` へ。

- `src/app/party/create/page.tsx`
  - 変更点: 既存のモック生成から `createPartyAction` を呼ぶように変更。
  - 目的: DBが用意されていれば保存、なければ従来通りのモック挙動でデプロイ可能性を維持。

- `.github/workflows/ci.yml`
  - 変更点: `Prisma generate` ステップを追加。
  - 目的: CI 環境でも Prisma Client の型生成を確実に実行し、ビルド安定性を向上。

---

## 検索UI（モック）

- `src/app/party/[partyId]/search-actions.ts`
  - 種別: 追加
  - 役割: サーバーアクションでモック検索を提供。フォームの `q` を受け取り、ダミーの `TrackMock[]` を返す `SearchState` を生成。
  - 補足: 外部APIには接続せず、デプロイ可能性を維持。

- `src/components/party/search-tracks.tsx`
  - 種別: 追加
  - 役割: クライアントコンポーネント。`useActionState` で上記サーバーアクションを呼び出し、検索結果を一覧表示。
  - 更新1: `onAdd` コールバックを受け取れるようにし、提供時は「追加」ボタンを有効化してコールバックを呼ぶ（モック追加）。
  - 更新2: `existingIds` を受け取り、既に再生中またはキューにある曲は「追加済み」バッジ表示＆追加ボタンを無効化。

- `src/app/party/[partyId]/page.tsx`
  - 変更点: 検索セクションの直接表示をやめ、ルーム用クライアントラッパーに委譲。
  - 目的: ページ内でのローカル状態管理（キュー）と検索の連携を可能に。

---

## 再生中・いいね（骨組み）

- `src/components/party/now-playing.tsx`
  - 種別: 追加
  - 役割: 再生中の曲情報カード（タイトル/アーティスト/アルバム/画像）を表示（モック）。

- `src/components/party/like-button.tsx`
  - 種別: 追加
  - 役割: 「いいね！」ボタンとカウント表示のクライアントコンポーネント。内部状態で加算、永続化やリアルタイムは未実装。

- `src/app/party/[partyId]/page.tsx`
  - 変更点: 上記の `NowPlaying` と `LikeButton` を組み込み、骨組みを表示。
  - 目的: 外部APIやDBに依存せず体験できる最小UIを提供。

---

## 共有UI（ホスト向け・UIのみ）

- `src/components/party/share-panel.tsx`
  - 種別: 追加
  - 役割: 参加コードと共有URLの表示・コピー機能を提供（モック）。
  - 更新: クリップボードコピー時にトースト通知（成功/失敗）を表示。
  - 詳細: `window.location.origin` または `NEXT_PUBLIC_APP_URL` から共有URLを生成。

- `src/app/party/[partyId]/page.tsx`
  - 変更点: 共有パネル `<SharePanel partyId={partyId} />` を上部に追加。
  - 目的: ホストが参加者に素早く共有できるUIを先行提供。

---

## 環境変数テンプレート更新

- `.env.example`
  - 変更点: 実値を削除しプレースホルダ化。`NEXT_PUBLIC_APP_URL` を追加（共有URLのベースに使用可能）。
  - 目的: セキュアなテンプレート化と共有URL生成の安定化。

---

## トースト通知（軽量実装）

- `src/components/ui/toast-provider.tsx`
  - 種別: 追加
  - 役割: クライアント側のトースト通知基盤。`useToast().show(message, { type, duration })` を提供。
  - 表示: 画面下部に積層表示。`type` は `info`/`success`/`error`。

- `src/app/layout.tsx`
  - 変更点: `<ToastProvider>` を組み込み、全体でトーストが利用可能に。
  - 目的: 追加/削除/コピーなどの操作にフィードバックを付与。

- `src/components/party/room-client.tsx`
  - 更新: キューへの追加/重複、削除時にトーストを表示。

- `src/components/party/share-panel.tsx`
  - 更新: コピー成功/失敗のトーストを表示。

---

## UI 微調整（アクセシビリティ/配色）

- `src/app/globals.css`
  - 変更点: ダークテーマの背景/前景をSpotifyガイドラインに合わせて `#191414` / `#FFFFFF` に調整。
  - 目的: 視認性とブランド一貫性の向上。

- フォーカスリングの追加
  - 対象: 各種ボタン（ログイン/サインアウト/検索送信/追加/削除/再生開始/次へ/コピー/いいね）
  - 目的: キーボード操作時の焦点可視化（アクセシビリティ向上）。
  - 変更ファイル:
    - `src/components/auth/sign-in-button.tsx`
    - `src/components/auth/sign-out-button.tsx`
    - `src/components/party/search-tracks.tsx`
    - `src/components/party/room-client.tsx`
    - `src/components/party/share-panel.tsx`
    - `src/components/party/like-button.tsx`

---

## CI 追加

- `.github/workflows/ci.yml`
  - 種別: 追加
  - 役割: GitHub Actions で `npm ci` → `npm run lint` → `npm run build` を実行。
  - 詳細: Node.js 20 を使用。テレメトリ無効化。ビルドに必要な環境変数はダミー値を付与（`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `NEXT_PUBLIC_APP_URL`）。
  - 目的: すべてのPR/Pushで「デプロイ可能性（lint/build通過）」を自動チェック。

---

## 環境変数（再掲）
- `NEXTAUTH_URL`: 例 `http://127.0.0.1:3000`
- `NEXTAUTH_SECRET`: ランダム文字列（例: `openssl rand -base64 32`）
- `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET`: Spotify Developer Dashboard で取得。
- Spotify Redirect URI: `http://127.0.0.1:3000/api/auth/callback/spotify`

---

## 動作確認の流れ（簡易）
1. `.env.local` を `.env.example` から作成し値を設定。
2. `npm i`（未実施なら）→ `npm run dev`。
3. `/` アクセス → Spotify でログイン → `/dashboard`。
4. `/party/*` への直接アクセスは認証が必要（ミドルウェアで保護）。
- `src/components/party/room-client.tsx`
  - 種別: 追加
  - 役割: ルーム内のクライアント状態を一元管理（キュー/再生中/いいね/検索の連携）。
  - 更新: 「再生開始」「次の曲へ」ボタンを追加。再生中は別状態`current`で保持し、キュー先頭を取り出して進行。重複追加は回避、キューからの削除に対応。
  - 追記: 検索UIへ `existingIds` を供給し、検索結果に「追加済み」を反映。

---

## ホスト/参加者のUI分岐（疑似）

- `src/components/party/room-client.tsx`
  - 追加: 「表示モード」トグルを導入（ローカルストレージ `host:{partyId}` に保存）。
  - 仕様: ホストモード時のみ共有パネル・再生操作（開始/次へ）を表示。参加者モードでは検索/いいね/キュー閲覧のみ。
  - 理由: DB未接続の段階で、UIの分岐体験を可能にしつつ、デプロイ可能性を維持。

- `src/components/party/share-panel.tsx`
  - 変更点: なし（`RoomClient` から条件付きで表示）。
