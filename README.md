# ForgeBot

> Plugin-first, self-hosted Git platform automation engine.

ForgeBot automates repository workflows using a provider-agnostic plugin architecture. The project is designed to work with GitHub first, while keeping the core independent from any specific Git platform to support future providers such as GitLab and Bitbucket.

## Goals

- Self-hosted first
- Plugin-first architecture
- Provider-agnostic core
- Strongly typed APIs
- File-first configuration
- Extensible automation platform

## Current Status

ForgeBot is currently under active development.

The foundation is being built before implementing production features such as GitHub App authentication, AI review and automerge.

## Documentation

Project documentation is available in the [`docs`](./docs) directory.

- 📖 [Documentation Index](./docs/README.md)
- 🏗️ [Project Context](./docs/PROJECT_CONTEXT.md)
- 🗺️ [Roadmap](./docs/ROADMAP.md)
- 📝 [Architecture Decision Records](./docs/adr/README.md)
- 🤖 [AI Context](./docs/AI_CONTEXT.md)

## Project Structure
```mermaid
flowchart LR
    GitHub[GitHub Webhooks] --> Worker[apps/worker]
    Worker --> GitHubAdapter[@forgebot/github]
    GitHubAdapter --> Core[@forgebot/core]
    Core --> Plugins[ForgeBot Plugins]
    Plugins --> Repository[@forgebot/repository]
    Worker --> Config[@forgebot/config]
    Worker --> Jobs[@forgebot/jobs]
    Worker --> Logger[@forgebot/logger]
```
```text
apps/
  worker/

packages/
  core/
  config/
  github/
  jobs/
  logger/
  plugins/
  repository/
  testing/
```

## Development

Install dependencies:

```bash
bun install
```

Run the full project validation:

```bash
bun check
```

## License

License information will be added before the first public release.
