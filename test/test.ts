import { suite, test } from "mocha-typescript";
import * as assert from "assert";
import Estimator from "../src/estimator";

@suite class TestEstimator {


  //TODO test what happens when term is longer than depreciation estimate
    @test showGapOffer() {
        assert.deepEqual( Estimator.estimate({}), { "eligible": true }, "Expected to default to true");
        // bmw 3-series
        assert.deepEqual( Estimator.estimate({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}), {"eligible": true}, "Expected to show gap offer");

        // the cheapest car on carmax; a nissan versa
        assert.deepEqual( Estimator.estimate({"vin": "3N1BC11EX8L409074",
            "amountFinanced": 2000,
            "apr": 4.8,
            "term": 48}), {"eligible": false}, "Expected to skip gap offer 1");
    }

    @test loanBalanceByMonth() {
        assert.deepEqual(Estimator.getLoanBalanceByMonth({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 12}), [18369.68, 16732.84, 15089.45, 13439.49, 11782.92, 10119.74, 8449.89, 6773.37, 5090.15, 3400.19, 1703.47, -0.04], "expected loan balance for bmw loan");
    }

    @test getValuesByMonth() {
      assert.deepEqual(Estimator.getValuesByMonth([20000],20000), [18333.33, 16666.67, 15000, 13333.33, 11666.67, 10000, 8333.33, 6666.67, 5000, 3333.33, 1666.67, 0], "")
    }

    @test monthlyPayment() {
        assert.equal(Estimator.calculatePayment({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}), 458.78, "expected monthly payment");

    }

    @test fvOfOriginalBalance() {
        assert.equal(Estimator.fvOfOriginalBalance({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}, 0), 20000, "expect full balance to be owed");
        assert.equal(Estimator.fvOfOriginalBalance({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}, 1), 20080, "1st period's interest");
        assert.equal(Estimator.fvOfOriginalBalance({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}, 12), 20981.40
            , "1st year's interest");
        assert.equal(Estimator.fvOfOriginalBalance({"vin": "WBA3K5C54EK300127",
                "amountFinanced": 20000,
                "apr": 4.8,
                "term": 48}, 24), 22010.97

            , "1st year's interest");
        assert.equal(Estimator.fvOfOriginalBalance({"vin": "WBA3K5C54EK300127",
                "amountFinanced": 20000,
                "apr": 4.8,
                "term": 48}, 36), 23091.05

            , "1st year's interest");
        assert.equal(Estimator.fvOfOriginalBalance({"vin": "WBA3K5C54EK300127",
                "amountFinanced": 20000,
                "apr": 4.8,
                "term": 48}, 48), 24224.13

            , "1st year's interest");
    }

    @test fvOfAnnuity() {
      assert.equal(Estimator.fvOfAnnuity({"vin": "WBA3K5C54EK300127",
          "amountFinanced": 20000,
          "apr": 4.8,
          "term": 48}, 0), 0, "initial interest");
        assert.equal(Estimator.fvOfAnnuity({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}, 1), 458.78, "initial interest");
        assert.equal(Estimator.fvOfAnnuity({"vin": "WBA3K5C54EK300127",
                "amountFinanced": 20000,
                "apr": 4.8,
                "term": 48}, 48), 24224.34, "initial interest");
    }

    @test remainingBalance() {
        assert.equal(Estimator.remainingBalance({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}, 0), 20000, "expected initial balance");
        assert.equal(Estimator.remainingBalance({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}, 1), 19621.22
            , "expected initial balance");
            assert.equal(Estimator.remainingBalance({"vin": "WBA3K5C54EK300127",
                "amountFinanced": 20000,
                "apr": 4.8,
                "term": 48}, 48), -.21
                , "expected initial balance");
    }
}
