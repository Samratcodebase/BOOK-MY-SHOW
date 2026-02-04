import Show from "../Models/show.model.js"
const getShow =async (id) => {
     
       const show = await Show.findOne({_id:id});
     
       

}