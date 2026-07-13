#!/usr/bin/env python3
"""
Keeps og:image / twitter:image in index.html and project.html pointed at
the screenshot matching SETTINGS.theme in data.js.

Why this exists: link-preview crawlers (iMessage, Slack, Facebook, etc.)
fetch raw HTML and never run JS, so the sharing image can't switch itself
at request time based on SETTINGS.theme. This script is the "automatic"
part instead — it runs as a git pre-commit hook (see .githooks/pre-commit)
so the two are never out of sync in a commit, without needing a real build
step for the static site itself.

Safe to run manually too: `python scripts/sync-og-image.py`.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_JS = ROOT / "data.js"
HTML_FILES = [ROOT / "index.html", ROOT / "project.html"]


def current_theme():
    text = DATA_JS.read_text(encoding="utf-8")
    m = re.search(r"const SETTINGS\s*=\s*\{.*?theme:\s*\"(light|dark)\"", text, re.S)
    if not m:
        sys.exit("sync-og-image: couldn't find SETTINGS.theme in data.js")
    return m.group(1)


# Only touches the actual meta content= values (og:image / twitter:image),
# never prose — an earlier hand-edit that blind-replaced every occurrence of
# "og-image-dark.png" in the file also mangled a sentence that legitimately
# named both files ("og-image-light.png and og-image-dark.png are both
# screenshots..."), turning it into a duplicate. Scoping the regex to
# content="...og-image-(light|dark).png" avoids that class of bug entirely.
META_IMAGE_RE = re.compile(
    r'(content="https://ikramjeelani\.github\.io/portfolio/assets/og-image-)'
    r'(light|dark)(\.png")'
)


def sync(theme):
    changed = []
    for path in HTML_FILES:
        text = path.read_text(encoding="utf-8")
        new_text = META_IMAGE_RE.sub(lambda m: m.group(1) + theme + m.group(3), text)
        if new_text != text:
            path.write_text(new_text, encoding="utf-8")
            changed.append(path.name)
    return changed


if __name__ == "__main__":
    theme = current_theme()
    changed = sync(theme)
    if changed:
        print(f"sync-og-image: SETTINGS.theme is \"{theme}\" — updated {', '.join(changed)}")
    else:
        print(f"sync-og-image: SETTINGS.theme is \"{theme}\" — already in sync")
