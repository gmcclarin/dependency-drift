export interface DependencyRegistry {
  getLatestVersion(packageName: string): Promise<string>;
}
