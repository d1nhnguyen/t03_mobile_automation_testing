const { byTestId } = require("../config/locators");

class LoginPage {
  constructor(driver) {
    this.driver = driver;
  }

  get screen() {
    return this.driver.$(byTestId("login-screen"));
  }

  get emailInput() {
    return this.driver.$(byTestId("login-email"));
  }

  get passwordInput() {
    return this.driver.$(byTestId("login-password"));
  }

  get submitButton() {
    return this.driver.$(byTestId("login-submit"));
  }

  get errorMessage() {
    return this.driver.$(byTestId("login-error"));
  }

  async signIn(email, password) {
    await (await this.emailInput).setValue(email);
    await (await this.passwordInput).setValue(password);
    await (await this.submitButton).click();
  }
}

module.exports = { LoginPage };
