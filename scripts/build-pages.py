#!/usr/bin/env python3
"""Validate and assemble the existing public course pages without development files."""

import argparse
import json
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess

ROOT_FILES = {"CNAME", "favicon.ico", "favicon.svg", "robots.txt", "sitemap.xml"}
ASSET_ROOTS = {"images", "fonts", "css", "js", "microcredentials"}
ASSET_TYPES = {".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".avif", ".ico", ".otf", ".ttf", ".woff", ".woff2", ".pdf"}
TEXT_TYPES = {".html", ".css", ".js", ".svg", ".txt", ".xml"}
SECRET = re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bghp_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{30,}\b|\bxox[baprs]-[A-Za-z0-9-]{15,}\b|\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b")
MAX_FILE = 64 * 1024 * 1024
MAX_TOTAL = 500 * 1024 * 1024


class PublicationError(Exception):
    pass


def selected(name):
    p = PurePosixPath(name)
    if p.is_absolute() or not p.parts or any(x in ("", ".", "..") or x.startswith(".") for x in p.parts) or "\\" in name:
        raise PublicationError("Unsafe source path")
    return (len(p.parts) == 1 and (name in ROOT_FILES or p.suffix.lower() == ".html")) or (p.parts[0] in ASSET_ROOTS and p.suffix.lower() in ASSET_TYPES)


def validate(root, names=None):
    root = Path(root).resolve()
    if names is None:
        names = subprocess.check_output(["git", "-C", str(root), "ls-files", "-z"]).decode("utf-8").split("\0")
    files = []
    total = 0
    for name in names:
        if not name:
            continue
        # Development and hidden files never enter the public artifact.
        if any(x.startswith(".") for x in PurePosixPath(name).parts) and not (".." in PurePosixPath(name).parts):
            continue
        if not selected(name):
            continue
        source = root
        for part in PurePosixPath(name).parts:
            source = source / part
            if source.is_symlink():
                raise PublicationError("A public asset is a symbolic link: " + name)
        if not source.is_file() or not source.resolve().is_relative_to(root):
            raise PublicationError("A public asset is unavailable: " + name)
        size = source.stat().st_size
        total += size
        if size > MAX_FILE or total > MAX_TOTAL:
            raise PublicationError("Public artifact exceeds the fixed size bound")
        if source.suffix.lower() in TEXT_TYPES and SECRET.search(source.read_text(encoding="utf-8")):
            raise PublicationError("A credential pattern was found in a public asset: " + name)
        files.append(name)
    if "CNAME" not in files or (root / "CNAME").read_text().strip() != "courses.superheroes.academy":
        raise PublicationError("The existing course hostname is required")
    if not any(PurePosixPath(x).suffix.lower() == ".html" for x in files):
        raise PublicationError("At least one course page is required")
    return sorted(files)


def build(root, output, names=None):
    root, output = Path(root).resolve(), Path(output).resolve()
    if output == root or output.is_relative_to(root) or output.exists():
        raise PublicationError("Use a fresh output directory outside the checkout")
    files = validate(root, names)
    output.mkdir(parents=True, mode=0o700)
    for name in files:
        dest = output / name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(root / name, dest)
    (output / ".nojekyll").write_text("")
    return files


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if bool(args.output) == bool(args.check):
        parser.error("Choose --check or --output")
    root = Path(__file__).resolve().parent.parent
    try:
        files = build(root, args.output) if args.output else validate(root)
        print(json.dumps({"public_files_verified": len(files), "development_files_excluded": True}))
    except (PublicationError, UnicodeError) as error:
        print(json.dumps({"publication_blocked": True, "reason": str(error)}))
        raise SystemExit(1)


if __name__ == "__main__":
    main()
