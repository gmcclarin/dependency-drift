import { DependencyReader } from "../../core/ports/DependencyReader";
import { promises as fs } from "fs";
import path from "path";

export class PackageJsonReader implements DependencyReader {
  async getDependencies(): Promise<Record<string, string>> {
    const packageJsonPath = path.join(process.cwd(), "package.json");

    const raw = await fs.readFile(packageJsonPath, "utf-8");
    const parsed = JSON.parse(raw);

    return {
      ...(parsed.dependcies ?? {}),
      ...(parsed.devDEpendencies ?? {}),
    };
  }
}
