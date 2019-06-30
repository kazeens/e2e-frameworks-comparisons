
let settings = require('./settings');
let { Selector } = require('testcafe');

fixture('Test')
    .page('https://mail.yandex.by');

test('Should login to the account', async(t) => {
    await t.click(settings.initialLoginButtonSelector);
    await t.typeText(settings.emailInputSelector, settings.email)
            .pressKey('enter');

    let loginText = await Selector(settings.titleLoginButtonSelector).innerText;

    await t.expect(loginText).eql(settings.email);

    await t.typeText(settings.passwordInputSelector, settings.password)
        .pressKey('enter');

    let profileNameText = await Selector(settings.profileNameSelector).innerText;

    await t.expect(profileNameText).eql(settings.email);
    await t.click(settings.writeButtonSelector);
    await t.typeText(settings.sendingAddressSelector, settings.sendingAddress);
    await t.typeText(settings.letterTitleSelector, settings.letterTitle);
    await t.typeText(settings.letterContentSelector, settings.letterContent);

    await t.click(settings.sendButtonSelector);

    let notificationText = await Selector(settings.mailSentSelector).innerText;

    await t.expect(notificationText).eql(settings.sendNotificationText);

    await t.click(settings.outBoxButton);

    let letterItemSelector = await Selector('span', {timeout: 10000}).withText(settings.letterTitle);

    await t.click(letterItemSelector);

    let messageAddress = await Selector('div').withText(settings.sendingAddressShortend);
    await t.expect(messageAddress).ok()

    let letterTitle = await Selector(settings.outboxResultSelector).innerText;
    await t.expect(letterTitle).eql(settings.letterTitle);

    // let sendMessageContent = await Selector(settings.sendMessageContentSelector).innerText;

    // await t.expect(sendMessageContent).eql(settings.letterContent);


})
