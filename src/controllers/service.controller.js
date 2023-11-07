import { getDatabaseInstance } from "../config/dbManager.config.js";

export const getPlaceServiceByUserId = async (req, res) => {

  const place_id = 0 
  const sequelize = getDatabaseInstance(place_id) 
  
    try {
      const [serviceFound, metadata] = await sequelize.query(`execute sp_get_place_service_by_user_id '${req.params.user_id}','${req.params.place_id}'`)

      if(!serviceFound[0]) return res.status(400).json({
        message: "not found service"
      })      
    
      res.json(serviceFound)

    } catch (error) {
      console.log(error)
      return res.status(404).json({message: 'service not found'})
    }  
  }