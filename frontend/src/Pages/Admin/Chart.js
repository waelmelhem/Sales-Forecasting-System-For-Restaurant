import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Chart(props) {
  const data = {
    labels: props.labels,
    datasets: [
      {
        label: "Percentag of correlation",
        data: props.data,
        backgroundColor: props.data?.map(e=>(e>=60)?'rgba(33,136,56, 0.9)':'rgba(224, 168, 0, 0.7)'),
        borderColor: props.data?.map(e=>e>=60?'rgba(33,136,56, 1)':'rgba(224, 168, 0, 1)'),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: {
        min: 1,
        max:1,
        beginAtZero: true,
        
      },
    },
    scales: {
      x: {
          ticks: {
              font: {
                  size: 14,
              },
              color: "black",
          },
      },
  },
  y: {
      ticks: {
          font: {
              size: 15,
          },
          color: "black",
      },
  },

  responsive: true,
  plugins: {
      legend: {
          position: "top",
      },
      title: {
          display: true,
          text: `${props.title}`,
          font: {
              size: 25,
              family: "Poppins, sans-serif",
          },
      },
  },
  };

  return <Bar data={data} options={options} />;
}

export default Chart;
