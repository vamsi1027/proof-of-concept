function checkPassword(value: string): boolean {
  const passw =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{12,}$/;
  return !!value.match(passw);
}
export default checkPassword;
