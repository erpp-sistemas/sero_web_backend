// import dbManager from '../config/dbManager.config.js'

// const connectDB = async (place_id) => {
//   if (place_id in dbManager) {
//     try {
//       await dbManager[place_id].authenticate();
//       console.log('>>> DB is connected for place_id:', place_id);
//       return dbManager[place_id];
//     } catch (error) {
//       console.log('Error connecting to the database:', error);
//       throw error;
//     }
//   } else {
//     throw new Error('Invalid place_id');
//   }
// };

// export default connectDB;