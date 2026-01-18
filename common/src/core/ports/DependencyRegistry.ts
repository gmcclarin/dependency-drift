import { DependencyReader } from "./DependencyReader";
import { VersionRegistry } from "./VersionRegistry";

export interface DependencyRegistry {
  dependencyReader: DependencyReader;
  versionRegistry: VersionRegistry;
}
