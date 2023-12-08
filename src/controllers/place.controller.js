import { getDatabaseInstance } from "../config/dbManager.config.js";

export const getPlaceByUserId = async (req, res) => {

  const place_id = 0 
  const sequelize = getDatabaseInstance(place_id) 
  
  try {
    const [placeFound, metadata] = await sequelize.query(`execute sp_get_place_by_user_id '${req.params.user_id}'`)

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

export const getPlaceById = async (req, res) => {
  try {

    const place_id = 0 
    const sequelize = getDatabaseInstance(place_id) 
    
    const [placeFound, metadata] = await sequelize.query(`execute sp_get_place_by_id '${req.params.place_id}'`)

    console.log("este es el param:" + req.params.place_id)

    if (!placeFound[0]) return res.status(400).json({
      message: "not found place"
    })

    res.json(placeFound)

  } catch (error) {
    console.log(error)
    return res.status(404).json({ message: 'place not found' })
  }
}