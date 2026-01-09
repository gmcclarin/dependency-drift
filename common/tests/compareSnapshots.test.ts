import compareSnapshots from "../core/compareSnapshots";
import { DependencySnapshot } from "../core/types";

describe("compareSnapshots", () => {
  it("detects added, removed, and changed dependencies", () => {
    const snapshotA: DependencySnapshot = {
      dependencies: {
        react: "18.2.0",
        lodash: "4.17.21",
        axios: "1.4.0",
      },
    };

    const snapshotB: DependencySnapshot = {
      dependencies: {
        react: "18.3.0",
        lodash: "4.17.21",
        zod: "3.22.0",
      },
    };

    const diff = compareSnapshots(snapshotA, snapshotB);

    expect(diff.added).toEqual([{ name: "zod", version: "3.22.0" }]);

    expect(diff.removed).toEqual([{ name: "axios", version: "1.4.0" }]);

    expect(diff.changed).toEqual([
      { name: "react", from: "18.2.0", to: "18.3.0" },
    ]);
  });
});

describe("compareSnapshots", () => {
  it("compares two empty snapshots", () => {
    const snapshotA: DependencySnapshot = {
      dependencies: {},
    };

    const snapshotB: DependencySnapshot = {
      dependencies: {},
    };

    const diff = compareSnapshots(snapshotA, snapshotB);

    expect(diff.removed).toEqual([]);
    expect(diff.added).toEqual([]);
    expect(diff.changed).toEqual([]);
  });
});

describe("compareSnapshots", () => {
  it("compares with one empty snapshot correctly", () => {
    const snapshotA: DependencySnapshot = {
      dependencies: {
        react: "18.2.0",
        lodash: "4.17.21",
      },
    };

    const snapshotB: DependencySnapshot = {
      dependencies: {},
    };

    const diff = compareSnapshots(snapshotA, snapshotB);

    expect(diff.added).toEqual([]);
    expect(diff.removed).toEqual(
      expect.arrayContaining([
        { name: "react", version: "18.2.0" },
        { name: "lodash", version: "4.17.21" },
      ])
    );

    expect(diff.removed).toHaveLength(2);
  });
});
