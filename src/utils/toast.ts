import chalk from "chalk";
function ErrorToast(msg: string) {
  console.log(chalk.red("\nError:" + msg));
}
function WarningToast(msg: string) {
  console.log(chalk.yellow("\nWarning:" + msg));
}
function SuccessToast(msg: string) {
  console.log(chalk.green("\nSuccess:" + msg));
}
export { ErrorToast, WarningToast, SuccessToast };
