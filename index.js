
let state =  { loanEmi: 0, totalIntrestPayble: 0, totalPayment: 0, dataTable: [], dataAdv: [] }
$(document).ready( function () {
    state = EmiCalculator(2500, 8, 10)
    generator(state)
  });
function setToText(inputId, mode) {
    document.getElementById(inputId).value = event.target.value
    const loanAmount = parseInt(document.getElementById(mode + 'LoanAmount').value)
    const loanRate = parseFloat(document.getElementById(mode + 'LoanIntrest').value)
    const loanDuration = parseInt(document.getElementById(mode + 'LoanTenure').value)
    if(loanDuration>120){
        return alert("Tenure canot be greater than 120 years");
    }
    state = EmiCalculator(loanAmount, loanDuration, loanRate)
    generator(state)
   
}

function setToRange(inputId, mode){
    document.getElementById(inputId + 'R').value=document.getElementById(inputId).value
    const loanAmount = parseInt(document.getElementById(mode + 'LoanAmount').value)
    const loanRate = parseFloat(document.getElementById(mode + 'LoanIntrest').value)
    const loanDuration = parseInt(document.getElementById(mode + 'LoanTenure').value)
    if(loanDuration>120){
        return alert("Tenure canot be greater than 120 years");
    }
    state = EmiCalculator(loanAmount, loanDuration, loanRate)
    generator(state)
}

function generator(state){
    document.getElementById('Loan_Emi').innerText = state.loanEmi
    document.getElementById('Total_Interest_Payable').innerText = state.totalIntrestPayble
    document.getElementById('Total_Payment').innerText = state.totalPayment
   
    updatePi([state.totalPayment-state.totalIntrestPayble,state.totalIntrestPayble])
    updateBar({
        labels:[...state.dataAdv.map(x=>x.year)],
        remaining:[...state.dataAdv.map(x=>x.remaining)],
        principle:[...state.dataAdv.map(x=>x.principle)],
        interest:[...state.dataAdv.map(x=>x.interest)]
    })
    document.getElementById('dataTableBody').innerHTML = ''
    state.dataAdv.forEach((x,i) => {
        let tr = '';
        let sign = (i%2==0)?'even':'odd';
        let ctr = '<tr class="hide childTr" id="childtr'+i+'"><td colspan="7"><table class="childTable stripe row-border order-column table table-bordered" style="min-width:100%;"><thead><tr id="childtr" class="childtr"><th></th><th>Month</th><th>Principle</th><th>Interest</th><th>Total Payment</th><th>Balance</th><th>Loan Paid To Date</th></tr></thead><tbody>';
        x.datas.forEach(y=>{
            ctr += '<tr class="nobg childtr" ><td></td><td class="nobg">' + y.month + '</td><td>₹' + y.principle + '</td><td>₹' + y.interest + '</td><td>₹' + y.totalPayment + '</td><td>₹' + y.remaining + '</td><td>' + y.loanPaid + '%</td></tr>';
        });
        ctr = ctr+'</tbody><table></td></tr>';
        document.getElementById('dataTableBody').innerHTML += '<tr class="'+sign+' parent" id="trid'+i+'"><td onclick="expandHandler(\'childtr'+i+'\')" class="bg sorting_1" index="' + i + '"></td><td>' + x.year + '</td><td>₹' + x.principle + '</td><td>₹' + x.interest + '</td><td>₹' + x.totalPayment + '</td><td>₹' + x.remaining + '</td><td>' + x.loanPaid + '%</td></tr></tr>'+ctr;
        ctr = ''
      
    })

    console.log(state)

}
function expandHandler(id){
    $('#'+id).toggleClass('hide');
    event.target.classList.toggle('closed')
}

