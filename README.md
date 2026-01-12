# Dependency Drift Detector

A developer tool that detects **dependency drift** between declared dependencies
(e.g. `package.json`) and resolved dependencies (e.g. `package-lock.json`) across
GitHub repositories.

The goal is to surface:
- Outdated or unintentionally upgraded packages
- Lockfile drift across environments
- Configuration inconsistencies that can lead to production risk

---

## What is Dependency Drift?

Dependency drift occurs when:
- `package.json` and `package-lock.json` disagree
- Local installs differ from CI or production
- Dependencies change indirectly through transitive updates

This tool helps teams **see drift early**, before it becomes a runtime issue.

---

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

---

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

---

## Monorepo Structure (WIP)

