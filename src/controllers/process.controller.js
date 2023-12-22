import { getDatabaseInstance } from "../config/dbManager.config.js";

export const getPlaceServiceProcessByUserId = async (req, res) => {
  
  const place_id = 0 
  const sequelize = getDatabaseInstance(place_id) 

    try {

      console.log("este es el param:" + req.params.user_id)
      console.log("este es el param:" + req.params.place_id)
      console.log("este es el param:" + req.params.service_id)
      
      const [processFound, metadata] = await sequelize.query(`execute sp_get_place_service_process_by_user_id '${req.params.user_id}','${req.params.place_id}','${req.params.service_id}'`)

      if(!processFound[0]) return res.status(400).json({
        message: "not found process"
      })      
    
      res.json(processFound)

    } catch (error) {
      console.log(error)
      return res.status(404).json({message: 'process not found'})
    }  
  }