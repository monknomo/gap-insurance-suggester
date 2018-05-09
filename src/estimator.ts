import MockApi from "./MockApi";

export default class Estimator {
    static estimate = (loanDetails: any) => {
        const estimatedValue: number = MockApi.getEstimatedValue(loanDetails.vin);
        const depreciationSchedule: number[] = MockApi.getDepreciationSchedule(loanDetails.vin);
        if (estimatedValue === undefined || depreciationSchedule.length === 0) {
            return {"eligible": true};
        }
        const valuesByMonth: number[] = Estimator.getValuesByMonth(depreciationSchedule, estimatedValue);
        const loanBalanceByMonth: number[] = Estimator.getLoanBalanceByMonth(loanDetails);
        let value = {"eligible": false};
        for (let i = 0; i < loanBalanceByMonth.length; i++) {
            if (valuesByMonth[i] < loanBalanceByMonth[i]) {
                value = {"eligible": true};
            }
        }
        return value;
    }

     static getLoanBalanceByMonth = (loanDetails: any) => {
        const loanBalanceByMonth: number[] = [];
        for (let i = 1; i <= loanDetails.term; i++) {
            loanBalanceByMonth.push(Estimator.remainingBalance(loanDetails, i));
        }
        return loanBalanceByMonth;
    }

    static getValuesByMonth = (depreciationSchedule: number[], initialValue: number) => {
      return [].concat.apply([], depreciationSchedule.map((value, index, arr) => {
          const monthlyDepreciation = arr[index] / 12;
          const depreciationByMonth = [];
            if (index === 0) {
                for (let i = 1; i < 13; i++) {
                    depreciationByMonth.push(Estimator.precisionRound(initialValue - i * monthlyDepreciation, 2));
                }
            } else {
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
    }

    static calculatePayment = (loanDetails: any) => {
        const monthlyRate = loanDetails.apr / 1200;
        return Estimator.precisionRound((loanDetails.amountFinanced * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -1 * loanDetails.term)), 2);
    }

    static fvOfOriginalBalance = (loanDetails: any, currentPeriod: number) => {
        return Estimator.precisionRound(loanDetails.amountFinanced * Math.pow((1 + (loanDetails.apr / 1200)), currentPeriod), 2);
    }

    static fvOfAnnuity = (loanDetails: any, currentPeriod: number) => {
        return Estimator.precisionRound(Estimator.calculatePayment(loanDetails) * ((Math.pow(1 + (loanDetails.apr / 1200), currentPeriod) - 1) / (loanDetails.apr / 1200)), 2);
    }

    /**
     *  http://www.financeformulas.net/Remaining_Balance_Formula.html
     * @param loanDetails
     * @param {number} currentPeriod
     * @returns {number}
     */
    static remainingBalance = (loanDetails: any, currentPeriod: number) => {
        return Estimator.precisionRound(Estimator.fvOfOriginalBalance(loanDetails, currentPeriod) - Estimator.fvOfAnnuity(loanDetails, currentPeriod), 2);
    }

    static precisionRound = (unroundedNumber: number, precision: number ): number => {
        const factor = Math.pow(10, precision);
        return Math.round(unroundedNumber * factor) / factor;
    }
}
