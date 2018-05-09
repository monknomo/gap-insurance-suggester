import { suite, test } from "mocha-typescript";
import * as assert from "assert";
import Suggester from "../src/Suggester";

@suite class TestSuggester {

    @test showGapOffer() {
        // bmw 3-series
        assert.deepEqual( Suggester.suggest({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}), {"eligible": true}, "Expected to show gap offer");

        // the cheapest car on carmax; a nissan versa
        assert.deepEqual( Suggester.suggest({"vin": "3N1BC11EX8L409074",
            "amountFinanced": 2000,
            "apr": 4.8,
            "term": 48}), {"eligible": false}, "Expected to skip gap offer 1");
        // longer term than data on depreciation
        assert.deepEqual( Suggester.suggest({"vin": "shortstuff",
            "amountFinanced": 7000,
            "apr": 4.8,
            "term": 48}), {"eligible": false}, "depreciation suggest time horizon shorter than loan term");
    }

    @test loanBalanceByMonth() {
        assert.deepEqual(Suggester.getLoanBalanceByMonth({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 12}), [18369.68, 16732.84, 15089.46, 13439.5, 11782.94, 10119.76, 8449.91, 6773.4, 5090.18, 3400.21, 1703.5, 0], "expected loan balance for bmw loan");
    }

    @test getValuesByMonth() {
      assert.deepEqual(Suggester.getValuesByMonth([20000], 20000), [18333.33, 16666.67, 15000, 13333.33, 11666.67, 10000, 8333.33, 6666.67, 5000, 3333.33, 1666.67, 0], "");
        assert.deepEqual(Suggester.getValuesByMonth([10000], 20000), [19166.67, 18333.33, 17500, 16666.67, 15833.33, 15000, 14166.67, 13333.33, 12500, 11666.67, 10833.33, 10000], "");
    }

    @test monthlyPayment() {
        assert.equal(Suggester.calculatePayment({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}), 458.77611130644334, "expected monthly payment");

    }

    @test fvOfOriginalBalance() {
        assert.equal(Suggester.fvOfOriginalBalance({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}, 0), 20000, "expect full balance to be owed");
        assert.equal(Suggester.fvOfOriginalBalance({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}, 1), 20080, "1st period's interest");
        assert.equal(Suggester.fvOfOriginalBalance({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}, 12), 20981.40
            , "1st year's interest");
        assert.equal(Suggester.fvOfOriginalBalance({"vin": "WBA3K5C54EK300127",
                "amountFinanced": 20000,
                "apr": 4.8,
                "term": 48}, 24), 22010.97

            , "1st year's interest");
        assert.equal(Suggester.fvOfOriginalBalance({"vin": "WBA3K5C54EK300127",
                "amountFinanced": 20000,
                "apr": 4.8,
                "term": 48}, 36), 23091.05

            , "1st year's interest");
        assert.equal(Suggester.fvOfOriginalBalance({"vin": "WBA3K5C54EK300127",
                "amountFinanced": 20000,
                "apr": 4.8,
                "term": 48}, 48), 24224.13

            , "1st year's interest");
    }

    @test fvOfAnnuity() {
      assert.equal(Suggester.fvOfAnnuity({"vin": "WBA3K5C54EK300127",
          "amountFinanced": 20000,
          "apr": 4.8,
          "term": 48}, 0), 0, "initial interest");
        assert.equal(Suggester.fvOfAnnuity({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}, 1), 458.78, "initial interest");
        assert.equal(Suggester.fvOfAnnuity({"vin": "WBA3K5C54EK300127",
                "amountFinanced": 20000,
                "apr": 4.8,
                "term": 48}, 48), 24224.13, "initial interest");
    }

    @test remainingBalance() {
        assert.equal(Suggester.remainingBalance({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}, 0), 20000, "expected initial balance");
        assert.equal(Suggester.remainingBalance({"vin": "WBA3K5C54EK300127",
            "amountFinanced": 20000,
            "apr": 4.8,
            "term": 48}, 1), 19621.22
            , "expected initial balance");
            assert.equal(Suggester.remainingBalance({"vin": "WBA3K5C54EK300127",
                "amountFinanced": 20000,
                "apr": 4.8,
                "term": 48}, 48), 0
                , "expected initial balance");
    }

}
