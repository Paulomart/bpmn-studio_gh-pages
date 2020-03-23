"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var httpRegex = /^(http|https):\/\/.+/i;
function solutionIsRemoteSolution(solutionUri) {
    return httpRegex.test(solutionUri);
}
exports.solutionIsRemoteSolution = solutionIsRemoteSolution;
//# sourceMappingURL=solution-is-remote-solution.module.js.map