import { DEFAULT_SETTINGS, AutoBulletSettings } from "../../src/settings";

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
});
