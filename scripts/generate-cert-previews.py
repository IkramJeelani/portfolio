#!/usr/bin/env python3
"""
Renders assets/Certifications/previews/<name>.jpg from each PDF in
assets/Certifications/<name>.pdf — the first page, rasterized, long edge
capped at 1200px (matching the existing hand-made previews' resolution).

Drop a new credential PDF into assets/Certifications/ and this generates
its matching preview automatically; you still need to add its entry (name,
issuer, date, hasPdf/url/preview paths) to CERTIFICATIONS in data.js by
hand — this script only handles the image, since the rest can't be
inferred from the PDF alone.

Skips a PDF whose preview already exists and is newer than it, so
re-running this doesn't needlessly re-render every certification on every
commit — only new or changed PDFs.

Runs as a git pre-commit hook (see .githooks/pre-commit). Requires
PyMuPDF (`pip install pymupdf`). Safe to run manually too:
`python scripts/generate-cert-previews.py`.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CERT_DIR = ROOT / "assets" / "Certifications"
PREVIEW_DIR = CERT_DIR / "previews"
LONG_EDGE = 1200

try:
    import pymupdf
except ImportError:
    sys.exit("generate-cert-previews: PyMuPDF is required (`pip install pymupdf`)")


def render_preview(pdf_path, out_path):
    doc = pymupdf.open(pdf_path)
    page = doc[0]
    rect = page.rect
    scale = LONG_EDGE / max(rect.width, rect.height)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale))
    pix.save(out_path)
    doc.close()


def main():
    if not CERT_DIR.exists():
        sys.exit(f"generate-cert-previews: {CERT_DIR} not found")
    PREVIEW_DIR.mkdir(exist_ok=True)

    written = []
    for pdf_path in sorted(CERT_DIR.glob("*.pdf")):
        out_path = PREVIEW_DIR / f"{pdf_path.stem}.jpg"
        if out_path.exists() and out_path.stat().st_mtime >= pdf_path.stat().st_mtime:
            continue
        render_preview(pdf_path, out_path)
        written.append(out_path)

    if written:
        print(
            "generate-cert-previews: wrote "
            + ", ".join(str(p.relative_to(ROOT)) for p in written)
        )
        print(
            "generate-cert-previews: remember to add/update the matching entry "
            "(name, issuer, date, hasPdf, url, preview) in CERTIFICATIONS in data.js"
        )
    else:
        print("generate-cert-previews: already up to date")


if __name__ == "__main__":
    main()
