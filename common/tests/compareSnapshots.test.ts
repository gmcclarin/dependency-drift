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

    expect(diff.removed).toEqual([{name: "axios", version: "1.4.0"}]);

    expect(diff.changed).toEqual([{name: "react", from:"18.2.0", to: "18.3.0"}])
  });
});
