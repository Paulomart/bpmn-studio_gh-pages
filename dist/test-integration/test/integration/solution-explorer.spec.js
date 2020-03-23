"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestClient_1 = require("./TestClient");
const get_application_args_1 = require("./modules/get-application-args");
let testClient;
describe('SolutionExplorer', function foo() {
    this.slow(10000);
    this.timeout(15000);
    beforeEach(async () => {
        testClient = new TestClient_1.TestClient(get_application_args_1.applicationArgs);
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
    it('should open a solution', async () => {
        await testClient.startPageLoaded();
        await testClient.solutionExplorer.openDirectoryAsSolution('fixtures');
    });
    it('should open a diagram from the opened solution', async () => {
        await testClient.startPageLoaded();
        const diagramName = 'call_activity_subprocess_error';
        await testClient.solutionExplorer.openDirectoryAsSolution('fixtures', diagramName);
        await testClient.assertNavbarTitleIs(diagramName);
    });
    it('should open the internal ProcessEngine as a solution', async () => {
        await testClient.startPageLoaded();
        await testClient.solutionExplorer.assertInternalProcessEngineIsOpenedAsSolution();
    });
    it('should show the SolutionExplorer', async () => {
        // Arrange
        await testClient.startPageLoaded();
        await testClient.solutionExplorer.hide();
        // Act and Assert
        await testClient.solutionExplorer.show();
    });
    it('should hide the SolutionExplorer', async () => {
        await testClient.startPageLoaded();
        await testClient.solutionExplorer.hide();
    });
});
