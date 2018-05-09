"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MockApi {
    static getDepreciationSchedule(vin) {
        if (vin === "WBA3K5C54EK300127") {
            return [10000, 3400, 2904, 2475, 2112];
        }
        else if (vin === "3N1BC11EX8L409074") {
            return [1759, 534, 470, 416, 374];
        }
        return [];
    }
    static getEstimatedValue(vin) {
        if (vin === "WBA3K5C54EK300127") {
            return 23000;
        }
        else if (vin === "3N1BC11EX8L409074") {
            return 5000;
        }
        return undefined;
    }
}
exports.default = MockApi;
//# sourceMappingURL=MockApi.js.map