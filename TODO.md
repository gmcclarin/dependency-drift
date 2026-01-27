# 📌 TODO.md — Dependency Drift Detector

A running log of what’s implemented, what’s planned, and what edge cases are intentionally deferred.

## ✅ Completed / Implemented

### Core Architecture

 Established hexagonal (ports & adapters) architecture

 Separated concerns into:

core (pure business logic)

ports (interfaces / contracts)

adapters (infrastructure & I/O)

cli (delivery mechanism)

 Core logic is framework-agnostic

 CLI depends on core via ports only

### Dependency Snapshot & Drift Detection (Level 1)

 Read dependencies from package.json

 Read resolved versions from package-lock.json

 Compare declared vs resolved dependencies

 Detect:

Version mismatches

Missing dependencies

 Domain types defined:

Dependency

DependencySnapshot

DependencyDiff

 Custom domain errors:

Snapshot read errors

Snapshot parse errors

Format errors

### Outdated Dependency Detection

 Introduced DependencyRegistry / VersionRegistry port

 Designed DetectOutdatedDependenciesService

 Added semantic version comparison via semver

 Defined registry abstraction (core unaware of npm)

 Implement npm registry adapter

 Handle prerelease versions (alpha, beta, rc)

 Handle semver ranges (^, ~, >=)

### CLI

 CLI runs from project root (process.cwd())

 CLI wires adapters together

 CLI outputs human-readable results

 CLI exit codes (0 = clean, 1 = drift detected)

 JSON output mode (--json)

 Quiet mode (--quiet)

 Verbose/debug mode

## 🧠 Assumptions (Intentional)

These are not bugs — they are scoped decisions.

 CLI assumes:

Single Node project

One package.json

Executed from project root

 Only npm (not yarn/pnpm) is supported initially

 No monorepo/workspace support (yet)

 Network access available when checking latest versions

## 🔜 Planned Features
Monorepo / Workspace Support (Level 2)

 check outdated dependencies / recommend action:
    🔧 Update available (direct dependency)
        lodash
        Current: 4.17.19
        Latest: 4.17.21
        Risk: Low (patch) -> what defines risk?
        Action: npm install lodash@latest
        Group By / give a summary:
        ✅ Safe updates (3)
⚠️ Needs review (2)
🔗 Transitive updates (5)

 Detect npm / yarn / pnpm workspaces

 Scan multiple package.json files

 Group drift results per package

 Allow:

--package <name>

--all-packages

 Support nested projects

## GitHub Integration (Level 3)

 Run against remote GitHub repositories

 Fetch repo contents without cloning (GitHub API)

 Support:

Public repos

Authenticated private repos

 GitHub Actions integration

 PR comments with drift summary

## Historical Drift Tracking (Level 4)

 Compare dependency snapshots over time

 Detect “how long behind” a dependency is

 Track dependency staleness trends

 Persist snapshots (local or remote)

## ⚠️ Error Handling & Resilience
File System

 Graceful error if package.json missing

 Graceful error if package-lock.json missing

 Helpful messages for malformed JSON

 Clear messaging for unsupported lockfile versions

## Network / Registry

 Handle npm registry downtime

 Retry logic with backoff

 Timeout handling

 Rate limiting awareness

 Offline mode (--offline)

## Semver Edge Cases

 Non-standard versions ("latest", git URLs)

 Git dependencies

 File-based dependencies

 Private packages

 Scoped packages

## 🧪 Testing
Core

 Unit tests for:

Snapshot comparison

Outdated detection logic

 Pure logic tests (no file/network access)

Adapters

 Adapter tests with:

Mock file systems

Mock registry responses

 Error-path tests

CLI

 CLI integration tests

 Snapshot-based output testing

📦 Packaging & Distribution

 Publish @dep-drift/common

 Publish CLI package

 Versioning strategy

 Changelog

 Binary support (optional)

## 🧭 Nice-to-Haves

 Config file support (dep-drift.config.js)

 Ignore rules

 Dependency allowlist/blocklist

 CI-friendly output

 Markdown report output

 ... Only compare direct dependencies

Ignore transitive deps in the lockfile.
option 1 - only compare direct dependencies
option 2 - Option 2: Add a --transitive flag

