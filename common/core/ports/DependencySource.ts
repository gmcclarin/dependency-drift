import { DependencySnapshot } from "../types";

export interface DependencySource {
  /**
   * Returns a snapshot of dependencies from a source.
   * Examples:
   * - package.json
   * - package-lock.json
   * - npm ls
   * - yarn.lock
   */
  getSnapshot(): Promise<DependencySnapshot>;
}
