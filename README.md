Test the project by running `npm run watch`.

Run the project by running `npm run watch-serve`

To interact with the running project, POST data to `/api/v1/products/gap/eligibility`.  The content-type must be `application/json`.  The data must be of the format:
   
    {
      "vin": "WBA3K5C54EK300127",
      "amountFinanced": 20000,
      "apr": 4.8,
      "term": 48
    } 

The application defaults to offering gap insurance in te cases of insufficient data or otherwise ambiguous cases.  
In the case where it is possible to determine whether gap insurance is advisable, the following procedure is followed:


1. The remaining value of the loan is calculate on a monthly basis
1. The estimated monthly depreciation is calculated from the projected annual depreciation
1. The estimated monthly worth of the vehicle is calculated from the monthly depreciation
1. The monthly remaining loan value is compared with the monthly estimated worth of the vehicle
1. If any of the months show the remaining loan value is greater than the estimated worth of the vehicle, gap insurance is offered