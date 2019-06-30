let settings = require('./sample.spec.settings');

describe('Send mail', function () {
  let page;

  before (async function () {
    page = await browser.newPage();
    await page.setViewport({
      width: 1366,
      height: 768,
    });
    await page.goto('https://mail.yandex.by');
  });

  it('Should login to the account', async function() {
    let initialPageLoginButton = await page.$(settings.initialLoginButtonSelector);
    await Promise.all([page.waitForNavigation(0), initialPageLoginButton.click()]);
    await page.type(settings.emailInputSelector, settings.email);
    let loginEmailButton = await page.$(settings.loginButtonSelector);
    await loginEmailButton.click();

    let loginElement = await page.waitForSelector(settings.titleLoginButtonSelector);
    let loginElementText = await page.evaluate(element => element.textContent, loginElement);

    expect(loginElementText).to.equal(settings.email);

    await page.waitForSelector(settings.passwordInputSelector);
    await page.type(settings.passwordInputSelector, settings.password);
    await Promise.all([page.waitForNavigation(1000), page.keyboard.press('Enter')]);
    let profileName = await page.waitForSelector(settings.profileNameSelector);
    let profileNameText = await page.evaluate(element => element.textContent, profileName);

    expect(profileNameText).to.equal(settings.email);
  })

  it('Should send a letter', async function() {
    let writeLetterButton = await page.$(settings.writeButtonSelector);
    await writeLetterButton.click();
    await page.waitForSelector(settings.sendingAddressSelector);
    await page.evaluate((selector, text) => {
      document.querySelector(selector).textContent = text;
    },settings.letterContentSelector, settings.letterContent);

    await page.type(settings.sendingAddressSelector, settings.sendingAddress);
    await page.type(settings.letterTitleSelector, settings.letterTitle);
    let sendButton = await page.$(settings.sendButtonSelector);
    await sendButton.click();

    let doneTitleElement = await page.waitForSelector(settings.mailSentSelector);
    let doneTitle = await page.evaluate(element => element.textContent, doneTitleElement);

    expect(doneTitle).to.equal(settings.sendNotificationText);
  });
  it('Should verify that letter has been sent', async function() {
    let sendTab = await page.$(settings.outBoxButton);
    await sendTab.click();
    let sentMessageTitle = await page.waitForXPath(`//*[contains(text(),'${settings.letterTitle}')]`);
    await sentMessageTitle.click()
    let messageTitleElem = await page.waitForSelector(settings.outboxResultSelector);
    let messageTitleText = await page.evaluate(element => element.textContent, messageTitleElem);

    let messageText = await page.$eval(settings.sendMessageContentSelector, elem => elem.textContent);
    let messageAddressElem = await page.waitForXPath(`//*[contains(text(),'${settings.sendingAddressShortend}')]`);

    let messageAddress = await page.evaluate(element => element.textContent, messageAddressElem);

    expect(messageTitleText).to.equal(settings.letterTitle);
    expect(messageText).to.equal(settings.letterContent);
    expect(messageAddress).to.equal(settings.sendingAddressShortend);
  });

  after(function() {
    return page.close();
  })
});