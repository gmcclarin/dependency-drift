#!/usr/bin/env node

import { SnapshotFormatError, SnapshotParseError, SnapshotReadError } from "../../common/core/errors/DependencySourceError";
import { runCompareCommand } from "./commands/compare";

const [, , command, ...args] = process.argv;
// dep-drift compare package.json package-lock.json

async function main() {
  try {
    if (command === "compare") {
      await runCompareCommand(args);
    } else {
      console.log("Unknown command");
      process.exit(1);
    }
  } catch (error) {
    handleError(error);
  }
}

function handleError(error: unknown) {
  if (error instanceof SnapshotReadError) {
    console.error("Failed to read dependency source.");
  }
  if ( error instanceof SnapshotParseError) {
    console.error("Failed to parse dependency source");
  }
  if ( error instanceof SnapshotFormatError) {
    console.error("Failed to format dependency source")
  }
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown error occurred");
  }
  process.exit(1);
}

main();
