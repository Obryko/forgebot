# ADR 0001: Plugin Architecture

## Status

Accepted

## Context

ForgeBot should be built as an extensible automation engine, not as a single hardcoded GitHub bot.

The project starts with GitHub support, but the core should not depend directly on GitHub-specific concepts such as pull
requests, check runs, or GitHub App installations. These concepts should be mapped by provider-specific adapters into
ForgeBot’s internal event model.

We need a simple way to add independent capabilities such as Dependabot handling, coverage checks, AI review,
auto-approval, auto-merge, security checks, and notifications.

## Decision

ForgeBot Core will use a plugin-based architecture.

A plugin exposes:

- `name` — stable plugin identifier
- `supports(event)` — decides whether the plugin should run for a given event
- `run(context)` — executes plugin logic and returns a `PluginResult`

The core package provides a `runPlugins()` function that:

1. receives a list of plugins and a `ForgeBotContext`,
2. runs plugins sequentially,
3. skips unsupported plugins,
4. collects results from executed plugins,
5. converts thrown errors into failed `PluginResult` objects,
6. does not stop the whole pipeline when one plugin fails.

## Why sequential execution?

Plugins are executed sequentially for now.

This keeps the first implementation simple and deterministic. Plugin order may matter later, especially when plugins
produce facts or decisions used by later stages.

Parallel execution can be added later if needed.

## Consequences

### Positive

- Core stays independent from GitHub-specific APIs.
- New behavior can be added as plugins.
- Plugins are easy to test in isolation.
- Failures are contained per plugin.
- The execution pipeline is deterministic.

### Negative

- Sequential execution may be slower than parallel execution.
- Plugin ordering needs to be managed carefully as the system grows.
- More abstractions are introduced early in the project.

## Future work

Potential future improvements:

- plugin categories,
- plugin ordering / priorities,
- shared plugin state,
- structured plugin facts,
- policy engine integration,
- parallel execution for independent plugins,
- richer error model,
- plugin-level configuration.
