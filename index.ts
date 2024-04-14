import { PackageFile } from "./src/core/packageFile/PackageFile";
import { readJsonFile } from "./src/utils/fsUtils";
import { posixJoinUtils } from "./src/utils/pathUtils";

// 在工程中添加相应的script
function execute() {
  const packageJson = readJsonFile(
    posixJoinUtils(process.cwd(), "package.json")
  );

  const packageFile = new PackageFile(packageJson);
  packageFile.runDoctor();
}
function main() {
  execute();
}
export default main;
