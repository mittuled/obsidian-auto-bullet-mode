import { DEFAULT_SETTINGS, AutoBulletSettings, validateCheckboxShortcut } from "../../src/settings";

describe("Settings", () => {
  describe("DEFAULT_SETTINGS", () => {
    it("should have autoBulletEnabled set to true", () => {
      expect(DEFAULT_SETTINGS.autoBulletEnabled).toBe(true);
    });
  });

  describe("Object.assign merging", () => {
    it("produces defaults when saved data is null", () => {
      const result: AutoBulletSettings = Object.assign(
        {},
        DEFAULT_SETTINGS,
        null,
      );
      expect(result.autoBulletEnabled).toBe(true);
    });

    it("produces defaults when saved data is undefined", () => {
      const result: AutoBulletSettings = Object.assign(
        {},
        DEFAULT_SETTINGS,
        undefined,
      );
      expect(result.autoBulletEnabled).toBe(true);
    });

    it("preserves saved data when present", () => {
      const saved = { autoBulletEnabled: false };
      const result: AutoBulletSettings = Object.assign(
        {},
        DEFAULT_SETTINGS,
        saved,
      );
      expect(result.autoBulletEnabled).toBe(false);
    });

    it("preserves missing fields from defaults when saved data is partial", () => {
      const saved = {};
      const result: AutoBulletSettings = Object.assign(
        {},
        DEFAULT_SETTINGS,
        saved,
      );
      expect(result.autoBulletEnabled).toBe(true);
    });
  });

  describe("checkboxShortcut defaults", () => {
    it("should have checkboxShortcut set to 't' by default", () => {
      expect(DEFAULT_SETTINGS.checkboxShortcut).toBe("t");
    });

    it("preserves checkboxShortcut from saved data", () => {
      const saved = { checkboxShortcut: "x" };
      const result: AutoBulletSettings = Object.assign(
        {},
        DEFAULT_SETTINGS,
        saved,
      );
      expect(result.checkboxShortcut).toBe("x");
    });

    it("defaults checkboxShortcut when saved data is null", () => {
      const result: AutoBulletSettings = Object.assign(
        {},
        DEFAULT_SETTINGS,
        null,
      );
      expect(result.checkboxShortcut).toBe("t");
    });
  });

  describe("validateCheckboxShortcut", () => {
    it("accepts single alphanumeric characters", () => {
      expect(validateCheckboxShortcut("t")).toBe("t");
      expect(validateCheckboxShortcut("x")).toBe("x");
      expect(validateCheckboxShortcut("T")).toBe("T");
      expect(validateCheckboxShortcut("5")).toBe("5");
    });

    it("returns empty string for empty input (disable shortcut)", () => {
      expect(validateCheckboxShortcut("")).toBe("");
    });

    it("truncates multi-char input to first character", () => {
      expect(validateCheckboxShortcut("abc")).toBe("a");
    });

    it("rejects conflicting characters by returning empty string", () => {
      expect(validateCheckboxShortcut("/")).toBe("");
      expect(validateCheckboxShortcut("#")).toBe("");
      expect(validateCheckboxShortcut(">")).toBe("");
      expect(validateCheckboxShortcut("`")).toBe("");
      expect(validateCheckboxShortcut(" ")).toBe("");
    });

    it("rejects non-alphanumeric characters", () => {
      expect(validateCheckboxShortcut("!")).toBe("");
      expect(validateCheckboxShortcut("@")).toBe("");
      expect(validateCheckboxShortcut("-")).toBe("");
    });
  });
});
