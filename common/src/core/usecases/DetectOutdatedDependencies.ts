import * as semver from "semver";
import { DependencyRegistry } from "../ports/DependencyRegistry";

export class DetectOutdatedDependenciesService  {
    constructor(private registry: DependencyRegistry){}

    async execute() {
        const deps = await this.registry.dependencyReader.getDependencies();

        const results = [];

        for ( const [name, currentVersion] of Object.entries(deps)) {
            const latest = await this.registry.versionRegistry.getLatestVersion(name);
        

            if ( semver.lt(semver.coerce(currentVersion)!, latest)) {
                results.push({
          name,
          currentVersion,
          latest,
        });
            }
        }

        return results;
    }
    
}