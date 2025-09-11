const { isValidEmail } = require("../app/common");

describe("isValidEmail", () => {
  test("accepts email", () => {
    expect(isValidEmail("jacob@jacob.com")).toBe(true);
  });
  test("accepts email", () => {
    expect(isValidEmail("jacob@jacob.org")).toBe(true);
  });
  test("accepts email", () => {
    expect(isValidEmail("jacob@jacob.net")).toBe(true);
  });
  test("rejects random string", () => {
    expect(isValidEmail("afoiejwf")).toBe(false);
  });
  test("rejects number", () => {
    expect(isValidEmail("1234567890")).toBe(false);
  });
  test("rejects empty string", () => {
    expect(isValidEmail(""));
  });
});
