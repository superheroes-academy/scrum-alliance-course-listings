# Course listing publication

These public pages supply the existing course embeds. Their page and asset bytes remain unchanged by the release controls.

Pull requests run the publication boundary tests and validate the public assets. Publishing uses the validated checkout from the same main-branch run. The deployment job receives only Pages publication and deployment identity permissions. Fork validation uses an isolated hosted runner.

The artifact includes the existing course pages, images, fonts, styles and scripts. Development tools, workflow sources, tests, hidden files and documentation stay outside it. Symbolic links, path traversal, oversized artifacts and recognised private credential formats stop publication.

The main branch requires the successful Validate course listings check. Source updates use a current feature branch and a pull request. The local freshness helper assists that workflow; the server-side required check provides the merge restriction. Repository administrators retain the authority to change repository controls.
