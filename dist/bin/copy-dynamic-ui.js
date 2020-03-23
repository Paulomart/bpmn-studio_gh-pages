"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var DYNAMICUI_PATH = path_1.default.join(process.cwd(), 'node_modules', '@process-engine', 'dynamic_ui_core');
var DESTINATION_PATH = path_1.default.join(process.cwd(), 'dist', 'web', 'dynamic_ui_core');
function copyDynamicUi() {
    try {
        fs_extra_1.default.copySync(DYNAMICUI_PATH, DESTINATION_PATH, { dereference: true });
        console.log("Successfully copied " + DYNAMICUI_PATH + " to " + DESTINATION_PATH);
    }
    catch (err) {
        console.error(err);
    }
}
copyDynamicUi();
//# sourceMappingURL=copy-dynamic-ui.js.map