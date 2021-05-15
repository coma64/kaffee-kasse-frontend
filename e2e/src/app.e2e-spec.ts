import { browser, logging } from 'protractor';
import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display the title', async () => {
    await page.navigateTo();

    expect(await page.getTitleText()).toContain('Kaffee Kasse');
    expect(await page.getBrowserTitle()).toContain('Kaffee Kasse');
  });

  it('should display a modal when the add coffee button is clicked', async () => {
    await page.navigateTo();
    await page.clickAddCoffee();

    expect(await page.isAddCoffeeModalDisplayed());
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    );
  });
});
