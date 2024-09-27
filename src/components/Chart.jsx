import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Chart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/api/v1/marchands/sales-data/')
            .then(response => {
                setChartData({
                    labels: response.data.labels,
                    datasets: response.data.datasets
                });
            })
            .catch(error => console.error('Error fetching chart data:', error));
    }, []);

    if (!chartData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Sales Data</h2>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }}
            />
        </div>
    );
};

export default Chart;