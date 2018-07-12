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
            return driver.wait(until.elementLocated(By.css('div > button[type="submit"]')), 3000);
        })
        .then((el) => {
            return el.click();
        })
}

function renameRepository() {
    driver.findElement(By.linkText('Settings')).click()
        .then(() => {
            return driver.findElement(By.id('rename_field')).sendKeys('_renamed');
        })
        .then(() => {
            driver.sleep(1000);
            return driver.wait(until.elementLocated(By.css('form.d-flex.js-edit-repo-container > button')), 3000);
        })
        .then((el) => {
            return el.click();
        })
}

function deleteRepository() {
    driver.findElement(By.linkText('Settings')).click()
        .then(() => {
            return driver.findElement(By.xpath('//summary[contains(text(),"Delete this repository")]')).click();
        })
        .then(() => {
            return driver.findElement(By.xpath('//p[1]/strong[2]')).getText();
        })
        .then((repoName) => {
            return driver.findElement(By.css('input[aria-label="Type in the name of the repository to confirm that you want to delete this repository."]')).sendKeys(repoName);
        })
        .then(() => {
            return driver.findElement(By.xpath('//button[contains(text(),"I understand the consequences, delete this reposit")]')).click();
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
    .then(() => {
        return renameRepository();
    })
    .then(() => {
        return deleteRepository();
    })
    .then(
        closeBrowser()
    );
