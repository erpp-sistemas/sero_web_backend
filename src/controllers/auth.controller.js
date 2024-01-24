import { createAccessToken } from "../libs/jwt.js";
//import {Access} from '../models/access.model.js'
//import sequelize from "../config/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { getDatabaseInstance } from "../config/dbManager.config.js";
import { DataTypes } from "sequelize";
import Sequelize from "sequelize";
import axios from "axios";
import { getRolById } from "./rol.controller.js";
import { sendEmail } from "../services/emailService.js";
import { sendWhatsAppTemplateMessage } from "../services/whatsAppService.js";

export const register = async (req, res) => {
  console.log(req.body);
  const {
    name,
    first_last_name,
    second_last_name,
    birthdate,
    sex_id,
    user_name,
    password,
    password_hash,
    profile_id,
    active_web_access,
    active_app_movil_access,
    personal_phone,
    work_phone,
    url_image,
    active_credentials_by_whats_app,
    active_credentials_by_email,
  } = req.body;

  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  try {
    // Importa el modelo 'Access' específico para la base de datos seleccionada
    const Access = sequelize.define(
      "acceso",
      {
        usuario: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
      },
      {
        timestamps: false,
        freezeTableName: true,
      }
    );

    const userFound = await Access.findOne({
      where: { usuario: user_name },
    });

    if (userFound) return res.status(400).json(["The email is already in use"]);

    const passwordHash = await bcrypt.hash(password, 10);

    const queryNewUserData = await sequelize.query(
      `execute sp_new_user_data '${name}', '${first_last_name}', '${second_last_name}', '${birthdate}', ${sex_id}, '${user_name}', '${password}', '${passwordHash}', ${profile_id}, ${active_web_access}, ${active_app_movil_access}, '${personal_phone}', '${work_phone}' , '${url_image}'`
    );

    const message = queryNewUserData[0];

    if (message[0].message !== "successfull")
      return res.status(500).json(["something went wrong"]);

    // Envío del mensaje con la plantilla
    const user_parameter = user_name;
    const name_parameter = ` ${name} ${first_last_name} ${second_last_name}`;
    const birthdate_parameter = birthdate;
    const email_parameter = user_name;
    const number_parameter = work_phone;
    const password_parameter = password;
    const rol_parameters = profile_id;
    const recipientWhatsAppID = quitarSimboloPlus(number_parameter); // Reemplaza con el ID de WhatsApp del destinatario
    const templateName = "create_user_sero_web";
    const telephone = quitarSimboloPlus(number_parameter)
    // Reemplaza con el nombre de tu plantilla
    if (active_credentials_by_email) {
      await sendEmail(
        ["arturo.chavez@erpp.mx", "carlos.martinez@erpp.mx"],
        user_parameter,
        password_parameter,
        rol_parameters,
        name_parameter,
        birthdate_parameter,
        email_parameter,
        telephone
      );
    }
    
    if (active_credentials_by_whats_app) {
      await sendWhatsAppTemplateMessage(
        recipientWhatsAppID,
        user_parameter,
        password_parameter,
        rol_parameters,
        templateName,
        name_parameter,
        birthdate_parameter,
        email_parameter,
        number_parameter
      );
    }
    
    // If both conditions are true, execute both sets of logic
    if (active_credentials_by_whats_app && active_credentials_by_email) {
      await sendWhatsAppTemplateMessage(
        recipientWhatsAppID,
        user_parameter,
        password_parameter,
        rol_parameters,
        templateName,
        name_parameter,
        birthdate_parameter,
        email_parameter,
        number_parameter
      );
    
      await sendEmail(
        ["arturo.chavez@erpp.mx", "carlos.martinez@erpp.mx"],
        user_parameter,
        password_parameter,
        rol_parameters,
        name_parameter,
        birthdate_parameter,
        email_parameter,
        telephone
      );
    }

    return res.status(200).json(["user_id " + message[0].user_id]);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
    console.error("Error:", error);
  }

  //res.send('register')
};

function quitarSimboloPlus(numeroTelefono) {
  // Verifica si el número comienza con el símbolo "+"
  if (numeroTelefono.startsWith("+")) {
    // Quita el símbolo "+" y devuelve el número sin él
    return numeroTelefono.slice(1);
  }
  // Si el número no comienza con "+", devuélvelo sin cambios
  return numeroTelefono;
}




export const login = async (req, res) => {
  const { username, password } = req.body;

  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  try {
    const [userFound, metadata] = await sequelize.query(
      `execute sp_access '${username}'`
    );

    if (!userFound[0])
      return res.status(400).json({
        message: "User not found",
      });

    const isMatch = await bcrypt.compare(password, userFound[0].password_hash);

    if (!isMatch)
      return res.status(400).json({
        message: "Incorrect password",
      });

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
      active: userFound[0].active,
    });

    res.cookie("token", token);

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
      active: userFound[0].active,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  const [userFound, metadata] = await sequelize.query(
    `execute sp_access '${req.user.username}'`
  );

  if (!userFound[0])
    return res.status(400).json({
      message: "User not found",
    });

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
    active: userFound[0].active,
  });
  //res.send('profile')
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    const [userFound, metadata] = await sequelize.query(
      `execute sp_access '${user.username}'`
    );

    if (!userFound[0])
      return res.status(401).json({
        message: "Unauthorized",
      });

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
      active: userFound[0].active,
    });
  });
};
