import React, { useEffect, useState } from 'react'
import FilterModal from './FilterModal';
import { useDispatch} from 'react-redux';
import { getAllProperties } from '../../Store/Property/property-action';
import { propertyAction } from '../../Store/Property/property-slice';

const Filter = () => {
    const [isModalOpen,setIsModalOpen]=useState(false);

    const[selectedFilters,setSelectedFilters]=useState({});

    const dispatch=useDispatch();
    useEffect(()=>{
       dispatch(propertyAction.updateSearchParams(selectedFilters));
       dispatch(getAllProperties());
    }, 
    [selectedFilters,dispatch]);

    const handleOpenModal=()=>{
     setIsModalOpen(true);
    }
    const handleCloseModal=()=>{

        setIsModalOpen(false);
    }
    const handleFilterChange=(filterName,value)=>{

        setSelectedFilters((prevFilters)=>({
        ...prevFilters,
        [filterName]:value,
      }))
    }
  return(
   <>
  <span className="material-symbols-outlined filter" onClick={handleOpenModal}>tune</span>
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
