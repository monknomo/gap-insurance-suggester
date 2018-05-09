"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MockApi_1 = require("./MockApi");
class Estimator {
}
Estimator.estimate = (loanDetails) => {
    const estimatedValue = MockApi_1.default.getEstimatedValue(loanDetails.vin);
    const depreciationSchedule = MockApi_1.default.getDepreciationSchedule(loanDetails.vin);
    if (estimatedValue === undefined || depreciationSchedule.length === 0) {
        return { "eligible": true };
    }
    const valuesByMonth = Estimator.getValuesByMonth(depreciationSchedule, estimatedValue);
    const loanBalanceByMonth = Estimator.getLoanBalanceByMonth(loanDetails);
    let value = { "eligible": false };
    for (let i = 0; i < loanBalanceByMonth.length; i++) {
        if (valuesByMonth[i] < loanBalanceByMonth[i]) {
            value = { "eligible": true };
        }
    }
    return value;
};
Estimator.getLoanBalanceByMonth = (loanDetails) => {
    const loanBalanceByMonth = [];
    for (let i = 1; i <= loanDetails.term; i++) {
        loanBalanceByMonth.push(Estimator.remainingBalance(loanDetails, i));
    }
    return loanBalanceByMonth;
};
Estimator.getValuesByMonth = (depreciationSchedule, initialValue) => {
    return [].concat.apply([], depreciationSchedule.map((value, index, arr) => {
        const monthlyDepreciation = arr[index] / 12;
        const depreciationByMonth = [];
        if (index === 0) {
            for (let i = 1; i < 13; i++) {
                depreciationByMonth.push(Estimator.precisionRound(initialValue - i * monthlyDepreciation, 2));
            }
        }
        else {
            let lastYearFinalValue = initialValue;
            for (let j = 0; j < index; j++) {
                lastYearFinalValue -= arr[j];
            }
            for (let i = 1; i < 13; i++) {
                depreciationByMonth.push(Estimator.precisionRound(lastYearFinalValue - i * monthlyDepreciation, 2));
            }
        }
        return depreciationByMonth;
    }));
};
Estimator.calculatePayment = (loanDetails) => {
    const monthlyRate = loanDetails.apr / 1200;
    return Estimator.precisionRound((loanDetails.amountFinanced * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -1 * loanDetails.term)), 2);
};
Estimator.fvOfOriginalBalance = (loanDetails, currentPeriod) => {
    return Estimator.precisionRound(loanDetails.amountFinanced * Math.pow((1 + (loanDetails.apr / 1200)), currentPeriod), 2);
};
Estimator.fvOfAnnuity = (loanDetails, currentPeriod) => {
    return Estimator.precisionRound(Estimator.calculatePayment(loanDetails) * ((Math.pow(1 + (loanDetails.apr / 1200), currentPeriod) - 1) / (loanDetails.apr / 1200)), 2);
};
/**
 *  http://www.financeformulas.net/Remaining_Balance_Formula.html
 * @param loanDetails
 * @param {number} currentPeriod
 * @returns {number}
 */
Estimator.remainingBalance = (loanDetails, currentPeriod) => {
    return Estimator.precisionRound(Estimator.fvOfOriginalBalance(loanDetails, currentPeriod) - Estimator.fvOfAnnuity(loanDetails, currentPeriod), 2);
};
Estimator.precisionRound = (unroundedNumber, precision) => {
    const factor = Math.pow(10, precision);
    return Math.round(unroundedNumber * factor) / factor;
};
exports.default = Estimator;
//# sourceMappingURL=estimator.js.map