# Current Decisions

## Configuration

Deployment config:
- forgebot.instance.yml

Repository config:
- .github/forgebot.yml (planned)

Plugin config:
- forgebot.plugins.yml (planned)

---

## Architecture

Core is provider agnostic.

GitHub specific logic lives in @forgebot/github.

Plugins communicate through domain abstractions.

---

## Planned

Action model.

Repository abstraction.

Jobs.
