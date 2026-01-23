import {
  SnapshotParseError,
  SnapshotReadError,
} from "../../core/errors/DependencySourceError";
import { DependencySource } from "../../core/ports/DependencySource";
import {DependencySnapshot } from "../../core/types"
import * as fs from "fs/promises";

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export class PackageJsonDependencySource implements DependencySource {
  constructor(private filePath: string) {}

  async getSnapshot(): Promise<DependencySnapshot> {
    let raw: string;

    try {
      raw = await fs.readFile(this.filePath, "utf-8");
    } catch (error) {
      throw new SnapshotReadError(
        `Failed to read package.json at ${this.filePath}`
      );
    }

    let pkg: PackageJson;
    try {
      pkg = JSON.parse(raw);
    } catch (error) {
      throw new SnapshotParseError(
        `Invalid JSON in package.json at ${this.filePath}`
      );
    }

    return {
      dependencies: {
        ...(pkg.dependencies ?? {}),
        ...(pkg.devDependencies ?? {}),
      },
    };
  }
}
