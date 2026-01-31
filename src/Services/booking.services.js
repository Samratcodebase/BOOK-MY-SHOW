import Booking from "../Models/booking.model.js";
const createBooking = async (payload) => {
 
     
  const response = await Booking.create({payload});
  if(!response){
    
  }
     

};

export default createBooking;
