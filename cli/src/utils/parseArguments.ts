import { Arguments } from "../factories/DependencyReaderFactory";

export function parseArguments(raw: string[]): Arguments {
  const argsMap: Record<string, string> = {};

  for (let i = 0; i < raw.length; i++) {
    const value = raw[i];

    if (value.startsWith("--")) {
      const key = value.replace("--", "");
      const next = raw[i + 1];

      if (!next || next.startsWith("--")) {
        throw new Error(`Missing value for argument: ${value}`);
      }

      argsMap[key] = next;
      i++;
    }
  }

  const source = argsMap.source;

  if (!source) {
    throw new Error("--source is required (local | github)");
  }
  if (source === "local") {
    return {
      source: "local",
      packageJsonPath: argsMap.path,
    };
  }

  if (source === "github") {
    if (!argsMap.owner || !argsMap.repo) {
      throw new Error("GitHub source requires --owner and --repo");
    }

    return {
      source: "github",
      owner: argsMap.owner,
      repo: argsMap.repo,
      ref: argsMap.ref,
      token: argsMap.token,
    };
  }

  throw new Error(`Unsupported source: ${source}`);
}
