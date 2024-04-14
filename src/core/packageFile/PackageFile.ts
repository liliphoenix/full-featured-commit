import { PackageJson } from "../../types/packageType";
import { isFileExists, writeFile } from "../../utils/fsUtils";
import { posixJoinUtils } from "../../utils/pathUtils";
import { ErrorToast, SuccessToast } from "../../utils/toast";
import chalk from "chalk";

class PackageFile {
  packageFile: PackageJson;
  constructor(packageJson: PackageJson) {
    this.packageFile = packageJson;
  }
  runDoctor() {
    //检查一下有没有安装git环境;
    const isPackageJsonExits = isFileExists(
      posixJoinUtils(process.cwd(), "package.json")
    );
    const isGitExits = isFileExists(posixJoinUtils(process.cwd(), ".git"));
    if (isPackageJsonExits) {
      console.log(chalk.green("\npackage.json ✅"));
      if (isGitExits) {
        console.log(chalk.green("\ngit ✅\n"));
        this.addScript();
      } else {
        ErrorToast("❌ No git found in your project");
      }
    } else {
      ErrorToast("❌ No package.json found in your project");
    }
  }
  addScript() {
    if (this.packageFile.scripts["commit"]) {
      ErrorToast(
        " Filed to write file,script has been existed a script called 'commit' \n"
      );
      return;
    } else {
      this.packageFile.scripts = {
        ...this.packageFile.scripts,
        commit: "git add . && cz-customizable",
      };
      writeFile(
        posixJoinUtils(process.cwd(), "package.json"),
        JSON.stringify(this.packageFile, null, 2)
      );
    }
  }
  scanDependencies() {}
}
export { PackageFile };
