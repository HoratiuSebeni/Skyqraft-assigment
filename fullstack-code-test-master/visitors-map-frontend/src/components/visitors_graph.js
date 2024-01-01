import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

const LineGraph = ({ data }) => {
    const [chartData, setChartData] = useState(null)

    useEffect(() => {
        // Sort the data in descending order by access_count
        const sortedDataByAccessCount = [...data].sort((a, b) => a.access_count - b.access_count);

        // Take the top 10 objects from the sortedDataByAccessCount
        const top10Data = sortedDataByAccessCount.slice(-10);

        // Update the chartData when the data prop changes
        setChartData({
            labels: top10Data.map((point) => {
                return point.ip
        }),
            datasets: [
                {
                    data: top10Data.map((point) => point.access_count),
                    backgroundColor: ["#6AB27C"],
                    borderColor: "#0E1059",
                    borderWidth: 2,
                    cubicInterpolationMode: "monotone",
                    tension: 0.4,
                },
            ],
        });
    }, [data]);

    return chartData ? (
        <div className="me-2 pe-4 ps-4 pt-2 pb-2" style={{ borderRadius: "50px", backgroundColor: "#242e36"}}>
            <h4 className='ps-4'>Top Visitors</h4>
            <Line
                data={chartData}
                options={{
                    plugins: {
                        legend: {
                            display: false,
                        },
                        datalabels: {
                            anchor: "end",
                            align: "top",
                            offset: 4,
                            color: "#73787d",
                        },
                    },
                }}
            />
        </div>
    ) : (
        <></>
    );
};

export default LineGraph;
