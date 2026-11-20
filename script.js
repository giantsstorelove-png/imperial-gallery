// 各章の内容。写真が1枚もない章は自動的に表示されません。
const CHAPTERS = [
  {
    slug: "02-tokyo-station", no: "02", en: "Tokyo Station",
    title: "東京駅での天皇陛下",
    text: "赤煉瓦の駅舎に、穏やかな微笑み。<br>集まった人々ひとりひとりへ、陛下はやさしく手を振ってくださいました。その飾らないお姿に、国民に寄り添い続ける天皇のあり方が静かに映し出されています。"
  },
  {
    slug: "03-masako", no: "03", en: "Empress Masako",
    title: "雅子さま",
    text: "凛として、<ruby>嫋<rt>たお</rt></ruby>やかに。<br>世界を見つめてこられた深いまなざしと、包み込むような温かな笑顔。皇后陛下のお姿は、いつも人々の心をやわらかく照らしています。"
  },
  {
    slug: "04-garden-party", no: "04", en: "Garden Party",
    title: "園遊会に参加される雅子さま、愛子さま",
    text: "華やかなお着物に、こぼれるような笑顔。<br>母と娘、お二人が交わす温かな空気が、窓越しにも伝わってきます。受け継がれていく気品と優しさが、晴れやかな一日を彩りました。"
  },
  {
    slug: "05-kannamesai", no: "05", en: "Kannamesai",
    title: "神嘗祭のため皇居に入られる皇族の皆様",
    text: "その年に実った初穂を神々に捧げ、感謝を伝える古来の祭儀、神嘗祭。<br>祈りの日に皇居へと向かわれる皆様は、沿道の人々にも変わらぬ笑顔で応えてくださいました。"
  },
  {
    slug: "06-aomori-kokuspo", no: "06", en: "Aomori Kokuspo",
    title: "第80回国民スポーツ大会<br>（青の煌めきあおもり国スポ）",
    text: "大会の名にふさわしい、鮮やかな青のお召し物。<br>北の大地に集ったアスリートと人々へ、まっすぐな笑顔とエールが届けられました。その明るさは、会場を包む何よりの励ましとなりました。"
  },
  {
    slug: "07-hiroshima", no: "07", en: "Hiroshima",
    title: "悠仁親王殿下<br>【広島奉迎・平和記念公園】",
    text: "祈りの地、広島。<br>若き親王殿下は静かな面持ちで平和記念公園を歩まれました。平和を願う心は、こうして次の世代へと確かに受け継がれていきます。"
  },
  {
    slug: "08-osaka", no: "08", en: "Osaka",
    title: "大阪行幸啓<br>（11月14日〜15日）",
    text: "天皇皇后両陛下、大阪へ。<br>車窓から向けられる穏やかな笑顔に、沿道は温かな歓声に包まれました。並んで手を振られるお二人のお姿には、寄り添い合う深い絆と、人々を思うお心が映し出されています。"
  },
  {
    slug: "09-singapore", no: "09", en: "Singapore",
    title: "愛子内親王殿下<br>【シンガポールご出発】",
    text: "笑顔とともに、海の向こうへ。<br>ご出発の朝、車窓からこぼれる晴れやかな笑顔。国と国とを温かくつなぐ架け橋となられるそのお姿に、新しい時代の皇室の輝きが感じられます。"
  }
];

const gallery = document.getElementById("gallery");
const nav = document.getElementById("nav");
const menuList = document.getElementById("menuList");
const menuBtn = document.getElementById("menuBtn");
const all = []; // ライトボックス用の写真一覧
const grids = []; // 各章の写真の並び

CHAPTERS.forEach(ch => {
  const photos = (window.PHOTOS[ch.slug] || []);
  if (!photos.length) return;

  const sec = document.createElement("section");
  sec.className = "chapter";
  sec.id = ch.slug;
  const plainTitle = ch.title.replace(/<br>/g, " ");
  sec.innerHTML = `
    <div class="chapter-head">
      <div>
        <p class="chapter-no">${ch.no}<small>${ch.en}</small></p>
        <h2 class="chapter-title">${ch.title}</h2>
      </div>
      <p class="chapter-text">${ch.text}<span class="chapter-count">${photos.length} PHOTOS</span></p>
    </div>`;

  const grid = document.createElement("div");
  grid.className = "grid" + (photos.length === 1 ? " one" : photos.length <= 4 ? " few" : "");
  photos.forEach(([file, w, h], i) => {
    const index = all.length;
    all.push({
      src: `images/${ch.slug}/${file}`,
      cap: `${plainTitle}　${i + 1} / ${photos.length}`,
      dl: `photo-by-honmitsu_${ch.no}-${String(i + 1).padStart(2, "0")}.jpg`
    });
    const fig = document.createElement("figure");
    fig.className = "photo";
    fig.innerHTML = `<img src="images/${ch.slug}/thumb/${file}" width="${w}" height="${h}" loading="lazy" alt="${plainTitle} ${i + 1}">`;
    fig.addEventListener("click", () => openLb(index));
    fig.dataset.ratio = h / w;
    grid.appendChild(fig);
  });
  grids.push(grid);
  sec.appendChild(grid);
  gallery.appendChild(sec);

  const a = document.createElement("a");
  a.href = "#" + ch.slug;
  a.textContent = ch.no;
  a.title = plainTitle;
  nav.appendChild(a);

  const li = document.createElement("li");
  li.innerHTML = `<a href="#${ch.slug}"><span class="menu-no">${ch.no}</span><span class="menu-title"></span><span class="menu-count">${photos.length}</span></a>`;
  li.querySelector(".menu-title").innerHTML = ch.title;
  menuList.appendChild(li);
});

