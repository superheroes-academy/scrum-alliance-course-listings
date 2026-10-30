"""Exercise the publication boundary with synthetic local files."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("build_pages", Path(__file__).resolve().parents[1] / "scripts/build-pages.py")
pages = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pages)


class PublicationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / "repo"
        self.root.mkdir()
        self.output = Path(self.temp.name) / "public"
        self.put("CNAME", "courses.superheroes.academy\n")
        self.put("cspo.html", "<html><body>Course</body></html>")

    def put(self, name, text):
        p = self.root / name
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text)
        return p

    def validate(self, *extra):
        return pages.validate(self.root, ["CNAME", "cspo.html", *extra])

    def test_existing_pages_keep_exact_bytes(self):
        self.put("images/logo.svg", "<svg/>")
        names = ["CNAME", "cspo.html", "images/logo.svg"]
        self.assertEqual(pages.build(self.root, self.output, names), sorted(names))
        for name in names:
            self.assertEqual((self.output / name).read_bytes(), (self.root / name).read_bytes())

    def test_development_files_are_excluded(self):
        names = ["scripts/helper.py", "tests/test_helper.py", "docs/notes.md", ".env", ".github/workflows/pages.yml", ".vscode/settings.json"]
        for n in names:
            self.put(n, "synthetic internal data")
        self.assertEqual(self.validate(*names), ["CNAME", "cspo.html"])

    def test_source_traversal_is_rejected(self):
        for name in ["../escape.html", "images/../../escape.svg", "/tmp/escape.html", "images\\escape.svg"]:
            with self.subTest(name=name), self.assertRaises(pages.PublicationError):
                self.validate(name)

    def test_symbolic_link_cannot_publish_private_file(self):
        target = Path(self.temp.name) / "private.html"
        target.write_text("synthetic private data")
        (self.root / "leak.html").symlink_to(target)
        with self.assertRaises(pages.PublicationError):
            self.validate("leak.html")
        self.assertFalse(self.output.exists())

    def test_symbolic_link_directory_is_rejected(self):
        target = Path(self.temp.name) / "private"
        target.mkdir()
        (target / "file.svg").write_text("synthetic private data")
        (self.root / "images").symlink_to(target, target_is_directory=True)
        with self.assertRaises(pages.PublicationError):
            self.validate("images/file.svg")

    def test_known_credential_classes_block_publication(self):
        examples = ["ghp_" + "A" * 36, "github_pat_" + "a" * 70, "xoxb-" + "1" * 30, "sk_live_" + "a" * 25, "sk_test_" + "b" * 25, "-----BEGIN PRIVATE KEY-----"]
        for value in examples:
            with self.subTest(kind=value.split("_")[0]):
                self.put("js/test.js", "const example = '" + value + "';")
                with self.assertRaises(pages.PublicationError):
                    self.validate("js/test.js")

    def test_public_browser_identifiers_remain_allowed(self):
        self.put("js/test.js", "const example = 'pk_live_' + 'synthetic-public-id';")
        self.assertIn("js/test.js", self.validate("js/test.js"))

    def test_wrong_or_missing_hostname_blocks_publication(self):
        for value in ["other.example.invalid", ""]:
            self.put("CNAME", value)
            with self.assertRaises(pages.PublicationError):
                self.validate()
        with self.assertRaises(pages.PublicationError):
            pages.validate(self.root, ["cspo.html"])

    def test_file_size_is_bounded(self):
        old = pages.MAX_FILE
        try:
            pages.MAX_FILE = 1
            with self.assertRaises(pages.PublicationError):
                self.validate()
        finally:
            pages.MAX_FILE = old

    def test_fresh_output_cannot_overwrite_existing_data(self):
        self.output.mkdir()
        original = self.output / "keep.txt"
        original.write_text("synthetic retained data")
        with self.assertRaises(pages.PublicationError):
            pages.build(self.root, self.output, ["CNAME", "cspo.html"])
        self.assertEqual(original.read_text(), "synthetic retained data")

    def test_output_stays_outside_checkout(self):
        with self.assertRaises(pages.PublicationError):
            pages.build(self.root, self.root / "public", ["CNAME", "cspo.html"])

    def test_build_waits_for_all_validation(self):
        self.put("bad.html", "ghp_" + "z" * 36)
        with self.assertRaises(pages.PublicationError):
            pages.build(self.root, self.output, ["CNAME", "cspo.html", "bad.html"])
        self.assertFalse(self.output.exists())
