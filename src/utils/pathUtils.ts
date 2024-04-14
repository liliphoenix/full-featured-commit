import path from "path";

function posixJoinUtils(...pth: string[]) {
  return path.posix.join(...pth);
}
export { posixJoinUtils };
