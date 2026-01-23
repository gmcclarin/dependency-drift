import {
  SnapshotParseError,
  SnapshotReadError,
} from "../../core/errors/DependencySourceError";
import { DependencySource } from "../../core/ports/DependencySource";
import { DependencySnapshot } from "../../core/types";
import * as fs from "fs/promises";

type PackageLock = {
  packages?: Record<
    string,
    {
      version?: string;
    }
  >;
};

export class PackageLockDependencySource implements DependencySource {
  constructor(private filePath: string) {}

  async getSnapshot(): Promise<DependencySnapshot> {
    let raw: string;
    try {
      raw = await fs.readFile(this.filePath, "utf-8");
    } catch (error) {
      throw new SnapshotReadError(
        `Failed to read package-lock.json at ${this.filePath}`
      );
    }

    let pkg: PackageLock;
    try {
      pkg = JSON.parse(raw);
    } catch (error) {
      throw new SnapshotParseError(
        `Invalid JSON in package.json at ${this.filePath}`
      );
    }

    const dependencies: Record<string, string> = {};
    for (const [pkgPath, pkgInfo] of Object.entries(pkg.packages ?? {})) {
      // skip root metadata entry
      if (pkgPath === "") continue;

      if (!pkgInfo.version) continue;

      // "node_modules/react" → "react"
      const name = pkgPath.split("/").pop();
      if (!name) continue;

      dependencies[name] = pkgInfo.version;
    }

    return {
      dependencies,
    };
  }
}
