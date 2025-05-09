class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      let filterObj = {};
      let queryObj = { ...this.queryString };
  
      // Price range
      if (queryObj.minPrice && queryObj.maxPrice) {
        if (queryObj.maxPrice.includes('>')) {
          filterObj.price = { $gte: queryObj.minPrice };
        } else {
          filterObj.price = {
            $gte: queryObj.minPrice,
            $lte: queryObj.maxPrice
          };
        }
      }
  
      // Property type
      if (queryObj.propertyType) {
        let types = queryObj.propertyType.split(',').map(type => type.toLowerCase());
        filterObj.propertyType = { $in: types };
      }
  
      // Room type
      if (queryObj.roomType) {
        filterObj.roomType = queryObj.roomType;
      }
  
      // Amenities
      if (queryObj.amenities) {
        filterObj['amenities.name'] = { $all: queryObj.amenities };
      }
  
      this.query = this.query.find(filterObj);
      return this;
    }
  
    search() {
      let searchFilter = {};
      let queryObj = { ...this.queryString };
  
      // Location-based search
      if (queryObj.city) {
        const searchValue = queryObj.city.trim().replaceAll(' ', '');
        searchFilter = {
          $or: [
            { 'address.city': searchValue },
            { 'address.state': searchValue },
            { 'address.area': searchValue }
          ]
        };
      }
  
      // Guest count
      if (queryObj.guests) {
        searchFilter.maximumGuest = { $gte: queryObj.guests };
      }
  
      // Date availability
      if (queryObj.dateOut && queryObj.dateIn) {
        searchFilter.$and = [
          {
            currentBookings: {
              $not: {
                $elemMatch: {
                  $or: [
                    {
                      fromDate: { $lt: queryObj.dateIn },
                      toDate: { $gt: queryObj.dateOut }
                    },
                    {
                      fromDate: { $lt: queryObj.dateIn },
                      toDate: { $gt: queryObj.dateIn }
                    }
                  ]
                }
              }
            }
          }
        ];
      }
  
      this.query = this.query.find(searchFilter);
      return this;
    }
  
    paginate() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 12;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
  }
  
  module.exports = APIFeatures;
  