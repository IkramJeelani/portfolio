#!/usr/bin/env python3
"""
Generates share/<project-id>.html — one static, crawler-only redirect page
per project, with real per-project og:title/og:description/og:image baked
in at build time.

Why this exists: link-preview crawlers (iMessage, Slack, Discord, Facebook,
WhatsApp, etc.) fetch raw HTML and never run JS, so project.js's runtime
meta-tag updates (see the updateMeta() IIFE in project.js) are invisible to
them — every shared project.html?id=... link showed the SAME static
homepage-shaped preview from project.html's fallback tags, regardless of
which project was actually shared.

project.html?id=... stays the real, canonical, internally-linked page for
every nav link, card, pager, and sitemap entry — nothing about it changes.
share/<id>.html is a separate, additional, crawler-facing page: a bot that
fetches it sees correct per-project OG tags, `noindex` (so it never competes
with project.html in search results), and a canonical tag pointing back at
the real page; a human's browser gets an instant redirect to that same real
page via <meta http-equiv="refresh"> (works even with JS disabled) backed
up by a JS location.replace(). Share THIS url, not project.html?id=..., when
you want the correct preview.

Runs as a git pre-commit hook (see .githooks/pre-commit) so these can never
drift out of sync with project-data.js. Safe to run manually too:
`python scripts/generate-share-pages.py`.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_JS = ROOT / "data.js"
SHARE_DIR = ROOT / "share"
SITE_URL = "https://ikramjeelani.github.io/portfolio"

try:
    from PIL import Image
except ImportError:
    Image = None


def read(path):
    return path.read_text(encoding="utf-8")


def profile_name():
    text = read(DATA_JS)
    m = re.search(r'name:\s*"([^"]+)"', text)
    if not m:
        sys.exit("generate-share-pages: couldn't find PROFILE.name in data.js")
    return m.group(1)


def project_order():
    text = read(DATA_JS)
    m = re.search(r'const PROJECT_ORDER\s*=\s*\[(.*?)\]', text, re.S)
    if not m:
        sys.exit("generate-share-pages: couldn't find PROJECT_ORDER in data.js")
    return re.findall(r'"([^"]+)"', m.group(1))


def find_project_data_file(project_id):
    for f in ROOT.glob("assets/Projects/*/project-data.js"):
        if f'id: "{project_id}"' in read(f):
            return f
    return None


def extract_field(text, field):
    m = re.search(rf'{field}:\s*"([^"]*)"', text)
    return m.group(1) if m else ""


def image_dims(rel_path):
    if Image is None:
        return None, None
    abs_path = ROOT / rel_path
    try:
        with Image.open(abs_path) as im:
            return im.size
    except Exception:
        return None, None


PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="refresh" content="0; url={project_url}">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="{project_url}">

<meta property="og:type" content="article">
<meta property="og:site_name" content="{name}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{project_url}">
<meta property="og:image" content="{image_url}">
{image_dims_tags}<meta property="og:image:alt" content="{short_title}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{image_url}">

<script>location.replace({project_url_js});</script>
</head>
<body>
<p>Redirecting to <a href="{project_url}">{short_title}</a>&hellip;</p>
</body>
</html>
"""


def build_page(project_id, title, image_rel, name):
    project_url = f"{SITE_URL}/project.html?id={project_id}"
    # Same "{title} - {name}" shape project.js sets as document.title on the
    # real page, so the two never visibly disagree.
    full_title = f"{title} - {name}"
    desc = f"An in-depth look at {title} by {name}."
    image_url = f"{SITE_URL}/{image_rel}"
    w, h = image_dims(image_rel)
    image_dims_tags = (
        f'<meta property="og:image:width" content="{w}">\n<meta property="og:image:height" content="{h}">\n'
        if w and h
        else ""
    )
    return PAGE_TEMPLATE.format(
        project_url=project_url,
        project_url_js=repr(project_url),
        title=full_title,
        short_title=title,
        desc=desc,
        name=name,
        image_url=image_url,
        image_dims_tags=image_dims_tags,
    )


SHARE_LINKS_START = "/* ---- AUTO-GENERATED SHARE LINKS (scripts/generate-share-pages.py) ----"
SHARE_LINKS_END = "---- END AUTO-GENERATED SHARE LINKS ---- */"


def update_data_js_block(titles_by_id):
    """Insert/replace a marked, auto-generated comment block right after
    PROJECT_ORDER in data.js, listing every project's share link. Paste
    THESE links (not a direct project.html?id=... one) when sharing a
    project externally — see scripts/generate-share-pages.py's own
    docstring for why. Re-running this script always regenerates the block
    between its markers in place; nothing here is meant to be hand-edited."""
    text = read(DATA_JS)
    lines = [SHARE_LINKS_START]
    lines.append("   Paste these when sharing a project externally (LinkedIn, etc.) instead")
    lines.append("   of a direct project.html?id=... link, so the link preview shows the")
    lines.append("   right project instead of the homepage. Do not edit by hand — this block")
    lines.append("   is regenerated every commit from PROJECT_ORDER + each project's data.")
    lines.append("")
    for project_id, title in titles_by_id.items():
        lines.append(f"   {title}:")
        lines.append(f"     {SITE_URL}/share/{project_id}.html")
    lines.append(SHARE_LINKS_END)
    block = "\n".join(lines) + "\n"

    pattern = re.compile(
        re.escape(SHARE_LINKS_START) + r".*?" + re.escape(SHARE_LINKS_END) + r"\n?", re.S
    )
    if pattern.search(text):
        new_text = pattern.sub(block, text)
    else:
        marker = re.search(r'const PROJECT_ORDER\s*=\s*\[.*?\];\n', text, re.S)
        if not marker:
            print("generate-share-pages: couldn't find PROJECT_ORDER in data.js, skipping block insert")
            return
        insert_at = marker.end()
        new_text = text[:insert_at] + "\n" + block + text[insert_at:]

    if new_text != text:
        DATA_JS.write_text(new_text, encoding="utf-8", newline="\n")
        print("generate-share-pages: updated share-link block in data.js")


def main():
    name = profile_name()
    ids = project_order()
    SHARE_DIR.mkdir(exist_ok=True)

    generated = []
    titles_by_id = {}
    for project_id in ids:
        pd_file = find_project_data_file(project_id)
        if not pd_file:
            print(f"generate-share-pages: no project-data.js found for '{project_id}', skipping")
            continue
        text = read(pd_file)
        title = extract_field(text, "title")
        image_rel = extract_field(text, "image")
        if not title or not image_rel:
            print(f"generate-share-pages: '{project_id}' missing title/image, skipping")
            continue
        titles_by_id[project_id] = title

        page = build_page(project_id, title, image_rel, name)
        out_path = SHARE_DIR / f"{project_id}.html"
        if not out_path.exists() or read(out_path) != page:
            out_path.write_text(page, encoding="utf-8", newline="\n")
            generated.append(out_path)

    # Remove share pages for projects no longer in PROJECT_ORDER.
    for f in SHARE_DIR.glob("*.html"):
        if f.stem not in ids:
            f.unlink()
            print(f"generate-share-pages: removed stale {f.relative_to(ROOT)}")

    update_data_js_block(titles_by_id)

    if generated:
        print("generate-share-pages: wrote " + ", ".join(str(p.relative_to(ROOT)) for p in generated))
    else:
        print("generate-share-pages: already up to date")


if __name__ == "__main__":
    main()
