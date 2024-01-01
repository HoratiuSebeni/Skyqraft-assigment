import { React, useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import '../App.css';
import DateRangePicker from './date_picker';

const FilterComponent = ({ data, choosedOption }) => {
    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        country: '',
    })
    const [uniqueCountries, setUniqueCountries] = useState([]);

    useEffect(() => {
        // Run this code only once when the component mounts
        const countries = [...new Set(data.map(item => item.country))];
        setUniqueCountries(countries);
    }, []);

    const handleFilterChange = (date, filter) => {
        setFilters(prevFilters => ({ ...prevFilters, [filter]: date }));
        console.log(filters)
    };

    const handleSubmit = () => {
        choosedOption(filters)
        console.log(filters)
        console.log(choosedOption)
    }

    return (
        <div className="row pe-4 ps-4 pt-2 pb-2 mb-4" style={{ borderRadius: "50px", backgroundColor: "#242e36"}}>
            <p>
                Filters
            </p>
            <div className='col-7'>
                <DateRangePicker
                    startDate={filters.start_date}
                    endDate={filters.end_date}
                    onStartDateChange={(date) => {handleFilterChange(date, 'start_date')}}
                    onEndDateChange={(date) => {handleFilterChange(date, 'end_date')}}
                />
            </div>
            <div className='col-2 ps-2 pe-2'>
                <select 
                    className='btn btn-info'
                    id="countrySelect" 
                    value={filters.country}
                    onChange={(event) => {handleFilterChange(event.target.value, 'country')}
                }>
                    <option value=''>All Countries</option>
                    {uniqueCountries.map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>
            </div>
            <div className='col'>
                <button
                    className='col btn btn-warning ms-2 me-1'
                    id='No filters'
                    onClick={() => {
                        setFilters({
                            start_date: '',
                            end_date: '',
                            country: '',
                        })
                    }
                }
                >
                    Reset filters
                </button>
                <button
                    className='col btn btn-warning ms-1 me-2'
                    id='Submit'
                    onClick={handleSubmit}
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default FilterComponent