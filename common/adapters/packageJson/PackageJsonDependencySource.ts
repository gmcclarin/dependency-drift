import { DependencySource } from "../../core/ports/DependencySource";
import { DependencySnapshot } from "../../core/types";
import * as fs from "fs/promises";

/**
 * Adapter is responsible for 
 * reading packagejson from disk
 * parse JSON
 * merges devDependencies + dependencies
 */

/** Out of scope:
 * diffing
 * logging
 * formatting
 * CLI concerns
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