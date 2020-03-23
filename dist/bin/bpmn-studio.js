#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var open_1 = __importDefault(require("open"));
var minimist_1 = __importDefault(require("minimist"));
var pushserve_1 = __importDefault(require("pushserve"));
var defaultPort = 17290;
var defaultHost = '127.0.0.1';
var argv = minimist_1.default(process.argv.slice(2));
var portUsed = applicationPortIsValid(argv.port) ? argv.port : defaultPort;
var hostUsed = applicationHostIsValid(argv.host) ? argv.host : defaultHost;
var httpServerOptions = {
    noCors: false,
    noPushstate: false,
    hostname: hostUsed,
    port: portUsed,
    path: __dirname + "./../..",
    indexPath: 'index.html',
};
pushserve_1.default(httpServerOptions);
open_1.default("http://" + hostUsed + ":" + portUsed);
function applicationPortIsValid(port) {
    if (port === null || port === undefined) {
        return false;
    }
    if (!Number.isInteger(port)) {
        return false;
    }
    var portNumber = parseInt(port);
    var lowerPortBoundValid = portNumber > 1000;
    var upperPortBoundValid = portNumber < 65535;
    var boundariesInvalid = !lowerPortBoundValid || !upperPortBoundValid;
    if (boundariesInvalid) {
        console.log('Port is not in the supported range [1000, 65535]. Using default port.\n');
        return false;
    }
    return true;
}
function applicationHostIsValid(host) {
    if (host === null || host === undefined) {
        return false;
    }
    if (!host.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
        console.log("The specified host: '" + host + "' is not a valid IP address, like: '0.0.0.0'.\n");
        return false;
    }
    return true;
}
//# sourceMappingURL=bpmn-studio.js.map