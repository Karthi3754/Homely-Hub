import React, { useState } from 'react'
import { DatePicker, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { getAllProperties } from '../../Store/Property/property-action';
import { propertyAction } from '../../Store/Property/property-slice';

const Search = () => {

    const { RangePicker } = DatePicker;
    const [keyword, setKeyword] = useState({});
    const [value, setValue] = useState([]);

    const dispatch = useDispatch();
    function searchHandler(e) {
        e.preventDefault();
        dispatch(propertyAction.updateSearchParams(keyword));
        dispatch(getAllProperties());
        setKeyword({
            city: "",
            guests: "",
            dateIn: "",
            dateOut: "",
        })
        setValue([])
    }

    function returnDates(date, dateString) {
        setValue([date[0], date[1]]);
        updateKeyword('dateIn', dateString[0]);
        updateKeyword('dateOut', dateString[1]);
    }

    const updateKeyword = (field, value) => {
        setKeyword((prevKeyword) => ({
            ...prevKeyword,
            [field]: value
        }))
    }

    return (
        <>
            <div className='searchbar pl-2 d-flex align-items-center rounded rounded-pill h-100' style={{width:'90%'}} >
                <input
                    className='form-control col-sm-4 rounded rounded-pill bg-dark text-light' style={{border: 'transparent'}}
                    id='search_destination'
                    placeholder='Search Destination'
                    type='text'
                    value={keyword.city}
                    onChange={(e) => updateKeyword("city", e.target.value)}
                />
                    <input
                        className='form-control col-sm-2 rounded rounded-pill bg-dark text-light' style={{border: 'transparent'}}
                        id='addquest'
                        placeholder='Add guest'
                        type='number'
                        value={keyword.guests}
                        onChange={(e) => updateKeyword("guests", e.target.value)}
                    />
                <Space direction='verticle' size={12}>
                    <RangePicker 
                        value={value}
                        format="YYYY-MM-DD"
                        picker="date"
                        className="date_picker form-control col-12 d-flex rounded rounded-pill fs-2 bg-dark text-light" style={{border: '2px solid grey'}}
                        disabledDate={(current) => { 
                            return current && current.isBefore(Date.now(), "day"); 
                        }}
                        onChange={returnDates}
                    />
                </Space>

                <span className="material-symbols-outlined searchicon" onClick={searchHandler}>
                    search
                </span>
            </div>
        </>
    )
}

export default Search

