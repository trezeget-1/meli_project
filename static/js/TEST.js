d3.json("static/data/ML_departamentos_CDMX.json")
.then(data=>{

    let studied_array = []

    data.forEach( d=> {
      
      studied_array.push(
        d['Precio por m2']
        )
        
    }) 

    let amount_of_shares_desired = 7

    let quantiles_ranges = []

    for (let i=1, n=amount_of_shares_desired; i<n; i++){
        quantiles_ranges.push(i/7)
    }

    function quantile_definition(quantiles_ranges){

        
        // THIS IS TO OBTAIN THE QUARTILES FOR THE ARRAY M2
        
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
        
        let quantiles_list = []
        let quantiles_actual_array = []
        
        quantiles_ranges.forEach( d => {
            
            quantiles_actual_array.push( quantile(studied_array, d) )
            quantiles_list.push( quantile(studied_array, d)/100 )
        })
        
        return quantiles_actual_array

    }

    // console.log(quantile_definition(quantiles_ranges))

})