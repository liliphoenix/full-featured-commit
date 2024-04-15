import { PackageJson } from "../../types/packageType";
import { isFileExists, writeFile } from "../../utils/fsUtils";
import { getDependencies } from "../../utils/getDependencies";
import { posixJoinUtils } from "../../utils/pathUtils";
import { ErrorToast, SuccessToast } from "../../utils/toast";
import chalk from "chalk";

class PackageFile {
  packageFile: PackageJson;
  ShouldInstallDependencies: string[];
  constructor(packageJson: PackageJson) {
    this.packageFile = packageJson;
    this.ShouldInstallDependencies = [];
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
  scanDependencies() {
    this.ShouldInstallDependencies = getDependencies([
      "cz-customizable",
      "commitlint-config-gitmoji",
      "husky",
    ]);
    if (this.ShouldInstallDependencies.length === 0) {
      this.installDependencies();
    } else {
      this.writeConfig();
    }
  }
  installDependencies() {}
  writeConfig() {}
}
export { PackageFile };
