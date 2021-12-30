export function padNumber(num: number, size: number): string {
  let res = String(num);
  while (res.length < size) {
    res = `0${res}`;
  }
  return res;
}
