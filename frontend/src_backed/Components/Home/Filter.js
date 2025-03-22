import React, { useEffect, useState } from 'react'
import FilterModal from './FilterModal';
import { useDispatch } from 'react-redux';
import { getAllProperties } from '../../Store/Property/property-action';
import { propertyAction } from '../../Store/Property/property-slice';

const Filter = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    //State for storing selected filters
    const [selectedFilters, setselectedFilters] = useState({});

    const dispatch = useDispatch();
    useEffect(()=> {
        dispatch(propertyAction.updateSearchParams(selectedFilters));
        dispatch(getAllProperties())
    },[selectedFilters, dispatch])

    //Function to handle opening the modal
    const handleOpenModel = () => {
        setIsModalOpen(true);
    }

    //Function to handle closing the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    //Function to handle changes in filters
    const handleFilterChange = (filterName, value) => {
        setselectedFilters((prevFilters) => ({
            ...prevFilters, [filterName]: value
        }))
    }

    return (
        <>
            <a class="material-symbols-outlined text-danger" href="#" onClick={handleOpenModel}>
                tune
            </a>
            {isModalOpen && (
                <FilterModal
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                    onClose={handleCloseModal}
                />
            )}

        </>
    )
}

export default Filter
