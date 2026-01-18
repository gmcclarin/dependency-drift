import { VersionRegistry } from "../../core/ports/VersionRegistry";

export class NpmRegistryAdapter implements VersionRegistry {
  async getLatestVersion(pkg: string): Promise<string> {
    const encodedPkg = encodeURIComponent(pkg);
    const response = await fetch(`https://registry.npmjs.org/${encodedPkg}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch npm package "${pkg}": ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    const latest = data?.["dist-tags"]?.latest;
    if (!latest) {
      throw new Error(`No latest version found for npm package "${pkg}"`);
    }

    return latest;
  }
}