// calculate Emi by months
function EmiCalculator(p, n, r) {
    console.log(n)
    const mName = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    let date = new Date()
    let currYear = parseInt(date.getFullYear())
    let currMonth = date.getMonth()
    r = r / (12 * 100)
    let t = n * 12
    let total = 0
    let amount = p
    let emi = (p * r * Math.pow(1 + r, t)) / (Math.pow(1 + r, t) - 1) + 0.00000414;
    let details = { loanEmi: parseInt(emi + .05), totalIntrestPayble: 0, totalPayment: 0.5, dataTable: [], dataAdv: [] }
    for (let i = n * 12; i > 0; i--) {
        if (currMonth == 12) {
            currMonth = 0;
            let temp = { year: currYear, principle: 0, interest: 0, totalPayment: 0, remaining: 0 }
            details.dataTable.forEach(x => {
                temp.principle = temp.principle + x.principle
                temp.interest += x.interest
                temp.totalPayment += x.totalPayment,
                    temp.remaining = x.remaining,
                    temp.loanPaid=100-((x.remaining/p)*100).toFixed(2)
                   
            })
            details.dataAdv.push({ ...temp, datas: details.dataTable })
            details.dataTable = []
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
            totalPayment: parseInt(principle + 0.5) + parseInt(interest + .5),
            remaining: Math.abs(parseInt(amount - principle + .5)),
             loanPaid:100-((Math.abs(parseInt(amount - principle + .5))/p)*100).toFixed(2)
        })
        amount -= principle
        currMonth++;
    }

    let temp = { year: currYear, principle: 0, interest: 0, totalPayment: 0, remaining: 0 }
    details.dataTable.map(x => {
        temp.principle += x.principle
        temp.interest += x.interest
        temp.totalPayment += x.totalPayment
        temp.remaining = x.remaining
        temp.loanPaid=100-((x.remaining/p)*100).toFixed(2)
    })
    details.dataAdv.push({ ...temp, datas: details.dataTable })
    details.dataTable = []

    details.totalIntrestPayble = parseInt(details.totalPayment - p)
    details.totalPayment = parseInt(details.totalPayment)
    return details
}
//   for pi chart
var xValues = ["Principle Loan Amount", "Total Intrest"];
var yValues = [199, 30];
var barColors = [
    "#b91d47",
    "#00aba9"
];
const myLivePiChart=new Chart("myPieChart", {
    type: "pie",
    data: {
        labels: xValues,
        datasets: [{
            backgroundColor: barColors,
            data: yValues
        }]
    },
    options: {
        title: {
            display: true,
            text: "World Wide Wine Production 2018"
        }
    }
});
function updatePi(data,chart=myLivePiChart) {
    chart.data = {
        labels: xValues,
        datasets: [{
            backgroundColor: barColors,
            data: data
        }]
       
    };
    chart.update();
}

// setup for bar chart
let data = {
    labels: ['sun','mon','tues'],
    datasets: [{
        label: 'line Sales',
        data: [18, 12, 6, 9, 12, 3, 9],
        backgroundColor: ['blue'],
        borderColor: ['black'],
        tension: 0.4,
        type: 'line'
    }, {
        label: 'Weekly Sales',
        data: [18, 12, 6, 9, 12, 3, 9],
        backgroundColor: [

            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 26, 104, 1)',

        ],
        borderWidth: 1
    }, {
        label: 'total Sales',
        data: [18, 12, 6, 9, 12, 3, 9],
        backgroundColor: ['red'],
        borderColor: ['green'],
        borderWidth: 1
    }]
};

// config 
const config = {
    type: 'bar',
    data,
    options: {
        scales: {
            x: {
                stacked: true,
            },
            y: {
                beginAtZero: true,
                stacked: true
            }
        }
    }
};

// render init block
const myChart = new Chart(
    document.getElementById('myChart'),
    config
);
// updateBar({labels:[...state.dataAdv.map(x=>x.year)],})
function updateBar(data,chart=myChart) {
    chart.options= {
        scales: {
            x: {
                stacked: true,
               
            },
            y: {
                beginAtZero: true,
                stacked: true
            }
        }
    }
    chart.data= {
        labels: data.labels,
        datasets: [{
            label: 'Balance',
            data: data.remaining,
            backgroundColor: ['blue'],
            borderColor: ['black'],
            tension: 0.4,
            type: 'line'
        }, {
            label: 'Principle',
            data: data.principle,
            backgroundColor: [
    
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 26, 104, 1)',
    
            ],
            borderWidth: 1
        }, {
            label: 'Interest',
            data: data.interest,
            backgroundColor: ['red'],
            borderColor: ['green'],
            borderWidth: 1
        }]
    }
    chart.update();
};
  





