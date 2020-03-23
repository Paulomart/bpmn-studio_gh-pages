"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-useless-escape */
/* eslint-disable no-empty-function */
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const spectron_1 = require("spectron");
const assert_1 = __importDefault(require("assert"));
const solution_explorer_1 = require("./test-classes/solution-explorer");
const design_view_1 = require("./test-classes/design-view");
function getUserConfigFolder() {
    const userHomeDir = os_1.default.homedir();
    switch (process.platform) {
        case 'darwin':
            return path_1.default.join(userHomeDir, 'Library', 'Application Support');
        case 'win32':
            return path_1.default.join(userHomeDir, 'AppData', 'Roaming');
        default:
            return path_1.default.join(userHomeDir, '.config');
    }
}
const APP_BASE_URL = `file://${__dirname}/../../../../index.html`;
const TESTS_FOLDER_PATH = path_1.default.join(getUserConfigFolder(), 'bpmn-studio-tests');
const DATABASE_PATH = path_1.default.join(TESTS_FOLDER_PATH, 'process_engine_databases');
const SAVE_DIAGRAM_DIR = path_1.default.join(TESTS_FOLDER_PATH, 'saved_diagrams');
const VISIBLE_TIMEOUT = 40000;
const REMOVE_COMMAND = process.platform === 'win32' ? 'rmdir /s /q' : 'rm -rf';
class TestClient {
    constructor(applicationArgs) {
        this.solutionExplorer = new solution_explorer_1.SolutionExplorer(this);
        this.designView = new design_view_1.DesignViewClient(this, SAVE_DIAGRAM_DIR);
        this.creatingFirstDiagram = true;
        this.app = new spectron_1.Application(applicationArgs);
    }
    async startSpectronApp() {
        await this.app.start();
    }
    async awaitReadiness() {
        await this.app.client.waitUntilWindowLoaded();
        await this.app.browserWindow.isVisible();
    }
    async startPageLoaded() {
        await this.ensureVisible('[data-test-start-page]', VISIBLE_TIMEOUT);
    }
    async clickOnBpmnElementWithName(name) {
        await this.ensureVisible(`.djs-label=${name}`, VISIBLE_TIMEOUT);
        await this.clickOn(`.djs-label=${name}`);
    }
    async assertCanvasModelIsVisible() {
        const canvasModelIsVisible = await this.webdriverClient.isVisible('[data-test-canvas-model]');
        assert_1.default.equal(canvasModelIsVisible, true);
    }
    async assertDiagramIsOnFileSystem() {
        await this.ensureVisible('[data-test-navbar-icon-local-solution]', VISIBLE_TIMEOUT);
    }
    async assertDiagramIsOnProcessEngine() {
        await this.ensureVisible('[data-test-navbar-icon-remote-solution]', VISIBLE_TIMEOUT);
    }
    async assertNavbarTitleIs(name) {
        await this.ensureVisible('[data-test-navbar-title]', VISIBLE_TIMEOUT);
        const navbarTitle = await this.getTextFromElement('[data-test-navbar-title]');
        assert_1.default.equal(navbarTitle, name);
    }
    async assertDiagramIsSaved() {
        await this.ensureNotVisible('[data-test-edited-label]');
    }
    async assertDiagramIsUnsaved() {
        await this.ensureVisible('[data-test-edited-label]', VISIBLE_TIMEOUT);
    }
    async ensureVisible(selector, timeout) {
        return this.webdriverClient.waitForVisible(selector, timeout);
    }
    async removeTestsFolder() {
        await this.execCommand(`${REMOVE_COMMAND} ${TESTS_FOLDER_PATH.replace(/\s/g, '\\ ')}`);
    }
    async clearDatabase() {
        if (fs_1.default.existsSync(DATABASE_PATH)) {
            try {
                await this.execCommand(`${REMOVE_COMMAND} ${DATABASE_PATH.replace(/\s/g, '\\ ')}`);
            }
            catch (error) {
                console.error(error);
            }
        }
    }
    async clearSavedDiagrams() {
        if (fs_1.default.existsSync(SAVE_DIAGRAM_DIR)) {
            try {
                await this.execCommand(`${REMOVE_COMMAND} ${SAVE_DIAGRAM_DIR.replace(/\s/g, '\\ ')}`);
            }
            catch (error) {
                console.error(error);
            }
        }
    }
    async isSpectronAppRunning() {
        return this.app.isRunning();
    }
    async stopSpectronApp() {
        return this.app.stop();
    }
    get webdriverClient() {
        return this.app.client;
    }
    async clickOn(selector) {
        return this.webdriverClient.$(selector).leftClick();
    }
    async openDesignView(subPath, diagramName, diagramUri, solutionUri) {
        const encodedName = encodeURIComponent(diagramName);
        const encodedUri = encodeURIComponent(diagramUri);
        const encodedSolutionUri = solutionUri ? encodeURIComponent(solutionUri) : '';
        const uriFragment = `#/design/${subPath}/diagram/${encodedName}?diagramUri=${encodedUri}&solutionUri=${encodedSolutionUri}`;
        return this.openView(uriFragment);
    }
    async openThinkView(diagramName, diagramUri, solutionUri) {
        if (diagramName && diagramUri) {
            const encodedName = encodeURIComponent(diagramName);
            const encodedUri = encodeURIComponent(diagramUri);
            const encodedSolutionUri = solutionUri ? encodeURIComponent(solutionUri) : '';
            const uriFragment = `#/think/diagram-list/diagram/${encodedName}?diagramUri=${encodedUri}&solutionUri=${encodedSolutionUri}`;
            await this.openView(uriFragment);
        }
        else {
            await this.openView('#/think/diagram-list/diagram');
        }
        await this.ensureVisible('diagram-list', VISIBLE_TIMEOUT);
    }
    async openThinkViewFromNavbar() {
        await this.ensureVisible('[data-test-navbar="Think"]', VISIBLE_TIMEOUT);
        await this.clickOn('[data-test-navbar="Think"]');
        await this.ensureVisible('diagram-list', VISIBLE_TIMEOUT);
    }
    async openStartPage() {
        return this.openView('');
    }
    async createAndOpenNewDiagram() {
        if (!this.creatingFirstDiagram) {
            await this.openStartPage();
        }
        await this.ensureVisible('[data-test-create-new-diagram]', VISIBLE_TIMEOUT);
        await this.clickOn('[data-test-create-new-diagram]');
        await this.ensureVisible('[data-test-navbar-title]', VISIBLE_TIMEOUT);
    }
    async assertSelectedBpmnElementHasName(name) {
        await this.ensureVisible('[data-test-property-panel-element-name]', VISIBLE_TIMEOUT);
        const selectedElementText = await this.getValueFromElement('[data-test-property-panel-element-name]');
        assert_1.default.equal(selectedElementText, name);
    }
    async rejectSelectedBpmnElementHasName(name) {
        await this.ensureVisible('[data-test-property-panel-element-name]', VISIBLE_TIMEOUT);
        const selectedElementText = await this.getValueFromElement('[data-test-property-panel-element-name]');
        assert_1.default.notEqual(selectedElementText, name);
    }
    async assertDiffViewHasRenderedAllContainer() {
        const leftDiffViewContainerIsVisible = await this.webdriverClient.isVisible('[data-test-left-diff-view]');
        const rightDiffViewContainerIsVisible = await this.webdriverClient.isVisible('[data-test-right-diff-view]');
        const lowerDiffViewContainerIsVisible = await this.webdriverClient.isVisible('[data-test-lower-diff-view]');
        assert_1.default.equal(leftDiffViewContainerIsVisible, true);
        assert_1.default.equal(rightDiffViewContainerIsVisible, true);
        assert_1.default.equal(lowerDiffViewContainerIsVisible, true);
    }
    async elementHasText(selector, text) {
        return this.webdriverClient.waitUntilTextExists(selector, text);
    }
    async assertWindowTitleIs(name) {
        const windowTitle = await this.webdriverClient.getTitle();
        assert_1.default.equal(windowTitle, name);
    }
    async pause(timeInMilliseconds) {
        await new Promise((c) => setTimeout(c, timeInMilliseconds));
    }
    async getElement(selector) {
        return this.webdriverClient.element(selector);
    }
    async getElements(selector) {
        return this.webdriverClient.elements(selector);
    }
    async getAttributeFromElement(selector, attribute) {
        return this.webdriverClient.getAttribute(selector, attribute);
    }
    async getTextFromElement(selector) {
        return this.webdriverClient.getText(selector);
    }
    async getValueFromElement(selector) {
        return this.webdriverClient.getValue(selector);
    }
    async ensureNotVisible(selector) {
        const collection = await this.webdriverClient.elements(selector);
        return collection.value.length === 0;
    }
    getDefaultIdentity() {
        const identity = {
            token: 'ZHVtbXlfdG9rZW4=',
            userId: '',
        };
        return identity;
    }
    async openView(uriPath) {
        try {
            await this.app.browserWindow.loadURL(`${APP_BASE_URL}${uriPath}`);
        }
        catch (error) {
            const errorIsNavigatedError = error.message.includes('Inspected target navigated or closed');
            if (!errorIsNavigatedError) {
                throw error;
            }
        }
    }
    async execCommand(command) {
        return new Promise((resolve, reject) => {
            child_process_1.exec(command, (err, stdin, stderr) => {
                if (err || stderr) {
                    reject(err, stderr);
                }
                return resolve(stdin);
            });
        });
    }
}
exports.TestClient = TestClient;
