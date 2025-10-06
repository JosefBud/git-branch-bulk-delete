# git-branch-bulk-delete

A dumb Node script that is meant to be run from any directory to select git branches to delete.

# Prerequisites

- [Bun](https://bun.sh)
  - `curl -fsSL https://bun.sh/install | bash`
- Install dependencies
  - `bun install`

# Usage

This is built with aliasing in mind, and has convenience npm scripts to add the alias to your shell of choice.

```sh
bun run add-alias:zsh
# or
bun run add-alias:bash
# or
./scripts/add-alias.sh path-to-your-shell-config
```
