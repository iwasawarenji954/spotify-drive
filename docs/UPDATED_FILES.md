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
