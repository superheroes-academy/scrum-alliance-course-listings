#!/usr/bin/env python3
"""Catch up clean feature branches and reject stale origin pushes locally."""

import argparse
import os
from pathlib import Path
import re
import subprocess
import sys


HOOK = '''#!/bin/sh
# ai-agent-environment freshness guard v1
set -eu
root=$(git rev-parse --show-toplevel)
helper="$root/scripts/prepare-branch-for-push.py"
if [ ! -f "$helper" ]; then
  printf '%s\\n' "Fetch and merge origin/main to obtain scripts/prepare-branch-for-push.py before pushing." >&2
  exit 1
fi
for interpreter in python3 python; do
  if command -v "$interpreter" >/dev/null 2>&1 && "$interpreter" -c 'import sys; sys.exit(sys.version_info.major != 3)' >/dev/null 2>&1; then
    exec "$interpreter" "$helper" --repo "$root" check-push "$@"
  fi
done
if command -v py >/dev/null 2>&1; then
  exec py -3 "$helper" --repo "$root" check-push "$@"
fi
printf '%s\\n' "Python 3 is required for the local freshness guard." >&2
exit 1
'''


class GuardError(Exception):
    pass


def git(repo, *args, check=True):
    result = subprocess.run(
        ["git", "-C", str(repo), *args], capture_output=True, text=True
    )
    if check and result.returncode:
        raise GuardError(result.stderr.strip() or result.stdout.strip() or "Git failed.")
    return result


def root_for(path):
    return Path(git(path, "rev-parse", "--show-toplevel").stdout.strip())


def fetch_main(repo):
    git(repo, "fetch", "--no-tags", "origin", "main:refs/remotes/origin/main")


def current(repo, candidate):
    result = git(repo, "merge-base", "--is-ancestor", "origin/main", candidate, check=False)
    if result.returncode not in (0, 1):
        raise GuardError(result.stderr.strip() or "Unable to check the submitted commit.")
    return result.returncode == 0


def prepare(repo):
    branch = git(repo, "symbolic-ref", "--quiet", "--short", "HEAD", check=False)
    if branch.returncode or branch.stdout.strip() in ("main", "master"):
        raise GuardError("Use an attached feature branch before preparing changes.")
    for name in ("MERGE_HEAD", "CHERRY_PICK_HEAD", "REVERT_HEAD", "rebase-merge", "rebase-apply", "sequencer"):
        state = Path(git(repo, "rev-parse", "--git-path", name).stdout.strip())
        if not state.is_absolute():
            state = repo / state
        if state.exists():
            raise GuardError("Complete the current Git operation before preparing changes.")
    if git(repo, "status", "--porcelain", "--untracked-files=normal").stdout:
        raise GuardError("Preserve and commit the intended work before catching up. The working copy must be clean.")
    fetch_main(repo)
    if current(repo, "HEAD"):
        print("The feature branch contains the current origin/main. Ready for validation and push.")
        return
    result = git(repo, "merge", "--ff", "--no-edit", "--no-stat", "origin/main", check=False)
    if result.returncode:
        raise GuardError(
            "Catch-up needs attention. Existing commits are preserved. Resolve any conflicts, "
            "complete the merge and rerun validation.\n" + result.stdout.strip() + "\n" + result.stderr.strip()
        )
    print("Merged the current origin/main. Rerun the relevant checks before pushing.")


def check_push(repo, remote, lines):
    if remote != "origin":
        return
    candidates = []
    for line in lines:
        fields = line.split()
        if len(fields) != 4:
            raise GuardError("Invalid pre-push ref information; the push was stopped.")
        local_ref, local_sha, remote_ref, _remote_sha = fields
        if not re.fullmatch(r"(?:[0-9a-fA-F]{40}|[0-9a-fA-F]{64})", local_sha):
            raise GuardError("Invalid pre-push commit identifier; the push was stopped.")
        if remote_ref.startswith("refs/heads/") and set(local_sha) != {"0"}:
            candidates.append((local_ref, local_sha, remote_ref))
    if not candidates:
        return
    fetch_main(repo)
    stale = [remote_ref for _, sha, remote_ref in candidates if not current(repo, sha)]
    if stale:
        raise GuardError(
            "Push stopped locally: these submitted commits need the current origin/main: "
            + ", ".join(stale)
            + ".\nRun python3 scripts/prepare-branch-for-push.py prepare on the owning feature branch, "
            "resolve any conflicts, rerun validation and push again."
        )


def install_hook(repo):
    configured = git(repo, "config", "--get", "core.hooksPath", check=False)
    if configured.returncode not in (0, 1):
        raise GuardError(configured.stderr.strip() or "Unable to inspect the hook configuration.")
    if configured.returncode == 0:
        raise GuardError("A custom core.hooksPath is configured. Preserve it and integrate the freshness guard explicitly.")
    common = Path(git(repo, "rev-parse", "--git-common-dir").stdout.strip())
    if not common.is_absolute():
        common = repo / common
    hook = common.resolve() / "hooks" / "pre-push"
    hook.parent.mkdir(parents=True, exist_ok=True)
    expected = HOOK.encode("utf-8")
    try:
        descriptor = os.open(hook, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o755)
    except FileExistsError:
        if hook.is_symlink() or hook.read_bytes() != expected:
            raise GuardError("An existing pre-push hook was preserved. Integrate the freshness guard explicitly.")
    else:
        with os.fdopen(descriptor, "wb") as output:
            output.write(expected)
    hook.chmod(0o755)
    print("Installed the local freshness guard for this checkout and its linked worktrees.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", default=".", help="Repository working directory")
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("prepare", help="Merge current main into a clean feature branch")
    commands.add_parser("install-hook", help="Install the local pre-push guard safely")
    push = commands.add_parser("check-push", help="Check the exact commits selected by Git")
    push.add_argument("remote")
    push.add_argument("url")
    args = parser.parse_args()
    try:
        repo = root_for(args.repo)
        if args.command == "prepare":
            prepare(repo)
        elif args.command == "install-hook":
            install_hook(repo)
        else:
            check_push(repo, args.remote, sys.stdin)
    except (GuardError, OSError) as error:
        print(str(error), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
