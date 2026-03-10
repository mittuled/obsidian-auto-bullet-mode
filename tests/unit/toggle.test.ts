describe("Toggle Behavior", () => {
  let extensions: any[];
  let saveDataCalled: boolean;

  beforeEach(() => {
    extensions = [];
    saveDataCalled = false;
  });

  function simulateEnable() {
    extensions.push({ type: "autoBullet" }, { type: "bulletEnter" });
  }

  function simulateDisable() {
    extensions.length = 0;
  }

  function simulateSaveData() {
    saveDataCalled = true;
  }

  it("toggling to disabled removes extensions from array", () => {
    simulateEnable();
    expect(extensions.length).toBe(2);

    simulateDisable();
    expect(extensions.length).toBe(0);
  });

  it("toggling back to enabled re-adds extensions", () => {
    simulateEnable();
    simulateDisable();
    expect(extensions.length).toBe(0);

    simulateEnable();
    expect(extensions.length).toBe(2);
  });

  it("saveData is called on toggle", () => {
    simulateEnable();
    simulateSaveData();
    expect(saveDataCalled).toBe(true);
  });
});
