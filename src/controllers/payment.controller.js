import { getDatabaseInstance } from '../config/dbManager.config.js';

export const getValidPayment = async (req, res) => {  
  
    try {

      const place_id = Number(req.params.place_id)
      const sequelize = getDatabaseInstance(place_id);

      if (!sequelize) {
        return res.status(500).json({
          message: "Error getting database instance",
        });
      }

      const [validPaymentFound, metadata] = await sequelize.query(
        `execute sp_consulta_pago_valido ${req.params.service_id}, '${req.params.process_ids}', ${req.params.valid_days}, '${req.params.start_date}', '${req.params.finish_date}', ${req.params.type}`,
        {
          timeout: 90000 // 40 segundos, por ejemplo
        }
      );

      if(!validPaymentFound[0]) return res.status(400).json({
        message: "not found valid payments"
      })      
    
      res.json(validPaymentFound)      

    } catch (error) {
      console.log('error',error)
      return res.status(404).json({message: 'valid payments not found'})
    }  
  }