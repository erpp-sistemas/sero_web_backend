import { createAccessToken } from "../libs/jwt.js"
//import {Access} from '../models/access.model.js'
//import sequelize from "../config/db.config.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {TOKEN_SECRET} from '../config.js'
import { getDatabaseInstance } from "../config/dbManager.config.js";
import { DataTypes } from 'sequelize';

export const register = async (req, res) => {

  const {name, first_last_name, second_last_name, birthdate, sex_id, user_name, password, password_hash, profile_id, active_web_access, active_app_movil_access, personal_phone, work_phone} = req.body
  const place_id = 0 
  const sequelize = getDatabaseInstance(place_id) 

  try { 
    
      // Importa el modelo 'Access' específico para la base de datos seleccionada
      const Access = sequelize.define('acceso', {
        usuario: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
      }, {
        timestamps: false,
        freezeTableName: true,
      });

      const userFound = await Access.findOne({
        where: { usuario: user_name },
      })
  
      if(userFound) return res.status(400).json(
        ['The email is already in use']
      )
  
      const passwordHash = await bcrypt.hash(password, 10)
  
      const queryNewUserData = await sequelize.query(`execute sp_new_user_data '${name}', '${first_last_name}', '${second_last_name}', '${birthdate}', ${sex_id}, '${user_name}', '${password}', '${passwordHash}', ${profile_id}, ${active_web_access}, ${active_app_movil_access}, '${personal_phone}', '${work_phone}'`)
      
      const message = queryNewUserData[0]
  
      if(message[0].message !== 'successfull') return res.status(500).json(
          ['something went wrong']
        )   
  
      return res.status(200).json(
        ['user_id ' + message[0].user_id]
        
      )
    

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
    
  //res.send('register')
}

export const login = async (req, res) => {
  const {username, password} = req.body
    
  const place_id = 0 
  const sequelize = getDatabaseInstance(place_id)   

  try {   

      const [userFound, metadata] = await sequelize.query(`execute sp_access '${username}'`)
    
    if(!userFound[0]) return res.status(400).json({
      message: "User not found"
    })

    const isMatch = await bcrypt.compare(password, userFound[0].password_hash)

    if(!isMatch) return res.status(400).json({
        message: "Incorrect password"
    })

    const token = await createAccessToken({
      user_id: userFound[0].user_id,
      name: userFound[0].name,
      birthdate: userFound[0].birthdate,
      sex: userFound[0].sex,
      photo: userFound[0].phone,
      personal_phone: userFound[0].personal_phone,
      work_phone: userFound[0].work_phone,
      username: userFound[0].username,
      profile_id: userFound[0].profile_id,
      profile: userFound[0].profile,
      active: userFound[0].active
    })

    res.cookie('token', token)

    res.json({
      user_id: userFound[0].user_id,
      name: userFound[0].name,
      birthdate: userFound[0].birthdate,
      sex: userFound[0].sex,
      photo: userFound[0].phone,
      personal_phone: userFound[0].personal_phone,
      work_phone: userFound[0].work_phone,
      username: userFound[0].username,
      profile_id: userFound[0].profile_id,
      profile: userFound[0].profile,
      active: userFound[0].active
    })

    

  } catch (error) {
    res.status(500).json({
        message: error.message
    })
  }  
}

export const logout = (req, res) => {
  res.cookie('token',"",{
      expires: new Date(0)
  })
  return res.sendStatus(200)
}

export const profile = async (req, res) => {

  const place_id = 0 
  const sequelize = getDatabaseInstance(place_id)

  const [userFound, metadata] = await sequelize.query(`execute sp_access '${req.user.username}'`)
    
  if(!userFound[0]) return res.status(400).json({
    message: "User not found"
  })

  return res.json({
    user_id: userFound[0].user_id,
    name: userFound[0].name,
    birthdate: userFound[0].birthdate,
    sex: userFound[0].sex,
    photo: userFound[0].phone,
    personal_phone: userFound[0].personal_phone,
    work_phone: userFound[0].work_phone,
    username: userFound[0].username,
    profile_id: userFound[0].profile_id,
    profile: userFound[0].profile,
    active: userFound[0].active
  })
  //res.send('profile')
}

export const verifyToken = async (req, res) => {
  const {token} = req.cookies
  if(!token) return res.status(401).json({message: 'Unauthorized'})

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
      if(err) return res.status(401).json({message: 'Unauthorized'})

      const place_id = 0 
      const sequelize = getDatabaseInstance(place_id)
      
      const [userFound, metadata] = await sequelize.query(`execute sp_access '${user.username}'`)

      if(!userFound[0]) return res.status(401).json({
          message: 'Unauthorized'
      })

      res.json({
        user_id: userFound[0].user_id,
        name: userFound[0].name,
        birthdate: userFound[0].birthdate,
        sex: userFound[0].sex,
        photo: userFound[0].phone,
        personal_phone: userFound[0].personal_phone,
        work_phone: userFound[0].work_phone,
        username: userFound[0].username,
        profile_id: userFound[0].profile_id,
        profile: userFound[0].profile,
        active: userFound[0].active
      })
  })
}
