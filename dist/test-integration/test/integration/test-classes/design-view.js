"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const expose_functionality_module_1 = require("../../../src/services/expose-functionality-module/expose-functionality.module");
const VISIBLE_TIMEOUT = 40000;
class DesignViewClient {
    constructor(testClient, saveDiagramDir) {
        this.testClient = testClient;
        this.saveDiagramDir = saveDiagramDir;
    }
    async openDetailView(diagramName, diagramUri, solutionUri) {
        await this.testClient.openDesignView('detail', diagramName, diagramUri, solutionUri);
        await this.testClient.ensureVisible('[data-test-diagram-detail]', VISIBLE_TIMEOUT);
    }
    async openXmlView(diagramName, diagramUri, solutionUri) {
        await this.testClient.openDesignView('xml', diagramName, diagramUri, solutionUri);
        await this.testClient.ensureVisible('[data-test-bpmn-xml-view]', VISIBLE_TIMEOUT);
    }
    async openDiffView(diagramName, diagramUri, solutionUri) {
        await this.testClient.openDesignView('diff', diagramName, diagramUri, solutionUri);
        await this.testClient.ensureVisible('[data-test-bpmn-diff-view]', VISIBLE_TIMEOUT);
    }
    async saveDiagramAs(fileName) {
        const fileUri = path_1.default.join(this.saveDiagramDir, fileName);
        const directoryExists = await fs_1.default.existsSync(this.saveDiagramDir);
        if (!directoryExists) {
            fs_1.default.mkdirSync(this.saveDiagramDir);
        }
        await expose_functionality_module_1.callExposedFunction(this.testClient.webdriverClient, 'saveDiagramAs', fileUri);
    }
    async startProcess() {
        await this.testClient.ensureVisible('[data-test-start-diagram-button]', VISIBLE_TIMEOUT);
        await this.testClient.clickOn('[data-test-start-diagram-button]');
        await this.testClient.ensureVisible('[data-test-live-execution-tracker]', VISIBLE_TIMEOUT);
    }
    async deployDiagram() {
        await this.testClient.ensureVisible('[data-test-deploy-diagram-button]', VISIBLE_TIMEOUT);
        await this.testClient.solutionExplorer.assertInternalProcessEngineIsConnected();
        await this.testClient.clickOn('[data-test-deploy-diagram-button]');
    }
    // openXMLViewForCurrentDiagram?
    async openXmlViewFromStatusbar() {
        await this.testClient.ensureVisible('[data-test-status-bar-xml-view-button]', VISIBLE_TIMEOUT);
        await this.testClient.clickOn('[data-test-status-bar-xml-view-button]');
    }
    // openDesignViewForCurrentDiagram?
    async openDetailViewFromStatusbar() {
        await this.testClient.ensureVisible('[data-test-status-bar-disable-xml-view-button]', VISIBLE_TIMEOUT);
        await this.testClient.clickOn('[data-test-status-bar-disable-xml-view-button]');
        await this.testClient.ensureVisible('[data-test-diagram-detail]', VISIBLE_TIMEOUT);
    }
    async assertXmlViewIsVisible() {
        await this.testClient.ensureVisible('[data-test-bpmn-xml-view]', VISIBLE_TIMEOUT);
    }
    async showPropertyPanel() {
        const propertyPanelIsVisible = await this.testClient.webdriverClient.isVisible('[data-test-property-panel]');
        if (propertyPanelIsVisible) {
            return;
        }
        await this.testClient.ensureVisible('[data-test-toggle-propertypanel]', VISIBLE_TIMEOUT);
        await this.testClient.clickOn('[data-test-toggle-propertypanel]');
    }
    async hidePropertyPanel() {
        const propertyPanelIsVisible = await this.testClient.webdriverClient.isVisible('[data-test-property-panel]');
        const propertyPanelIsHidden = !propertyPanelIsVisible;
        if (propertyPanelIsHidden) {
            return;
        }
        await this.testClient.ensureVisible('[data-test-toggle-propertypanel]', VISIBLE_TIMEOUT);
        await this.testClient.clickOn('[data-test-toggle-propertypanel]');
    }
}
exports.DesignViewClient = DesignViewClient;
