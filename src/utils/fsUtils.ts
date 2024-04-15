import { PackageJson } from "../types/packageType";
import fs from "fs";
import { posixJoinUtils } from "./pathUtils";
import { SuccessToast } from "./toast";

function readJsonFile(pth: string): PackageJson {
  const jsonFile = fs.readFileSync(pth).toString();
  return JSON.parse(jsonFile);
}

function isFileExists(path: string): Boolean {
  try {
    fs.accessSync(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

function writeFile(path: string, data: string) {
  try {
    fs.writeFile(path, data, () => {});
    SuccessToast("Write file success!");
  } catch (error) {}
}
export { readJsonFile, isFileExists, writeFile };
