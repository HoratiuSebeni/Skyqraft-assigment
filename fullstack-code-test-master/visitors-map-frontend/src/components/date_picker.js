import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../App.css';
import { setHours, setMinutes, setSeconds } from 'date-fns';

const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  const handleStartDateChange = date => {
    // Set time to 00:00:00
    const modifiedDate = setSeconds(setMinutes(setHours(date, 0), 0), 0);
    onStartDateChange(modifiedDate);
  };

  const handleEndDateChange = date => {
    // Set time to 23:59:59
    const modifiedDate = setSeconds(setMinutes(setHours(date, 23), 59), 59);
    onEndDateChange(modifiedDate);
  };

  return (
    <div className='row align-items-center'>
      <div className='col-6'>
        <label className='col-4'>Start Date: </label>
        <DatePicker selected={startDate} onChange={handleStartDateChange} className='col btn btn-info'/>
      </div>
      <div className='col-6'>
        <label className='col-4'>End Date: </label>
        <DatePicker selected={endDate} onChange={handleEndDateChange} className='col btn btn-info'/>
      </div>
    </div>
  );
};

export default DateRangePicker;