// 写真を列に振り分ける：番号順に、いちばん短い列へ順に入れていく
// （左上から右へ ①②③… と読める並びになる）
function columnCount(grid) {
  const max = grid.classList.contains("one") ? 1 : grid.classList.contains("few") ? 2 : 3;
  const w = window.innerWidth;
  return Math.min(max, w <= 640 ? 1 : w <= 1000 ? 2 : 3);
}
function layoutGrids() {
  grids.forEach(grid => {
    const n = columnCount(grid);
    if (grid.dataset.cols === String(n)) return;
    grid.dataset.cols = n;
    const figs = grid._figs || (grid._figs = [...grid.querySelectorAll(".photo")]);
    grid.innerHTML = "";
    const cols = Array.from({ length: n }, () => {
      const c = document.createElement("div");
      c.className = "grid-col";
      grid.appendChild(c);
      return { el: c, h: 0 };
    });
    figs.forEach(fig => {
      const col = cols.reduce((a, b) => (b.h < a.h - 0.01 ? b : a));
      col.el.appendChild(fig);
      col.h += Number(fig.dataset.ratio) + 0.02;
    });
  });
}
layoutGrids();
let resizeTimer;
window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(layoutGrids, 150); });

// 目次メニュー（どこからでも章へ移動）
function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "目次を閉じる" : "目次を開く");
  document.getElementById("menu").setAttribute("aria-hidden", !open);
  document.body.style.overflow = open ? "hidden" : "";
}
menuBtn.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
menuList.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
document.querySelector(".menu-guide").addEventListener("click", () => setMenu(false));
document.addEventListener("keydown", e => { if (e.key === "Escape" && document.body.classList.contains("menu-open")) setMenu(false); });

// スクロールで写真をふわっと表示
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); } });
}, { rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".photo").forEach(el => io.observe(el));

// ヘッダーの背景切り替え
const header = document.querySelector(".site-header");
const toTop = document.getElementById("toTop");
const onScroll = () => {
  const past = window.scrollY > window.innerHeight * 0.8;
  header.classList.toggle("solid", past);
  toTop.classList.toggle("show", past);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ライトボックス
const lb = document.getElementById("lightbox");
const lbImg = lb.querySelector(".lb-img");
const lbCap = lb.querySelector(".lb-cap");
let cur = 0;
function show(i) {
  cur = (i + all.length) % all.length;
  lbImg.src = all[cur].src;
  lbCap.textContent = all[cur].cap;
  [cur - 1, cur + 1].forEach(j => { const p = all[(j + all.length) % all.length]; new Image().src = p.src; });
}
function openLb(i) { show(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
function closeLb() { closeDl(); lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
lb.querySelector(".lb-close").onclick = closeLb;
lb.querySelector(".lb-prev").onclick = e => { e.stopPropagation(); show(cur - 1); };
lb.querySelector(".lb-next").onclick = e => { e.stopPropagation(); show(cur + 1); };
lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lb-figure")) closeLb(); });

// ダウンロード（利用ガイドラインへの同意を確認してから）
const dlConfirm = document.getElementById("dlConfirm");
const dlAgree = document.getElementById("dlAgree");
const dlGo = document.getElementById("dlGo");
const dlOpen = () => !dlConfirm.hidden;
function setDlEnabled(on) {
  dlGo.setAttribute("aria-disabled", String(!on));
  if (on) { dlGo.href = all[cur].src; dlGo.download = all[cur].dl; }
  else { dlGo.removeAttribute("href"); dlGo.removeAttribute("download"); }
}
function openDl() { dlAgree.checked = false; setDlEnabled(false); dlConfirm.hidden = false; dlAgree.focus(); }
function closeDl() { dlConfirm.hidden = true; }
lb.querySelector(".lb-dl").addEventListener("click", e => { e.stopPropagation(); openDl(); });
dlAgree.addEventListener("change", () => setDlEnabled(dlAgree.checked));
dlGo.addEventListener("click", () => { if (dlAgree.checked) setTimeout(closeDl, 300); });
document.getElementById("dlCancel").addEventListener("click", closeDl);
document.getElementById("dlGuide").addEventListener("click", closeLb);
dlConfirm.addEventListener("click", e => { if (e.target === dlConfirm) closeDl(); });

document.addEventListener("keydown", e => {
  if (!lb.classList.contains("open")) return;
  if (dlOpen()) { if (e.key === "Escape") closeDl(); return; }
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft") show(cur - 1);
  if (e.key === "ArrowRight") show(cur + 1);
});
let tx = null;
lb.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", e => {
  if (tx === null || dlOpen()) return;
  const dx = e.changedTouches[0].clientX - tx;
  if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  tx = null;
});

document.getElementById("year").textContent = new Date().getFullYear();
