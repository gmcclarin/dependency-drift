import { AssessDependencyService } from "../src/core/usecases/AssessDependencyService";
import { RiskLevel } from "../src/core/types/risk";
import { DependencyReader } from "../src/core/ports/DependencyReader";
import {VersionRegistry } from "../src/core/ports/VersionRegistry";

describe("AssessDependencyService", () => {
  let reader: jest.Mocked<DependencyReader>;
  let registry: jest.Mocked<VersionRegistry>;
  let service: AssessDependencyService;

  beforeEach(() => {
    reader = {
      getDependencies: jest.fn(),
    };

    registry = {
      getLatestVersion: jest.fn(),
    };

    service = new AssessDependencyService(reader, registry);
  });

  it("returns empty array when no dependencies are outdated", async () => {
    reader.getDependencies.mockResolvedValue({
      react: "18.2.0",
    });

    registry.getLatestVersion.mockResolvedValue("18.2.0");

    const result = await service.execute();

    expect(result).toEqual([]);
  });

  it("returns outdated dependency with LOW risk for patch update", async () => {
    reader.getDependencies.mockResolvedValue({
      react: "18.2.0",
    });

    registry.getLatestVersion.mockResolvedValue("18.2.1");

    const result = await service.execute();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: "react",
      currentVersion: "18.2.0",
      latest: "18.2.1",
      risk: {
        level: RiskLevel.LOW,
        reasons: ["PATCH_UPDATE"],
      },
    });
  });

  it("assigns HIGH risk for major updates", async () => {
    reader.getDependencies.mockResolvedValue({
      react: "17.0.0",
    });

    registry.getLatestVersion.mockResolvedValue("18.0.0");

    const result = await service.execute();

    expect(result[0].risk.level).toBe(RiskLevel.HIGH);
    expect(result[0].risk.reasons).toContain("MAJOR_UPDATE");
  });

  it("assigns HIGH risk when latest is prerelease", async () => {
    reader.getDependencies.mockResolvedValue({
      react: "18.2.0",
    });

    registry.getLatestVersion.mockResolvedValue("19.0.0-beta.1");

    const result = await service.execute();

    expect(result[0].risk.level).toBe(RiskLevel.HIGH);
    expect(result[0].risk.reasons).toContain("PRERELEASE_VERSION");
  });

  it("assigns MEDIUM risk for zero-major versions", async () => {
    reader.getDependencies.mockResolvedValue({
      foo: "0.3.0",
    });

    registry.getLatestVersion.mockResolvedValue("0.4.0");

    const result = await service.execute();

    expect(result[0].risk.level).toBe(RiskLevel.MEDIUM);
    expect(result[0].risk.reasons).toContain("ZERO_MAJOR_VERSION");
  });

  it("ignores dependencies with invalid semver", async () => {
    reader.getDependencies.mockResolvedValue({
      weird: "github:foo/bar",
    });

    registry.getLatestVersion.mockResolvedValue("1.0.0");

    const result = await service.execute();

    expect(result).toEqual([]);
  });
});
