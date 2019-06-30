const { Builder, By, Key, until, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');
const settings = require('./test.settings.json');

describe('Sending message flow', () => {
    const driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless().windowSize({width: 1920, height: 1080}))
        .build();

    before(function() {
        return driver.get('https://mail.yandex.by');
    });

    it('Should login to the account', async () => {
        await driver
            .wait(until.elementLocated(By.css(settings.initialLoginButtonSelector)))
            .click();

        await driver.wait(until.titleContains(settings.loginFormPageTitle));

        await driver
            .findElement(By.css(settings.emailInputSelector))
            .sendKeys(settings.email, Key.ENTER);
        let loginElementText = await driver
            .wait(until.elementLocated(By.css(settings.titleLoginButtonSelector)))
            .getText();

        expect(loginElementText).to.equal(settings.email);

        await driver
            .findElement(By.css(settings.passwordInputSelector))
            .sendKeys(settings.password, Key.ENTER);

        let profileNameText = await driver
            .wait(until.elementLocated(By.css(settings.profileNameSelector)))
            .getText();

        expect(profileNameText).to.equal(settings.email);
    });

    it('Should send a letter', async function() {
        await driver
            .wait(until.elementLocated(By.css(settings.writeButtonSelector)))
            .click();

        await driver
            .wait(until.elementLocated(By.css(settings.sendingAddressSelector)))
            .sendKeys(settings.sendingAddress);

        await driver
            .findElement(By.css(settings.letterTitleSelector))
            .sendKeys(settings.letterTitle);

        await driver.executeScript((selector, text) => {
            document.querySelector(selector).textContent = text;
        }, settings.letterContentSelector, settings.letterContent);
 
        await driver.findElement(By.css(settings.sendButtonSelector)).click();

        let doneTitleText = await driver
            .wait(until.elementLocated(By.css(settings.mailSentSelector)))
            .getText();

        expect(doneTitleText).to.equal(settings.sendNotificationText);   
    });

    it('Should verify that letter has been sent', async function() {
        await driver
            .wait(until.elementLocated(By.css(settings.outBoxButton)))
            .click();
        await driver
            .wait(until.elementLocated(By.xpath(`//*[contains(text(),'${settings.letterTitle}')]`), 10000))
            .click();
        let messageTitleText = await driver
            .wait(until.elementLocated(By.css(settings.outboxResultSelector)))
            .getText();
        let messageText = await driver
            .findElement(By.css(settings.sendMessageContentSelector))
            .getText();

        let messageAddress = await driver
            .findElement(By.xpath(`//*[contains(text(),'${settings.sendingAddressShortend}')]`))
            .getText();

        expect(messageTitleText).to.equal(settings.letterTitle);
        expect(messageText).to.equal(settings.letterContent);
        expect(messageAddress).to.equal(settings.sendingAddressShortend);
    });

    after(async () => driver.quit());
});