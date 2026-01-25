# Dependency Drift Detector

A developer tool that detects **dependency drift** between declared dependencies
(e.g. `package.json`) and resolved dependencies (e.g. `package-lock.json`) across
GitHub repositories.

The goal is to surface:
- Outdated or unintentionally upgraded packages
- Lockfile drift across environments
- Configuration inconsistencies that can lead to production risk

## What is Dependency Drift?

Dependency drift occurs when:
- `package.json` and `package-lock.json` disagree
- Local installs differ from CI or production
- Dependencies change indirectly through transitive updates

This tool helps teams **see drift early**, before it becomes a runtime issue.


## Architecture

This project follows **Hexagonal Architecture (Ports & Adapters)** to ensure:

- Core domain logic is framework-agnostic
- External concerns (filesystem, GitHub, databases, CLI, UI) are isolated
- Business logic is easy to test and reason about

### High-level components

- **Core domain**  
  Pure dependency comparison logic and domain models

- **Adapters**  
  - `package.json` reader  
  - `package-lock.json` reader  
  - (Future) GitHub repository adapter

- **Ports**  
  Interfaces that define how external systems provide dependency snapshots


## Tech Stack

- **Backend**
  - Node.js
  - TypeScript
  - Express
  - PostgreSQL

- **Frontend**
  - React
  - TypeScript

- **Infrastructure**
  - GitHub OAuth
  - Background job workers

## Monorepo Structure (WIP)

/core → domain logic (diffing, models, ports)
/adapters → filesystem, GitHub, database adapters
/api → HTTP API
/worker → background jobs
/web → React frontend

## Project Status

🚧 **Work in progress**

Current focus:
- Dependency snapshot adapters
- Core diffing logic
- Adapter-level unit tests

Planned:
- GitHub repository scanning
- Drift history tracking
- Web UI for visualization
- Alerts & reporting


## Why This Project Exists

Most dependency tools focus on **updates**.
This project focuses on **mismatch and drift**, which often causes:

- “Works on my machine” bugs
- CI vs production discrepancies
- Unexpected breaking changes

This tool is designed to be:
- Transparent
- Testable
- Architecture-first


## Usage

`dep-drift` compares declared dependencies in `package.json` with resolved dependencies in `package-lock.json` to detect **dependency drift**.

### Installation (local development)

If you are working in this monorepo:

```bash
cd cli
npm install
npm run build
npm link
```

This will make the `dep-drift` command available globally on your machine.

---

### Basic Command

Run the command **from the root of a Node.js project** that contains both a `package.json` and a `package-lock.json`:

```bash
dep-drift compare package.json package-lock.json
```

Paths are resolved relative to the current working directory.

---

### What This Does

* Reads declared dependencies from `package.json`
* Reads resolved dependencies from `package-lock.json`
* Compares the two sets
* Outputs a **Dependency Drift Report** showing:

  * Dependencies that were added
  * Dependencies that were removed
  * Dependencies whose versions differ

> ⚠️ Note: At this stage, the tool compares **all resolved dependencies**, including transitive dependencies from the lockfile. This can result in a large list of "Added" dependencies, which is expected behavior.

---

### Example Output

```text
Dependency Drift Report

Added:
  jest-worker@29.7.0
  semver@7.7.2
  ...

Removed:
  (none)

Changed:
  react: ^18.0.0 → 18.2.0
```

---

### Current Limitations

* Transitive dependencies are included by default
* No flags or configuration options yet
* No automatic project root detection

These will be improved in future iterations.

---

### Exit Codes

* `0` — No dependency drift detected
* `1` — Dependency drift detected

This makes `dep-drift` suitable for use in CI pipelines.

