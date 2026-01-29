import {
  SnapshotParseError,
  SnapshotReadError,
} from "../../core/errors/DependencySourceError";
import { DependencySource } from "../../core/ports/DependencySource";
import { DependencySnapshot } from "../../core/types/dependencies";
import * as fs from "fs/promises";

type PackageLock = {
  packages?: Record<
    string,
    {
      version?: string;
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>; // only for root ""
    }
  >;
};

export class PackageLockDependencySource implements DependencySource {
  constructor(
    private filePath: string,
    private includeTransitive = false,
  ) {}

  async getSnapshot(): Promise<DependencySnapshot> {
    let raw: string;
    try {
      raw = await fs.readFile(this.filePath, "utf-8");
    } catch (error) {
      throw new SnapshotReadError(
        `Failed to read package-lock.json at ${this.filePath}`,
      );
    }

    let pkg: PackageLock;
    try {
      pkg = JSON.parse(raw);
    } catch (error) {
      throw new SnapshotParseError(
        `Invalid JSON in package.json at ${this.filePath}`,
      );
    }

    const rootPkg = pkg.packages?.[""] ?? {};
    const directDeps = new Set([
      ...Object.keys(rootPkg.dependencies ?? {}),
      ...Object.keys(rootPkg.devDependencies ?? {}), // only root has devDependencies
    ]);

    const dependencies: Record<string, string> = {};

    // if transitive true, include all packages except root
    for (const [pkgPath, pkgInfo] of Object.entries(pkg.packages ?? {})) {
      // skip root metadata entry
      if (pkgPath === "") continue;
      if (!pkgInfo.version) continue;

      // "node_modules/react" → "react"
      const name = pkgPath.split("/").pop();
      if (!name) continue;

      const isDirect = directDeps.has(name);
      const include = this.includeTransitive || isDirect;

      if (!include) continue;

      dependencies[name] = pkgInfo.version;
    }

    return {
      dependencies,
    };
  }
}
