import * as semver from "semver";

export enum RiskLevel {
  LOW,
  MEDIUM,
  HIGH
};

export type RiskAssessment = {
  level: RiskLevel;
  reasons: string[];
};

export type RiskMetadata = {
  level: RiskLevel;
  description: string;
};

// version semantics
export type RISK_REASON =
  | "MAJOR_UPDATE"
  | "MINOR_UPDATE"
  | "PATCH_UPDATE"
  | "ZERO_MAJOR_VERSION"
  | "PRERELEASE_VERSION";

export const RISK_BY_REASON: Record<RISK_REASON, RiskMetadata> = {
  PATCH_UPDATE: {
    level: RiskLevel.LOW,
    description: "Patch updates usually contain bug fixes only",
  },
  MINOR_UPDATE: {
    level: RiskLevel.MEDIUM,
    description: "Minor updates may introduce new behavior",
  },
  MAJOR_UPDATE: {
    level: RiskLevel.HIGH,
    description: "Major updates may contain breaking changes",
  },

  ZERO_MAJOR_VERSION: {
    level: RiskLevel.MEDIUM,
    description: "0.x versions do not guarantee API stability",
  },

  PRERELEASE_VERSION: {
    level: RiskLevel.HIGH,
    description: "Pre-release versions may be unstable",
  },
};

export type ReasonRule = {
  reason: RISK_REASON;
  when: (input: { current: semver.SemVer; latest: semver.SemVer }) => boolean;
};

export const REASON_RULES: ReasonRule[] = [
  {
    reason: "PRERELEASE_VERSION",
    when: ({ latest }) => Boolean(semver.prerelease(latest)),
  },
  {
    reason: "ZERO_MAJOR_VERSION",
    when: ({ current, latest }) => current.major === 0 || latest.major === 0,
  },
  {
    reason: "PATCH_UPDATE",
    when: ({ current, latest }) => semver.diff(current, latest) === "patch",
  },
  {
    reason: "MINOR_UPDATE",
    when: ({ current, latest }) => semver.diff(current, latest) === "minor",
  },
  {
    reason: "MAJOR_UPDATE",
    when: ({ current, latest }) => semver.diff(current, latest) === "major",
  },
];
