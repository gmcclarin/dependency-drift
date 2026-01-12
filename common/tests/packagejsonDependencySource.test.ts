import * as fs from "fs/promises";
import * as path from "path";

import { PackageJsonDependencySource } from "../adapters/packageJson/PackageJsonDependencySource";

describe("PackageJsonDependencySource", () => {
    const tempDir = path.join(__dirname, "__testdata__");
    const packageJsonPath = path.join(tempDir, "package.json");

    beforeAll(async () => {
        await fs.mkdir(tempDir, { recursive: true})

        const packageJson = {
             dependencies: {
        react: "^18.2.0",
      },
      devDependencies: {
        jest: "^29.0.0",
      },
        }

        await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf-8"
    );
    });

    afterAll(async () => {
        await fs.rm(tempDir, {recursive: true, force: true})
    });

    it("merges dependencies and devDependencies into one snapshot", async () => {
        const source = new PackageJsonDependencySource(packageJsonPath)
        const snapshot = await source.getSnapshot();

        expect(snapshot.dependencies).toEqual({
      react: "^18.2.0",
      jest: "^29.0.0",
    });

    })
})