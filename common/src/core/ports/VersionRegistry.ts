
export interface VersionRegistry {
  getLatestVersion(packageName: string): Promise<string>;
}
