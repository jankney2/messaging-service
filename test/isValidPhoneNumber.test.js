const { isValidPhoneNumber } = require("../common");

describe("isValidPhoneNumber", () => {
  test("accepts number with +country code", () => {
    expect(isValidPhoneNumber("+12228889999").valid).toBe(true);
  });

  test("accepts number with hyphens", () => {
    expect(isValidPhoneNumber("222-888-9999").valid).toBe(true);
  });

  test("accepts number with spaces", () => {
    expect(isValidPhoneNumber("222 888 9999").valid).toBe(true);
  });

  test("rejects too short number", () => {
    expect(isValidPhoneNumber("888999").valid).toBe(false);
  });
  test("rejects email", () => {
    expect(isValidPhoneNumber("jacob@jacob.com").valid).toBe(false);
  });
  test("rejects random string", () => {
    expect(isValidPhoneNumber("afoiejwf").valid).toBe(false);
  });
});
