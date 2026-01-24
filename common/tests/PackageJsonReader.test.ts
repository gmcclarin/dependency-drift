import { PackageJsonReader } from "../src/adapters/packageJson/PackageJsonReader";
import { promises as fs } from "fs";
import path from "path";

describe("PackageJsonReader", () => {
  const tempDir = path.join(__dirname, ".tmp-package-json-reader");
  const packageJsonPath = path.join(tempDir, "package.json");

  beforeAll(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterAll(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("returns merged dependencies and devDependencies", async () => {
    const packageJson = {
      dependencies: {
        react: "^18.0.0",
      },
      devDependencies: {
        jest: "^29.0.0",
      },
    };

    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf-8",
    );

    const reader = new PackageJsonReader(packageJsonPath);
    const deps = await reader.getDependencies();

    expect(deps).toHaveProperty("react", "^18.0.0");
    expect(deps).toHaveProperty("jest", "^29.0.0");
  });

  it("returns an empty object when no dependencies exist", async () => {
    await fs.writeFile(
      packageJsonPath,
      JSON.stringify({ name: "test" }, null, 2),
      "utf-8",
    );

    const reader = new PackageJsonReader(packageJsonPath);
    const deps = await reader.getDependencies();

    expect(deps).toEqual({});
  });
});
