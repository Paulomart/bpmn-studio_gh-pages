"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_is_dev_1 = __importDefault(require("electron-is-dev"));
var index_1 = require("../../contracts/index");
var ReleaseChannel = (function () {
    function ReleaseChannel(version) {
        this.version = version;
    }
    ReleaseChannel.prototype.isDev = function () {
        return electron_is_dev_1.default;
    };
    ReleaseChannel.prototype.isAlpha = function () {
        return this.version.includes('alpha');
    };
    ReleaseChannel.prototype.isBeta = function () {
        return this.version.includes('beta');
    };
    ReleaseChannel.prototype.isStable = function () {
        return !this.isDev() && !this.isAlpha() && !this.isBeta();
    };
    ReleaseChannel.prototype.getName = function () {
        if (this.isDev()) {
            return 'dev';
        }
        if (this.isAlpha()) {
            return 'alpha';
        }
        if (this.isBeta()) {
            return 'beta';
        }
        return 'stable';
    };
    ReleaseChannel.prototype.getVersion = function () {
        if (this.isDev()) {
            return index_1.StudioVersion.Dev;
        }
        if (this.isAlpha()) {
            return index_1.StudioVersion.Alpha;
        }
        if (this.isBeta()) {
            return index_1.StudioVersion.Beta;
        }
        return index_1.StudioVersion.Stable;
    };
    return ReleaseChannel;
}());
exports.default = ReleaseChannel;
//# sourceMappingURL=release-channel.service.js.map