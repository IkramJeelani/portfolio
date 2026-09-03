#!/usr/bin/env python3
"""
Regenerates assets/og-image-light.png and assets/og-image-dark.png — the
static images link-preview crawlers show for the homepage (and as
project.html's fallback, for a shared project.html?id=... link).

These used to be real screenshots of the homepage hero (photo, bio text,
nav bar and all). Replaced with a plain wordmark — just the "IJ" mark plus
"{PROFILE.name}" / "Portfolio" — on request, since the full hero screenshot
was busier than a share card needs to be.

Uses Segoe UI (Windows-bundled), the same fallback branding.js's
buildFavicon() already uses instead of trying to load the site's real
Sora/Manrope webfonts for a synthetically-generated asset.

Colors are the exact --bg/--text/--accent hex values from styles.css'
:root and :root[data-theme="light"] blocks — keep these two in sync by
hand if the palette ever changes there.

Runs as a git pre-commit hook (see .githooks/pre-commit), alongside
sync-og-image.py and generate-share-pages.py, so the image can't drift out
of sync with PROFILE.name or the color tokens. Requires Pillow locally for
that hook to succeed (`pip install pillow`). Safe to run manually too:
`python scripts/generate-og-images.py`.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_JS = ROOT / "data.js"
W, H = 1200, 630
FONT_DIR = Path(r"C:\Windows\Fonts")
FONT_BOLD = FONT_DIR / "segoeuib.ttf"

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("generate-og-images: Pillow is required (`pip install pillow`)")

if not FONT_BOLD.exists():
    sys.exit(f"generate-og-images: font not found at {FONT_BOLD}")

THEMES = {
    "dark": dict(bg="#14161c", text="#ece7de", accent="#f97316", out="assets/og-image-dark.png"),
    "light": dict(bg="#f6f3ec", text="#1d1a17", accent="#c2410c", out="assets/og-image-light.png"),
}


def profile_name():
    text = DATA_JS.read_text(encoding="utf-8")
    m = re.search(r'name:\s*"([^"]+)"', text)
    if not m:
        sys.exit("generate-og-images: couldn't find PROFILE.name in data.js")
    return m.group(1)


def render(theme, name):
    im = Image.new("RGB", (W, H), theme["bg"])
    d = ImageDraw.Draw(im)

    mark_font = ImageFont.truetype(str(FONT_BOLD), 34)
    d.text((56, 50), "IJ", font=mark_font, fill=theme["accent"])

    name_font = ImageFont.truetype(str(FONT_BOLD), 96)
    sub_font = ImageFont.truetype(str(FONT_BOLD), 48)
    sub_txt = "Portfolio"

    nb = d.textbbox((0, 0), name, font=name_font)
    nw, nh = nb[2] - nb[0], nb[3] - nb[1]
    sb = d.textbbox((0, 0), sub_txt, font=sub_font)
    sw, sh = sb[2] - sb[0], sb[3] - sb[1]

    gap = 26
    start_y = (H - (nh + gap + sh)) / 2

    d.text(((W - nw) / 2 - nb[0], start_y - nb[1]), name, font=name_font, fill=theme["text"])
    d.text(((W - sw) / 2 - sb[0], start_y + nh + gap - sb[1]), sub_txt, font=sub_font, fill=theme["accent"])

    out_path = ROOT / theme["out"]
    im.save(out_path)
    return out_path


def main():
    name = profile_name()
    for theme in THEMES.values():
        path = render(theme, name)
        print(f"generate-og-images: wrote {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
