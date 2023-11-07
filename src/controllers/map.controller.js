import { getDatabaseInstance } from "../config/dbManager.config.js";

export const getServiceMapByIdPlaza = async (req, res) => {

  const place_id = 0 
  const sequelize = getDatabaseInstance(place_id) 

  try {
    const [placeFound, metadata] = await sequelize.query(`execute sp_get_service_map_by_id_plaza '${req.params.place_id}'`)

    console.log("este es el param:" + req.params.user_id)

    if (!placeFound[0]) return res.status(400).json({
      message: "not found place"
    })

    res.json(placeFound)

  } catch (error) {
    console.log(error)
    return res.status(404).json({ message: 'place not found' })
  }
}

export const getLayersMapByIdPlaza = async (req, res) => {
    try {
      const [placeFound, metadata] = await sequelize.query(`execute sp_get_layer_map_by_id_plaza '${req.params.place_id}'`)
  
      console.log("este es el param:" + req.params.user_id)
  
      if (!placeFound[0]) return res.status(400).json({
        message: "not found place"
      })
  
      res.json(placeFound)
  
    } catch (error) {
      console.log(error)
      return res.status(404).json({ message: 'place not found' })
    }
  }