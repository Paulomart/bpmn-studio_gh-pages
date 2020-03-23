var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "fs", "handlebars"], function (require, exports, fs, Handlebars) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DynamicUIService {
        get assetsPath() {
            return `${__dirname}/assets`;
        }
        getIndex(formKey) {
            return __awaiter(this, void 0, void 0, function* () {
                const template = fs.readFileSync(`${__dirname}/templates/index.html`).toString();
                return Handlebars.compile(template)({
                    form_key: formKey,
                    consumer_api__external_accessor__url: process.env.consumer_api__external_accessor__url,
                    identity_server_url: process.env.IDENTITY_SERVER_URL,
                });
            });
        }
        getWebcomponent(formKey) {
            return __awaiter(this, void 0, void 0, function* () {
                const webcomponent = fs.readFileSync(`${__dirname}/../dynamic-usertask-component.js`).toString();
                return webcomponent;
            });
        }
    }
    exports.DynamicUIService = DynamicUIService;
});
//# sourceMappingURL=dynamic_ui_service.js.map