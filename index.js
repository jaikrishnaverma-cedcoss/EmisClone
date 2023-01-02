function EmiCalculator(p, n, r) {
    const mName = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    let date = new Date()
    let currYear = parseInt(date.getFullYear())
    let currMonth = date.getMonth()
    r = r / (12 * 100)
    let t = n * 12
    let total = 0
    let amount = p

    let emi = (p * r * Math.pow(1 + r, t)) / (Math.pow(1 + r, t) - 1) + 0.00000414;

    let details = { loanEmi: parseInt(emi + .05), totalIntrestPayble: 0, totalPayment: 0.5, dataTable: [] }

    for (let i = n * 12; i > 0; i--) {
        if (currMonth == 12) {
            currMonth = 0;
            currYear++
        }

        let interest = amount * r
        let principle = emi - interest
        details.totalPayment += principle + interest
        details.dataTable.push({
            year: currYear,
            month: mName[currMonth],
            principle: parseInt(principle + 0.5),
            interest: parseInt(interest + .5),
            totalPayment: parseInt(principle + interest + .5),
            remaining: Math.abs(parseInt(amount - principle + .5)),

        })

        amount -= principle
        currMonth++;
    }

    details.totalIntrestPayble = parseInt(details.totalPayment - p + .5)
    details.totalPayment = parseInt(details.totalPayment)
    return details
}



console.log(EmiCalculator(200000, 2, 10))