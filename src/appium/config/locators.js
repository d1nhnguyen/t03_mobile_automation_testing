// React Native testID appears as Android resource-id in this EShop build.
const byTestId = (id) => `android=new UiSelector().resourceId("${id}")`;

module.exports = { byTestId };
