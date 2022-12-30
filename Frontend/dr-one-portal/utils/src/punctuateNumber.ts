export default function punctuateNumber(num: number): string {
  if (num !== null && num >= 0) {
    let ret = num.toString();
    let count = 1;
    let idx = 0;
    let addedDots = 0;
    while (num / 10 >= 1) {
      num = num / 10;
      if (count === 3) {
        ret = [ret.slice(0, ret.length - 1 - (idx + addedDots)), '.', ret.slice(ret.length - 1 - (idx + addedDots))].join(
          ''
        );
        count = 0;
        addedDots++;
      }
      idx++;
      count++;
    }
    ret = Number(ret.replace(/\./g, '')) >= 1000000 ? ret.slice(0, 3) + ' M' : `${ret}`;
    return ret;
  }
  return ''
};
