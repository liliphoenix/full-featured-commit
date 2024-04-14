import chalk from "chalk";
function ErrorToast(msg: string) {
  console.log(chalk.red("Error:" + msg));
}
function WarningToast(msg: string) {
  console.log(chalk.yellow("Warning:" + msg));
}
function SuccessToast(msg: string) {
  console.log(chalk.green("Success:" + msg));
}
export { ErrorToast, WarningToast, SuccessToast };
