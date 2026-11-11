# 元の写真フォルダーから、Web用の縮小画像（images/）と写真一覧（data.js）を作ります。
# 使い方：python tools/make_images.py
import json, sys
from pathlib import Path
from PIL import Image, ImageOps

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
out = root / "images"
sections = [
    ("TOP画像", "top"),
    ("②東京駅での天皇陛下", "02-tokyo-station"),
    ("③雅子さま", "03-masako"),
    ("④園遊会に参加される雅子さま、愛子さま", "04-garden-party"),
    ("⑤神嘗祭のため皇居に入られる皇族の皆様", "05-kannamesai"),
    ("⑥第80回国民スポーツ大会（青の煌めきあおもり国スポ）", "06-aomori-kokuspo"),
    ("⑦悠仁親王殿下【広島奉迎・平和記念公園】", "07-hiroshima"),
]
manifest = {}
for src, slug in sections:
    files = sorted(p for p in (root / src).iterdir() if p.suffix.lower() in (".jpg", ".jpeg", ".png"))
    items = []
    for p in files:
        im = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
        for size, sub, q in ((2400, "", 82), (900, "thumb", 78)):
            d = out / slug / sub if sub else out / slug
            d.mkdir(parents=True, exist_ok=True)
            c = im.copy()
            c.thumbnail((size, size), Image.LANCZOS)
            c.save(d / (p.stem + ".jpg"), "JPEG", quality=q, optimize=True, progressive=True)
        items.append({"file": p.stem + ".jpg", "w": c.width, "h": c.height})
    manifest[slug] = items
    print(slug, len(items))
(root / "images" / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
# data.js を作り直す（サイトが読み込む写真一覧）
js = "// 自動生成：写真の一覧（tools/make_images.py で作成）\nwindow.PHOTOS = " + json.dumps(
    {k: [[i["file"], i["w"], i["h"]] for i in v] for k, v in manifest.items()}, ensure_ascii=False) + ";\n"
(root / "data.js").write_text(js, encoding="utf-8")
print("data.js updated")
