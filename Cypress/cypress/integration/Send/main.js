describe('Testcase4',() => {
    let settings = {
        email: 'peterparkerisspiderman',
        password: 'superpassword',
        initialButtonText: 'Авторизация',
        initialLoginButtonSelector: '.button2_size_mail-big.button2_theme_mail-white',
        loginButtonSelector: '.control.button2',
        titleLoginButtonSelector: '.passp-current-account__display-name',
        emailInputSelector: '#passp-field-login',
        passwordInputSelector: '#passp-field-passwd',
        profileNameSelector: '.mail-User-Name',
        writeButtonSelector: '.mail-ComposeButton.js-main-action-compose',
        letterTitleSelector: '.mail-Compose-Field-Input-Controller',
        sendingAddressSelector: '.js-compose-field.mail-Bubbles',
        sendButtonSelector: '#nb-13',
        mailSentSelector: '.mail-Done-Title',
        outBoxButton: `a[href='#sent']`,
        outboxResultSelector: '.mail-Message-Toolbar-Subject',
        sendMessageContentSelector: '.mail-Message-Body-Content>div',
        letterTitle: 'This is title of my message',
        letterContentSelector: '.cke_contents_ltr.cke_show_borders>div',
        letterContent: 'Story of using puppeteer for e2e testing',
        sendingAddress: 'peterv3@yandex.com',
        sendingAddressShortend: 'peterv3',
        sendNotificationText: 'Письмо отправлено.',
    };
    before(() => {
      cy.visit('/');
    });

    it('Should implement the complete flow of sending email', function () {
        cy.get(settings.initialLoginButtonSelector).click();
        cy.get(settings.emailInputSelector)
            .type(settings.email)
            .type('{enter}');
        cy.get(settings.titleLoginButtonSelector).should('have.text', settings.email);
        
        cy.get(settings.passwordInputSelector).type(settings.password).type('{enter}');

        cy.get(settings.profileNameSelector)
            .should('have.text', settings.email);
        cy.get(settings.writeButtonSelector, {timeout: 10000}).click();
        cy.get(settings.sendingAddressSelector).first().type(settings.sendingAddress)

        cy.get(settings.letterTitleSelector)
            .first()
            .type(settings.letterTitle)

        cy.get(settings.letterContentSelector).type(settings.letterContent);

        cy.get(settings.sendButtonSelector).click()

        cy.get(settings.mailSentSelector).should('have.text', settings.sendNotificationText);
        
        cy.get(settings.outBoxButton).click()
        cy.contains(settings.letterTitle, {timeout: 10000}).click()

        cy.get(settings.outboxResultSelector).should('have.text', settings.letterTitle);
        cy.get(settings.sendMessageContentSelector).should('have.text', settings.letterContent);
        cy.contains(settings.sendingAddressShortend).should('exist');
    });
});