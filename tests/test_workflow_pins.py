"""Reject movable action dependencies in the publication workflow."""
from pathlib import Path
import re
import unittest


class WorkflowPinsTests(unittest.TestCase):
    def test_publication_actions_use_immutable_revisions(self):
        source = (Path(__file__).resolve().parents[1] / ".github/workflows/pages.yml").read_text()
        references = re.findall(r'''^\s*(?:-\s*)?uses:\s*["']?([^"'\s#]+)''', source, re.MULTILINE)
        self.assertEqual(len(references), 4)
        for reference in references:
            with self.subTest(reference=reference):
                self.assertRegex(reference, r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_./-]+@[a-f0-9]{40}$")
        self.assertFalse(any(reference.startswith("actions/upload-pages-artifact@") for reference in references))


if __name__ == "__main__":
    unittest.main()
