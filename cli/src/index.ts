#!/usr/bin/env node

import {
  SnapshotReadError,
  SnapshotFormatError,
  SnapshotParseError,
} from "@dep-drift/common";
import { runCompareCommand } from "./commands/compare";
import { runCheckCommand } from "./commands/check";
import { parseArguments } from "./utils/parseArguments";

const [, , command, ...rest] = process.argv;
// command dep-drift compare package.json package-lock.json
/**
 * dep-drift check --source local
 * dep-drift check --source github --owner grace --repo dep-drift
 */

async function main() {
  try {
    switch (command) {
      case "compare":
        await runCompareCommand(rest);
        break;
      case "check":
        const args = parseArguments(rest);
        await runCheckCommand(args);
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
