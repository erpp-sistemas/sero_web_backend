import { getDatabaseInstance } from "../config/dbManager.config.js";

export const getAccountHistoryByCount = async (req, res) => {
  if (!req.params?.plaza) {
    return res.status(400).json({
      message: "Missing 'plaza' parameter",
    });
  } 
  const place_id = Number(req.params?.plaza);
  const account_id =req.params?.account
  console.log(place_id);
  const sequelize = getDatabaseInstance(place_id);

  try {
    const [account, metadata] = await sequelize.query(`execute sp_get_account_history '${account_id}'`)
    // Verifica si accountHistory es undefined o tiene algún valor
    if(!account[0]) return res.status(400).json({
      message: "not found account"
    })      
  
    res.json(account)

  } catch (error) {
    console.log(error)
    return res.status(404).json({message: 'account not found'})
  }  
};


