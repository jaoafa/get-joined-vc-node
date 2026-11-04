# AGENTS.md

## 言語ルール

- コミットメッセージの説明 (Conventional Commits の prefix 以降)、PR / Issue のタイトルと本文、レビューコメント、コードコメント、ドキュメントは日本語で記述する。
- エラーメッセージとログメッセージは既存のスタイルを維持し、翻訳しない。
- `package.json` の `description` は英語で記述する。
- 日本語と英数字の間には半角スペースを入れる。

## 開発

- パッケージマネージャーは Yarn v1。`yarn lint` で Prettier / ESLint / tsc を実行する。
