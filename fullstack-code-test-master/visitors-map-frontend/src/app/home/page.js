import axios from "axios";
import React , { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import FilterComponent from "../../components/filter_visitors";
import MyMap from "../../components/map_component";
import LineGraph from "../../components/visitors_graph";

const Home = () => {
    let [data, setData] = useState(null)
    let [error, setError] = useState(null)
    const [requestData, setRequestData] = useState({
        start_date: '',
        end_date: '',
        country: '',
    });

    const fetchData = async () => {
        try {
            const response = await axios({
                method: 'POST',
                url: 'http://127.0.0.1:5000/visitors_list',
                headers: {
                'Content-Type': 'application/json',
                },
                data: {
                    start_date: requestData.start_date,
                    end_date: requestData.end_date,
                    country: requestData.country,
                }
            });
            // Check if the response indicates success
            if (response.status === 200) {
                // Handle the response data here
                console.log(response.data);
                setData(response.data);
                setError(null);
            } else {
                // Handle non-successful response
                console.error('Error fetching data:', response.status, response.statusText);
                setError(response.status + ' ' + response.statusText);
            }
            } catch (error) {
            // Handle errors here
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [requestData]);

    const handleChoosedOption = (data) => {
        setRequestData(data);
    }

    if (!data && !error) {
        return (
            <div className="App-header">
                <p>Loading...</p>
            </div>
        )
    };
    
    if (!data && error) {
        return (
            <div className="App-header">
                <p>{error}</p>
            </div>
        )
    };

    return (
        <div className="App-header">
            <div className="col-12 ms-4 me-4 mt-2 row justify-content-center align-items-center">
                <FilterComponent data={data} choosedOption={handleChoosedOption}/>
            </div>
            <div className="col-12 row justify-content-center align-items-center">
                <div className="col-6">
                    <MyMap data={data}/>
                </div>
                <div className="col-6">
                    <LineGraph data={data}/>
                </div>
            </div>
        </div>
    );
}

export default Home;