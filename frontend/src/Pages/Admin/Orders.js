import React, { useEffect } from 'react'
import { Line } from "react-chartjs-2";
import { getOrdersPrediction } from "../../utils";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
const Orders = () => {
    const [data, setData] = React.useState([])
    useEffect(() => {
        let request = getOrdersPrediction().then(response => {
            let { body, status } = response;
            console.log(body, status)
            if (status === 200) {
                body.result.pop()
                setData(body.result)
            }
        });
    }, []);
    const options = {
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
                text: 'Number of orders',
                font: {
                    size: 25,
                    family: "Poppins, sans-serif",
                },
            },
        },
    };

    const labels = data.map((item) => {
        return Object.keys(item);
    });

    const predictdata = {
        labels,
        datasets: [
            {
                label: "actual",
                borderColor: "rgb(53, 162, 235)",
                data: data.map((item) => {
                    return item[Object.keys(item)[0]].actual;
                }),
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
            {
                label: "predict",
                borderColor: "rgb(255, 99, 132)",
                data: data.map((item) => {
                    return item[Object.keys(item)[0]].predict;
                }),
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };

    return (
        <div style={{padding:"40px"}}>
            <Line style={{
                width: "850px", height: "650px", display: 'flex', margin: 'auto', padding: "20px", marginTop: "30px", backgroundColor: "#f3f3f3",
                boxShadow: '1px 2px 9px #1C2331',
            }} options={options} data={predictdata} />
        </div>
    );
}

export default Orders