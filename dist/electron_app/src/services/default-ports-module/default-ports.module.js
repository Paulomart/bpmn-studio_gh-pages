"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../contracts/index");
function getPortListByVersion(studioVersion) {
    var portList = [];
    var firstPort = getFirstPortByVersion(studioVersion);
    for (var index = 0; index < 10; index++) {
        portList.push(firstPort + index * 10);
    }
    return portList;
}
exports.getPortListByVersion = getPortListByVersion;
function getFirstPortByVersion(studioVersion) {
    switch (studioVersion) {
        case index_1.StudioVersion.Dev:
            return 56300;
        case index_1.StudioVersion.Alpha:
            return 56200;
        case index_1.StudioVersion.Beta:
            return 56100;
        case index_1.StudioVersion.Stable:
            return 56000;
        default:
            throw new Error('Could not get default port for internal process engine');
    }
}
//# sourceMappingURL=default-ports.module.js.map