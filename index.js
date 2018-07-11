'use strict';

require('geckodriver');
require('chromedriver');
const { Builder, By, Key, until } = require('selenium-webdriver');

const username = 'testautomationuser';
const password = 'Time4Death!';
const repoName = makeRandomName();

function makeRandomName() {
    let text = 'testRepo';
    const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 6; i++)
        text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));

    return text;
}

const createDriver = () => {
    const driver = new Builder()
        .forBrowser('firefox')
        .build();
    driver.manage().timeouts().implicitlyWait(20000);
    driver.manage().window().maximize();
    return driver;
}

function login(username, password) {
    driver.findElement(By.css('#login_field')).sendKeys(username)
        .then(() => {
            return driver.findElement(By.css('#password')).sendKeys(password);
        })
        .then(() => {
            return driver.findElement(By.name('commit')).click();
        })
}

function createNewRepository(repoName) {
    driver.findElement(By.linkText('New repository')).click()
        .then(() => {
            return driver.findElement(By.id('repository_name')).sendKeys(repoName);
        })
        .then(() => {
            setTimeout(() => {
                console.log('wait for [Create repository] button');
            }, 3000);
        })
        .then(() => {
            return driver.wait(until.elementLocated(By.css('div > button[type="submit"]')), 3000);
        })
        .then((el) => {
            return el.click();
        })
}


function handleFailure(err) {
    console.error('Something went wrong\n', err.stack, '\n');
    closeBrowser();
}

function closeBrowser() {
    driver.quit();
}

const driver = createDriver();

driver.get('https://github.com/login')
    .then(() => {
        return login(username, password);
    })
    .then(() => {
        return createNewRepository(repoName);
    })

    .then(
        closeBrowser()
    );

/////////////////////////////////////////////////////////////////////////////////////

// function logTitle() {
//     driver.getTitle().then(function (title) {
//         console.log('Current Page Title: ' + title);
//     });
// }

// function logModelTitle() {
//     driver.findElement(By.css(".model")).then(function (el) {
//         el.getText().then(function (text) {
//             console.log('Current Model Title: ' + text)
//         });
//     });
// }

// function clickLink(link) {
//     link.click();
// }



// function findMostRelevant() {
//     return driver.findElements(By.css('.sr-heading a')).then(function (result) {
//         return result[0];
//     });
// }

// driver.get('http://www.kia.com/us/en/search')
//     .then(() => {
//         return driver.findElement(By.name("q")).sendKeys('sorento');
//     }).then(() => {
//         return driver.findElement(By.css(".search-form div button")).click();
//     }).then(() => {
//         return driver.wait(findMostRelevant, 2000);
//     }).then((link) => {
//         return clickLink(link);
//     }).then(() => {
//         return logTitle();
//     }).then(() => {
//         return logModelTitle();
//     }).then(() => {
//         return driver.findElement(By.linkText("OFFERS")).click();
//     }).then(() => {
//         driver.findElement(By.partialLinkText("Quote")).click();
//     }).then(() => {
//         driver.findElement(By.name("zip-input")).sendKeys('36511');
//     }).then(() => {
//         driver.findElement(By.className("zip-go")).click();
//     }).then(() => {
//         return closeBrowser();
//     });

//////////////////////////////////////////////////////////////////////////////////