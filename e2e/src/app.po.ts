import { browser, by, element } from 'protractor';

export class AppPage {
  async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl);
  }

  async clickAddCoffee(): Promise<void> {
    element(by.id('add-coffee-button')).click();
  }

  async isAddCoffeeModalDisplayed(): Promise<boolean> {
    return element(by.id('add-coffee-modal')).isDisplayed();
  }

  async getTitleText(): Promise<string> {
    return element(by.css('app-root header .navbar-brand')).getText();
  }

  async getBrowserTitle(): Promise<string> {
    return browser.getTitle();
  }
}
