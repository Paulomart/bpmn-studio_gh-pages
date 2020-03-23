"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const expose_functionality_module_1 = require("../../../src/services/expose-functionality-module/expose-functionality.module");
const VISIBLE_TIMEOUT = 40000;
class SolutionExplorer {
    constructor(testClient) {
        this.testClient = testClient;
    }
    async show() {
        const solutionExplorerIsVisible = await this.testClient.webdriverClient.isVisible('[data-test-solution-explorer-panel]');
        if (solutionExplorerIsVisible) {
            return;
        }
        await this.testClient.ensureVisible('[data-test-toggle-solution-explorer]', VISIBLE_TIMEOUT);
        await this.testClient.clickOn('[data-test-toggle-solution-explorer]');
        await this.testClient.ensureVisible('[data-test-solution-explorer-panel]', VISIBLE_TIMEOUT);
    }
    async hide() {
        const solutionExplorerIsVisible = await this.testClient.webdriverClient.isVisible('[data-test-solution-explorer-panel]');
        const solutionExplorerIsHidden = !solutionExplorerIsVisible;
        if (solutionExplorerIsHidden) {
            return;
        }
        await this.testClient.ensureVisible('[data-test-toggle-solution-explorer]', VISIBLE_TIMEOUT);
        await this.testClient.clickOn('[data-test-toggle-solution-explorer]');
        await this.testClient.ensureNotVisible('[data-test-solution-explorer-panel]');
    }
    async assertInternalProcessEngineIsOpenedAsSolution() {
        await this.testClient.ensureVisible('[data-test-solution-is-internal=true]', VISIBLE_TIMEOUT);
    }
    async assertInternalProcessEngineIsConnected() {
        await this.testClient.ensureVisible('[data-test-solution-is-connected="true"]', VISIBLE_TIMEOUT);
    }
    async openDirectoryAsSolution(dir, diagramName) {
        const pathToSolution = path_1.default.join(__dirname, '..', '..', '..', '..', '..', dir);
        await expose_functionality_module_1.callExposedFunction(this.testClient.webdriverClient, 'openSolution', pathToSolution, false, this.testClient.getDefaultIdentity());
        await this.testClient.ensureVisible(`[data-test-solution-entry-name=${dir}]`, VISIBLE_TIMEOUT);
        if (diagramName) {
            const diagramUri = this.getUriForSelector(pathToSolution, diagramName);
            await this.testClient.ensureVisible(`[data-test-open-diagram-with-uri*="${diagramUri}"]`, VISIBLE_TIMEOUT);
            await this.testClient.webdriverClient.executeAsync(async (uri, done) => {
                const domElement = document.querySelector(`[data-test-open-diagram-with-uri*="${uri}"]`);
                domElement.scrollIntoView();
                done();
            }, diagramUri);
            await this.testClient.clickOn(`[data-test-open-diagram-with-uri*="${diagramUri}"]`);
        }
    }
    getUriForSelector(pathToSolution, diagramName) {
        const isWindows = process.platform === 'win32';
        if (isWindows) {
            const searchString = `${pathToSolution}\\${diagramName}`;
            const replacedSearchString = searchString.replace(/[\\]/gm, '\\\\');
            return replacedSearchString;
        }
        return `${pathToSolution}/${diagramName}`;
    }
}
exports.SolutionExplorer = SolutionExplorer;
