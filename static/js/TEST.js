d3.json("static/data/ML_departamento_en_venta_Del_valle.json")
.then(data=>{


    let studied_array = []
    
    data.forEach(d=>{

        studied_array.push(
            d['Precio por m2']
            )
        })
    


// sort array ascending
const asc = studied_array.sort((a, b) => a - b);

const sum = studied_array.reduce((a, b) => a + b, 0);

const mean = sum / studied_array.length;


// sample standard deviation
const std = (studied_array) => {
    const mu = mean(studied_array);
    const diffArr = studied_array.map(a => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / (studied_array.length - 1));
};

const quantile = (studied_array, q) => {
    const sorted = asc;
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

// const q25 = quantile(studied_array, .25);
// const q50 = quantile(studied_array, .50);
// const q75 = quantile(studied_array, .75);
// const median = q50;


let quantiles_ranges = [.125, .25, .5, .75];
let quantiles_list = []
let quantiles_actual_array = []

quantiles_ranges.forEach( d => {
    
    quantiles_list.push( quantile(studied_array, d)/100 )
    quantiles_actual_array.push( quantile(studied_array, d) )


})


// Create our number formatter.
var formatter = new Intl.NumberFormat('en-MX', {
    style: 'currency',
    currency: 'MXN',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  
//   formatter.format(2500); /* $2,500.00 */


quantiles_actual_array.forEach( d => {
    // console.log(formatNum(d)) //logs 1123355.5
    // console.log(formatter.format(d)) //logs 1123355.5
})



// console.log(quantiles_list)

})