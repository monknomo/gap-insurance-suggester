import MockApi from "./MockApi";
import ILoanDetails from "./ILoanDetails";
import IGapEligible from "./IGapEligible";

export default class Suggester {

    static suggest = (loanDetails: ILoanDetails): IGapEligible => {
        const estimatedValue: number = MockApi.getEstimatedValue(loanDetails.vin);
        const depreciationSchedule: number[] = MockApi.getDepreciationSchedule(loanDetails.vin);
        if (estimatedValue === undefined || depreciationSchedule.length === 0) {
            return {"eligible": true};
        }
        const valuesByMonth: number[] = Suggester.getValuesByMonth(depreciationSchedule, estimatedValue);
        const loanBalanceByMonth: number[] = Suggester.getLoanBalanceByMonth(loanDetails);
        let value = {"eligible": false};
        for (let i = 0; i < loanBalanceByMonth.length && i < valuesByMonth.length; i++) {
            if (valuesByMonth[i] < loanBalanceByMonth[i]) {
                value = {"eligible": true};
            }
        }
        return value;
    }

     static getLoanBalanceByMonth = (loanDetails: ILoanDetails): number[] => {
        const loanBalanceByMonth: number[] = [];
        for (let i = 1; i <= loanDetails.term; i++) {
            loanBalanceByMonth.push(Suggester.remainingBalance(loanDetails, i));
        }
        return loanBalanceByMonth;
    }

    static getValuesByMonth = (depreciationSchedule: number[], initialValue: number): number[] => {
      return [].concat.apply([], depreciationSchedule.map((value, index, arr) => {
          const monthlyDepreciation = arr[index] / 12;
          const depreciationByMonth = [];
            if (index === 0) {
                for (let i = 1; i < 13; i++) {
                    depreciationByMonth.push(Suggester.precisionRound(initialValue - i * monthlyDepreciation, 2));
                }
            } else {
                let lastYearFinalValue = initialValue;
                for (let j = 0; j < index; j++) {
                  lastYearFinalValue -= arr[j];
                }
                for (let i = 1; i < 13; i++) {
                    depreciationByMonth.push(Suggester.precisionRound(lastYearFinalValue - i * monthlyDepreciation, 2));
                }
            }
            return depreciationByMonth;
        }));
    }

    static calculatePayment = (loanDetails: ILoanDetails): number => {
        const monthlyRate = loanDetails.apr / 1200;
        return (loanDetails.amountFinanced * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -1 * loanDetails.term));
    }

    static fvOfOriginalBalance = (loanDetails: ILoanDetails, currentPeriod: number): number => {
        return Suggester.precisionRound(loanDetails.amountFinanced * Math.pow((1 + (loanDetails.apr / 1200)), currentPeriod), 2);
    }

    static fvOfAnnuity = (loanDetails: ILoanDetails, currentPeriod: number): number => {
        return Suggester.precisionRound(Suggester.calculatePayment(loanDetails) * ((Math.pow(1 + (loanDetails.apr / 1200), currentPeriod) - 1) / (loanDetails.apr / 1200)), 2);
    }

    /**
     *  http://www.financeformulas.net/Remaining_Balance_Formula.html
     * @param loanDetails
     * @param {number} currentPeriod
     * @returns {number}
     */
    static remainingBalance = (loanDetails: ILoanDetails, currentPeriod: number): number => {
        return Suggester.precisionRound(Suggester.fvOfOriginalBalance(loanDetails, currentPeriod) - Suggester.fvOfAnnuity(loanDetails, currentPeriod), 2);
    }

    static precisionRound = (unroundedNumber: number, precision: number ): number => {
        const factor = Math.pow(10, precision);
        return Math.round(unroundedNumber * factor) / factor;
    }
}
