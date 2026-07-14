# ADRs (Architecture Decision Records)

Architecture Decision Records (ADRs) document important architectural decisions made during the development of ForgeBot.

They are **not** intended to describe every change in the project. Instead, they capture decisions that significantly influence the project's architecture or long-term direction.

## When to create an ADR

Create a new ADR when a decision:

- introduces a new architectural pattern,
- changes the public architecture,
- affects multiple packages,
- is difficult or expensive to reverse,
- is expected to influence future development.

Examples:

- Plugin architecture
- Provider abstraction
- Action model
- Repository abstraction
- Configuration hierarchy
- Job processing model
- Marketplace architecture

## When NOT to create an ADR

Do **not** create an ADR for:

- bug fixes,
- refactoring,
- package renames,
- implementation details,
- test improvements,
- formatting or tooling changes.

These belong in commits, pull requests or regular documentation.

## ADR Format

Each ADR should describe:

1. Context
2. Problem
3. Considered options
4. Decision
5. Consequences

## Naming

Store ADRs using incremental numbering.

Example:

```text
0001-plugin-architecture.md
0002-provider-abstraction.md
0003-action-model.md
```

Numbers should never be reused, even if an ADR is later superseded.

## Superseding ADRs

Architecture evolves.

When a decision changes:

- create a new ADR,
- reference the previous one,
- mark the previous ADR as superseded.

Do not rewrite historical ADRs.
