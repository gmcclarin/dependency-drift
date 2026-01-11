import { DependencySource } from "../../core/ports/DependencySource";
import { DependencySnapshot } from "../../core/types";
import fs from "fs/promises";

/**
 * Adapter is responsible for 
 * reading packagejson.lock from disk
 * parse lock file
 * merges devDependencies + dependencies
 */

/** Out of scope:
 * diffing
 * logging
 * formatting
 * CLI concerns
 */