"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const TestClient_1 = require("./TestClient");
const get_application_args_1 = require("./modules/get-application-args");
const VISIBLE_TIMEOUT = 40000;
async function assertXmlViewHasContent() {
    await testClient.ensureVisible('[data-test-xml-view-content]', VISIBLE_TIMEOUT);
    const xmlViewContent = await testClient.getTextFromElement('[data-test-xml-view-content]');
    assert_1.default.notEqual(xmlViewContent, null);
}
async function assertXmlViewContainsText(text) {
    await testClient.ensureVisible('[data-test-xml-view-content]', VISIBLE_TIMEOUT);
    const xmlViewContent = await testClient.getTextFromElement('[data-test-xml-view-content]');
    const xmlViewContentContainsText = xmlViewContent.includes(text);
    assert_1.default.equal(xmlViewContentContainsText, true);
}
let testClient;
describe('XML View', function foo() {
    this.slow(10000);
    this.timeout(15000);
    beforeEach(async () => {
        testClient = new TestClient_1.TestClient(get_application_args_1.applicationArgs);
        testClient.creatingFirstDiagram = true;
        await testClient.startSpectronApp();
        await testClient.awaitReadiness();
    });
    afterEach(async () => {
        if (await testClient.isSpectronAppRunning()) {
            await testClient.stopSpectronApp();
            await testClient.clearDatabase();
            await testClient.clearSavedDiagrams();
        }
    });
    this.afterAll(async () => {
        await testClient.removeTestsFolder();
    });
    it('should have content', async () => {
        await testClient.createAndOpenNewDiagram();
        await testClient.designView.openXmlView('Untitled-1', 'about:open-diagrams/Untitled-1.bpmn', 'about:open-diagrams');
        await assertXmlViewHasContent();
    });
    it('should contain text', async () => {
        await testClient.createAndOpenNewDiagram();
        await testClient.designView.openXmlViewFromStatusbar();
        await assertXmlViewContainsText('id="Untitled-1"');
    });
});
