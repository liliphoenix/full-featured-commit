import { ChildProcess, spawn, execSync } from "child_process";
import { PackageJson } from "../../types/packageType";
import { isFileExists, writeFile } from "../../utils/fsUtils";
import { getDependencies } from "../../utils/getDependencies";
import { posixJoinUtils } from "../../utils/pathUtils";
import { ErrorToast, WarningToast } from "../../utils/toast";
import inquirer from "inquirer";
import chalk from "chalk";
import { WriteCommitlintConfig, WriteCzConfig } from "../configFile/configFile";
const prompt = inquirer.createPromptModule();
class PackageFile {
  packageFile: PackageJson;
  ShouldInstallDependencies: string[];
  packageManager: "npm" | "pnpm" | "yarn";
  constructor(packageJson: PackageJson) {
    this.packageFile = packageJson;
    this.ShouldInstallDependencies = [];
    this.packageManager = "npm";
  }
  runDoctor(type: string) {
    //检查一下有没有安装git环境;
    switch (type) {
      case "base":
        const isPackageJsonExits = isFileExists(
          posixJoinUtils(process.cwd(), "package.json")
        );
        const isGitExits = isFileExists(posixJoinUtils(process.cwd(), ".git"));
        const isNodeModules = isFileExists(
          posixJoinUtils(process.cwd(), ".git")
        );

        if (isPackageJsonExits) {
          console.log(chalk.green("\npackage.json ✅"));
        } else {
          ErrorToast("❌ No package.json found in your project");
        }
        if (isNodeModules) {
          console.log(chalk.green("\nnode_modules ✅"));
        } else {
          ErrorToast("❌ No git found in your project");
        }
        if (isGitExits) {
          console.log(chalk.green("\ngit ✅\n"));
        } else {
          ErrorToast("❌ No git found in your project");
        }

        break;
      case "config":
        break;
      case "dependency_modules":
        const isYarn = isFileExists(posixJoinUtils(process.cwd(), "yarn.lock"));
        const isPnpm = isFileExists(
          posixJoinUtils(process.cwd(), "pnpm-lock.yaml")
        );
        try {
          execSync("npm --version");
          this.packageManager = "npm";
        } catch (error) {
          ErrorToast(
            "You Package manager is npm , but we do not find npm in your system \n so here we start to using npm manager"
          );
          return;
        }
        if (isYarn) {
          try {
            execSync("yarn --version");
            this.packageManager = "yarn";
            console.log(chalk.green("\nyarn ✅\n"));
          } catch (error) {
            WarningToast(
              "You Package manager is Yarn , but we do not find yarn in your system \n so here we start to using npm manager"
            );
            this.packageManager = "npm";
          }
        } else if (isPnpm) {
          try {
            execSync("pnpm --version");
            this.packageManager = "pnpm";
            console.log(chalk.green("\npnpm ✅\n"));
          } catch (error) {
            WarningToast(
              "You Package manager is Pnpm , but we do not find Pnpm in your system \n so here we start to using npm manager"
            );
            this.packageManager = "npm";
          }
        }
        break;
      default:
        break;
    }
  }
  addScript() {
    const writeScript = () => {
      this.packageFile.scripts = {
        ...this.packageFile.scripts,
        commit: "git add . && cz-customizable",
      };
      writeFile(
        posixJoinUtils(process.cwd(), "package.json"),
        JSON.stringify(this.packageFile, null, 2)
      );
      this.scanDependencies();
    };
    if (this.packageFile.scripts["commit"]) {
      ErrorToast(
        " Filed to write file,script has been existed a script called 'commit'"
      );
      prompt({
        type: "confirm",
        name: "isCover",
        prefix: "",
        message:
          "\nAre you going to cover the commit script you ever written\n",
        default: true,
      }).then((res) => {
        res.isCover ? writeScript() : "";
      });
      return;
    } else {
      writeScript();
    }
  }
  scanDependencies() {
    this.ShouldInstallDependencies = getDependencies([
      "cz-customizable",
      "commitlint-config-gitmoji",
      "husky",
    ]);
    if (this.ShouldInstallDependencies.length === 0) {
      this.writeConfig();
    } else {
      this.installDependencies();
    }
  }
  installDependencies() {
    this.runDoctor("dependency_modules");
    spawn(
      this.packageManager,
      ["install", ...this.ShouldInstallDependencies, "-D"],
      {
        cwd: process.cwd(),
        stdio: "inherit",
      }
    );
  }
  writeConfig() {
    WriteCzConfig();
    WriteCommitlintConfig();
  }
}
export { PackageFile };
