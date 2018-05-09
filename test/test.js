"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_typescript_1 = require("mocha-typescript");
const assert = require("assert");
const estimator_1 = require("../src/estimator");
let TestEstimator = class TestEstimator {
    showGapOffer() {
        assert.deepEqual(estimator_1.default.estimate({}), { "eligible": true }, "Expected to default to true");
        // bmw 3-series
        assert.deepEqual(estimator_1.default.estimate({ "vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48 }), { "eligible": true }, "Expected to show gap offer");
        // the cheapest car on carmax; a nissan versa
        assert.deepEqual(estimator_1.default.estimate({ "vin": "3N1BC11EX8L409074",
            "amountFinanced": 2000,
            "apr": 4.8,
            "term": 48 }), { "eligible": false }, "Expected to skip gap offer 1");
    }
    loanBalanceByMonth() {
        assert.deepEqual(estimator_1.default.getLoanBalanceByMonth({ "vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 12 }), [18369.68, 16732.84, 15089.45, 13439.49, 11782.92, 10119.74, 8449.89, 6773.37, 5090.15, 3400.19, 1703.47, -0.04], "expected loan balance for bmw loan");
    }
    getValuesByMonth() {
        assert.deepEqual(estimator_1.default.getValuesByMonth([20000], 20000), [18333.33, 16666.67, 15000, 13333.33, 11666.67, 10000, 8333.33, 6666.67, 5000, 3333.33, 1666.67, 0], "");
    }
    monthlyPayment() {
        assert.equal(estimator_1.default.calculatePayment({ "vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48 }), 458.78, "expected monthly payment");
    }
    fvOfOriginalBalance() {
        assert.equal(estimator_1.default.fvOfOriginalBalance({ "vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48 }, 0), 20000, "expect full balance to be owed");
        assert.equal(estimator_1.default.fvOfOriginalBalance({ "vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48 }, 1), 20080, "1st period's interest");
        assert.equal(estimator_1.default.fvOfOriginalBalance({ "vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48 }, 12), 20981.40, "1st year's interest");
        assert.equal(estimator_1.default.fvOfOriginalBalance({ "vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48 }, 24), 22010.97, "1st year's interest");
        assert.equal(estimator_1.default.fvOfOriginalBalance({ "vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48 }, 36), 23091.05, "1st year's interest");
        assert.equal(estimator_1.default.fvOfOriginalBalance({ "vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48 }, 48), 24224.13, "1st year's interest");
    }
    fvOfAnnuity() {
        assert.equal(estimator_1.default.fvOfAnnuity({ "vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48 }, 0), 0, "initial interest");
        assert.equal(estimator_1.default.fvOfAnnuity({ "vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48 }, 1), 458.78, "initial interest");
        assert.equal(estimator_1.default.fvOfAnnuity({ "vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48 }, 48), 24224.34, "initial interest");
    }
    remainingBalance() {
        assert.equal(estimator_1.default.remainingBalance({ "vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48 }, 0), 20000, "expected initial balance");
        assert.equal(estimator_1.default.remainingBalance({ "vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48 }, 1), 19621.22, "expected initial balance");
        assert.equal(estimator_1.default.remainingBalance({ "vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48 }, 48), -.21, "expected initial balance");
    }
};
__decorate([
    mocha_typescript_1.test
], TestEstimator.prototype, "showGapOffer", null);
__decorate([
    mocha_typescript_1.test
], TestEstimator.prototype, "loanBalanceByMonth", null);
__decorate([
    mocha_typescript_1.test
], TestEstimator.prototype, "getValuesByMonth", null);
__decorate([
    mocha_typescript_1.test
], TestEstimator.prototype, "monthlyPayment", null);
__decorate([
    mocha_typescript_1.test
], TestEstimator.prototype, "fvOfOriginalBalance", null);
__decorate([
    mocha_typescript_1.test
], TestEstimator.prototype, "fvOfAnnuity", null);
__decorate([
    mocha_typescript_1.test
], TestEstimator.prototype, "remainingBalance", null);
TestEstimator = __decorate([
    mocha_typescript_1.suite
], TestEstimator);
//# sourceMappingURL=test.js.map