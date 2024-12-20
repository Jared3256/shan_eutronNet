const listAllSettings = require("./listAllSetting");

const loadSettings = async () => {
  const allSettings = {};
  const datas = await listAllSettings();
  datas.forEach(({ settingKey, settingValue }) => {
    allSettings[settingKey] = settingValue;
  });
  return allSettings;
};

module.exports = loadSettings;
