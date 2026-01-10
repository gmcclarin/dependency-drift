import { DependencySource } from "../../core/ports/DependencySource";
import { DependencySnapshot } from "../../core/types";
import fs from "fs/promises";
import path from "path";

/**
 * This file:
 * reads packagejson files
 * parses JSON
 * merges dev + 
 */

/** IT DOES NOT:
 * No diffing
 * No logging
 * No formatting
 * No CLI stuff
 */


type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};


export class PackageJsonDependencySource implements DependencySource {
    constructor(private filePath: string) {};

    async getSnapshot(): Promise<DependencySnapshot> {
        const raw = await fs.readFile(this.filePath, "utf-8");
        const pkg: PackageJson = JSON.parse(raw);

        return {
            dependencies: {
                ...(pkg.dependencies ?? {}),
                ...(pkg.devDependencies ?? {}),
            }
        }

    }
}