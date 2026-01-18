
export interface DependencyReader {
  getDependencies(): Promise<Record<string, string>>;
}
