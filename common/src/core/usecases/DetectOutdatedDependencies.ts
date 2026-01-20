import * as semver from "semver";
import { DependencyReader } from "../ports/DependencyReader";
import { VersionRegistry } from "../ports/VersionRegistry";

export class DetectOutdatedDependenciesService  {
    constructor(private reader: DependencyReader, private versionRegistry: VersionRegistry){}

    async execute() {
        const deps = await this.reader.getDependencies();

        const results = [];

        for ( const [name, currentVersion] of Object.entries(deps)) {
            const latest = await this.versionRegistry.getLatestVersion(name);
        

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