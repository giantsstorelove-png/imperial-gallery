# 元の写真フォルダーから、Web用の縮小画像（images/）と写真一覧（data.js）を作ります。
# 使い方：python tools/make_images.py
#
# 写真はファイル名の番号順（①②③… または 1, 2, 3…）に並びます。
# 番号のないファイルは、番号付きの写真のあとに名前順で並びます。
import json, re, sys, unicodedata
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
    ("⑧大阪行幸啓(11月14日～15日)", "08-osaka"),
    ("⑨愛子様内親王殿下【シンガポールご出発】", "09-singapore"),
]


def photo_number(name):
    """ファイル名から番号を取り出す（①→1、⑫→12、「3」「03」→3）。番号がなければ None。"""
    stem = Path(name).stem.strip()
    if len(stem) == 1 and unicodedata.numeric(stem, None) is not None:
        return int(unicodedata.numeric(stem))  # ①〜㊿ のような丸数字
    m = re.fullmatch(r"\d+", unicodedata.normalize("NFKC", stem))
    return int(m.group()) if m else None


def sort_key(p):
    n = photo_number(p.name)
    return (0, n, "") if n is not None else (1, 0, p.name)


# 前回の画像を消して、今のフォルダーの中身だけで作り直す
# （OneDrive がフォルダーを使用中のことがあるため、消すのはファイルだけにする）
if out.exists():
    for f in out.rglob("*"):
        if f.is_file():
            f.unlink()

manifest = {}
for src, slug in sections:
    files = sorted((p for p in (root / src).iterdir() if p.suffix.lower() in (".jpg", ".jpeg", ".png")), key=sort_key)
    items = []
    for p in files:
        n = photo_number(p.name)
        name = f"{n:02d}.jpg" if n is not None else p.stem + ".jpg"
        im = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
        for size, sub, q in ((2400, "", 82), (900, "thumb", 78)):
            d = out / slug / sub if sub else out / slug
            d.mkdir(parents=True, exist_ok=True)
            c = im.copy()
            c.thumbnail((size, size), Image.LANCZOS)
            c.save(d / name, "JPEG", quality=q, optimize=True, progressive=True)
        items.append({"file": name, "w": c.width, "h": c.height, "src": p.name})
    manifest[slug] = items
    print(slug, len(items), " ".join(i["src"] for i in items))
(out / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
# data.js を作り直す（サイトが読み込む写真一覧）
js = "// 自動生成：写真の一覧（tools/make_images.py で作成）\nwindow.PHOTOS = " + json.dumps(
    {k: [[i["file"], i["w"], i["h"]] for i in v] for k, v in manifest.items()}, ensure_ascii=False) + ";\n"
(root / "data.js").write_text(js, encoding="utf-8")
print("data.js updated")
