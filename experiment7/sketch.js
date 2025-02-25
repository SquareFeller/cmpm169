const xtimes = [];
const isai_intensity = [];
const isai_colors = []
const keven_intensity = [];
const keven_colors = [];
const thickness = 40;

makeChart();
let delayed;
async function makeChart(){
  await getData();
  const ctx = document.getElementById('chart'); 
  ctx.style.backgroundColor = '#12154B';
  // config type of chart
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: xtimes,
      datasets: [{
        label: 'Isai',
        data: isai_intensity,
        fill: false,
        borderColor: 'black', //'pink',
        backgroundColor: isai_colors,
        borderWidth: 1,
        borderSkipped: false,
        barThickness: thickness
         
     },
     {
        label: 'Keven',
        data: keven_intensity,
        borderWidth: 1,
        fill: false,
        borderColor: 'black',//'rgb(20, 52, 164)',
        backgroundColor: keven_colors,
        borderSkipped: false,
        borderWidth: 1,
        barThickness: thickness
      }]
    },
    options: {
      //animation code found here: https://www.chartjs.org/docs/latest/samples/animations/delay.html
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          console.log(context.type);
          console.log(context.mode);
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * 100 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
  
      scales: {
        x:{
          ticks:{
            color: 'white'
          },
          grid:{
            color: 'gray'
          }
        },
        y: {
          ticks:{
            color: 'white'
          },
          grid:{
            color: 'gray'
          },
          min: -10,
        max: 10,
        }
      },

      plugins:{
        legend: {
        display: true,  // Set to false to hide the legend
        position: 'top', // Options: 'top', 'left', 'bottom', 'right'
        title: {
          display: true,
           text: "Aurora Modus (Mood Chart) - 2/22/25", // Name of title
           font: {
                  size: 14,
                  weight: 'bold'
           },
           padding: 15,
           color: ['white']
        }
      }
    },

  }
  });
}


async function getData(){
  const response = await fetch('Mood - Sheet2.csv');
  const data = await response.text();
  console.log(data);

  const table = data.split('\n').slice(1);
  table.forEach(row => {
    const columns = row.split(',');
    console.log(columns);
    const time = columns[0];
    xtimes.push(time);
    const intensity = columns[1];
    const k_intensity = columns[3];
    keven_intensity.push([parseFloat(k_intensity), -parseFloat(k_intensity)])
    isai_intensity.push([parseFloat(intensity), -parseFloat(intensity)]);

    const i_color = columns[2];
    const k_color = columns[4];
    isai_colors.push(i_color);
    keven_colors.push(k_color);
  })
}