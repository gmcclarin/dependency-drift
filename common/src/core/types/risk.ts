export type RiskLevel = "low" | "medium" | "high";

export type RiskAssessment = {
  level: RiskLevel;
  reasons: string[];
};

// version semantics
export type RISK_REASONS =
  | "MAJOR_UPDATE"
  | "MINOR_UPDATE"
  | "PATCH_UPDATE"
  | "ZERO_MAJOR_VERSION"
  | "PRERELEASE_VERSION";
