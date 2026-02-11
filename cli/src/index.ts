#!/usr/bin/env node

import {
  SnapshotReadError,
  SnapshotFormatError,
  SnapshotParseError,
} from "@dep-drift/common";
import { runCompareCommand } from "./commands/compare";
import { runCheckCommand } from "./commands/check";
import { runGithubCommand } from "./commands/runGithubCommand";

const [, , command, ...args] = process.argv;
// command dep-drift compare package.json package-lock.json

async function main() {
  try {
    switch (command) {
      case "compare":
        await runCompareCommand(args);
        break;
      case "check":
        await runCheckCommand(args);
        break;
      case "github":
        await runGithubCommand(args);
        break;
      default:
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
  if (error instanceof SnapshotParseError) {
    console.error("Failed to parse dependency source");
  }
  if (error instanceof SnapshotFormatError) {
    console.error("Failed to format dependency source");
  }
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown error occurred");
  }
  process.exit(1);
}

main();
