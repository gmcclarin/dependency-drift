import * as fs from "fs/promises";
import * as path from "path";
import { PackageLockDependencySource } from "../src/adapters/packageLock/PackageLockDependencySource";


describe("PackageLockDependencySource", () => {
  const tempDir = path.join(__dirname, "__locktestdata__");
  const lockFilePath = path.join(tempDir, "package-lock.json");

  beforeAll(async () => {
    await fs.mkdir(tempDir, { recursive: true });

    const packageLock = {
      packages: {
        "": {
          name: "test-project",
          version: "1.0.0",
        },
        "node_modules/react": {
          version: "18.2.0",
        },
        "node_modules/lodash": {
          version: "4.17.21",
        },
      },
    };

    await fs.writeFile(
      lockFilePath,
      JSON.stringify(packageLock, null, 2),
      "utf-8"
    );
  });

   afterAll(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("extracts resolved dependencies from package-lock.json", async () => {
    const source = new PackageLockDependencySource(lockFilePath);
    const snapshot = await source.getSnapshot();

    expect(snapshot.dependencies).toEqual({
      react: "18.2.0",
      lodash: "4.17.21",
    });
  });

});
