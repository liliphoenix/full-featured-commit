import path from "path";

function posixJoinUtils(...pth: string[]) {
  return path.posix.join(...pth);
}
function posixGetBasename(pth: string): string {
  return path.posix.basename(pth);
}
export { posixJoinUtils, posixGetBasename };
