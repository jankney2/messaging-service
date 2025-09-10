const { isValidPhoneNumber } = require("../common");

describe("isValidPhoneNumber", () => {
  test("accepts number with +country code", () => {
    expect(isValidPhoneNumber("+12228889999")).toBe(true);
  });

  test("accepts number with hyphens", () => {
    expect(isValidPhoneNumber("222-888-9999")).toBe(true);
  });

  test("accepts number with spaces", () => {
    expect(isValidPhoneNumber("222 888 9999")).toBe(true);
  });

  test("rejects too short number", () => {
    expect(isValidPhoneNumber("888999")).toBe(false);
  });
  test("rejects email", () => {
    expect(isValidPhoneNumber("jacob@jacob.com")).toBe(false);
  });
  test("rejects random string", () => {
    expect(isValidPhoneNumber("afoiejwf")).toBe(false);
  });
});
