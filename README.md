# get-joined-vc-node

指定した Discord ユーザーが現在参加しているボイスチャンネルを調べ、JSON で標準出力に書き出すツール。Java 版 jaotan が動作しないときの補助アプリケーションとして使う。

## 設定

ビルド後の `dist/` 配下 (`dist/main.js` と同じディレクトリ) に、次の 2 つの JSON ファイルを置く。

- `tokens.json`: 調査に使う Discord Bot トークンの配列。例: `["token1", "token2"]`
- `targetServers.json`: 結果に含めるサーバー ID の配列。例: `["123456789012345678"]`

Bot には `Guilds` と `GuildVoiceStates` の intent が必要。

## 実行

```bash
yarn install
yarn compile
node dist/main.js --userId <ユーザー ID>
```

出力は `channelName`、`channelId`、`guildName`、`guildId` を持つオブジェクトの JSON 配列。ログインや取得に失敗したトークンは結果に含まれない。`NODE_ENV=development` のときは、その失敗内容を標準エラー出力に表示する。

## 開発

- `yarn dev --userId <ユーザー ID>`: ts-node-dev で実行する。この場合は設定ファイルを `src/` 直下に置く。`src/` は Git の無視対象ではないため、`tokens.json` をコミットしないよう注意する。
- `yarn lint`: Prettier、ESLint、tsc による検査を行う。
- `yarn fix`: Prettier と ESLint の自動修正を行う。
