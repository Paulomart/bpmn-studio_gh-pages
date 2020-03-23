"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const isWindows = process.platform === 'win32';
function getApplicationArgs(givenPath) {
    const commonArgs = {
        requireName: 'nodeRequire',
        env: {
            SPECTRON_TESTS: true,
        },
        webdriverOptions: {
            deprecationWarnings: false,
        },
    };
    if (givenPath != null) {
        console.log(`Using path: ${givenPath}`);
        return { ...commonArgs, path: givenPath };
    }
    const electronExecutable = isWindows ? 'electron.cmd' : 'electron';
    const electronPath = path_1.default.join(__dirname, '..', '..', '..', '..', '..', 'node_modules', '.bin', electronExecutable);
    const electronBundlePath = path_1.default.join(__dirname, '..', '..', '..', '..', '..', 'dist', 'electron_app', 'electron_app', 'electron.js');
    return { ...commonArgs, path: electronPath, args: [electronBundlePath] };
}
exports.applicationArgs = getApplicationArgs(process.env.SPECTRON_APP_PATH);
