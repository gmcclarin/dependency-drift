import { DependencyReader } from "../../core/ports/DependencyReader";
import { promises as fs } from "fs";
import path from "path";

export class PackageJsonReader implements DependencyReader {
  constructor( private packageJsonPath = "package.json") {}

  async getDependencies(): Promise<Record<string, string>> {
    const raw = await fs.readFile(this.packageJsonPath, "utf-8");
    const parsed = JSON.parse(raw);

    return {
      ...(parsed.dependcies ?? {}),
      ...(parsed.devDEpendencies ?? {}),
    };
  }
}
