# 祈りと、微笑みと。 ─ 皇室フォトギャラリー

沿道から見つめた皇室の皆様の姿を集めた、シンプルなフォトギャラリーサイトです。

## ファイル構成

| ファイル | 内容 |
| --- | --- |
| `index.html` | ページ本体（TOP画像・はじめの言葉・結びの言葉） |
| `style.css` | デザイン |
| `script.js` | 各章のタイトルと紹介文、写真の拡大表示 |
| `data.js` | 写真の一覧（自動生成） |
| `images/` | Web用に縮小した写真（自動生成） |
| `tools/make_images.py` | 元の写真から `images/` と `data.js` を作るスクリプト |

元の大きな写真フォルダー（`TOP画像`、`②〜⑦`）は `.gitignore` で GitHub に載せないようにしています。

## 写真を追加・入れ替えるとき

1. 元のフォルダー（例：`③雅子さま`）に写真を入れる
2. 次のコマンドを実行（Python と Pillow が必要）

   ```bash
   python tools/make_images.py
   ```

写真のない章は自動的に非表示になります。③に写真を入れると、自動で表示されます。
紹介文を変えたいときは `script.js` の先頭にある `CHAPTERS` を編集してください。

## GitHub Pages で公開する

1. GitHub で新しいリポジトリを作る（例：`imperial-gallery`）
2. このフォルダーで次を実行

   ```bash
   git remote add origin https://github.com/<ユーザー名>/imperial-gallery.git
   git push -u origin main
   ```

3. GitHub のリポジトリ画面 → **Settings** → **Pages** → Branch を `main` / `/(root)` にして **Save**
4. 数分後、`https://<ユーザー名>.github.io/imperial-gallery/` で公開されます
