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

export const register = async (req, res) => {
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
    const name_parameter = ` ${name} ${first_last_name} ${second_last_name}`
    const birthdate_parameter = birthdate
    const email_parameter =user_name
    const number_parameter = work_phone
    const password_parameter = password;
    const rol_parameters = profile_id;
    
    const recipientWhatsAppID = quitarSimboloPlus(work_phone); // Reemplaza con el ID de WhatsApp del destinatario
    const templateName = "create_user_sero_web"; // Reemplaza con el nombre de tu plantilla
    await sendEmail(["arturo.chavez@erpp.mx","carlos.martinez@erpp.mx"],user_parameter,password_parameter,rol_parameters,name_parameter,birthdate_parameter,email_parameter,number_parameter)
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


function hiddenPhoneNumber(phone){
  const arrayCaracters = [...phone]
  // Utilizamos map para modificar el array y devolver el nuevo array
  const x = arrayCaracters.map((caracter, index) => {
    if (index <8) {
      return "*";  // Devolvemos "*" en lugar de modificar directamente arrayCaracters
    } else {
      return caracter;  // Devolvemos el carácter sin cambios para los primeros 8 dígitos
    }
  });

  return x.join(''); 
}

const sendWhatsAppTemplateMessage = async (
  recipientWhatsAppID,
  user_parameter,
  password_parameter,
  rol_parameters,
  templateName,
  name_parameter,
  birthdate_parameter,
  email_parameter,
  number_parameter

) => {
  try {

    const arrayRoles = ["Administrador","Directivo","Gerente","Coordinador","Gestor","Auxiliar Administrativo","Sistemas","Recursos Humanos"]
    const rol = arrayRoles[rol_parameters-1]
    const apiUrl = "https://graph.facebook.com/v18.0/120123567854245/messages";
    const accessToken =
      "EAAMURZC9yzb8BO6133OOZChf15xQ7iV9lyJ5o91iKdw4bjZCqZAq8qiBCq0ZAp4hJwkm3TkfM6SINxYTpztWJIVeyztPBtEp2R463dCHvIsSicWxFZA1FzQCFXbU5jSuQEQ9rLFsfIvJWDUj7Mdh2OjbOUMiIF3SFXxYkQguCPRhXApydJUnkZB7P1eOaesGZBHCqNZAPF6Ic772lL4fREOsZD"; // Reemplaza con tu token de acceso

    const requestBody = {
      messaging_product: "whatsapp",
      to: recipientWhatsAppID,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: "es_MX",
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: `${user_parameter}`,
              },
              {
                type: "text",
                text: `${password_parameter}`,
              },
              {
                type: "text",
                text: `${rol}`,
              },
              {
                type: "text",
                text: `${name_parameter}`,
              },
              {
                type: "text",
                text: `${birthdate_parameter}`,
              },
              {
                type: "text",
                text: `${email_parameter}`,
              },
              {
                type: "text",
                text: `${hiddenPhoneNumber(number_parameter)}`,
              },
      
            ],
          },
        ],
      },
    };

    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Maneja la respuesta según tus necesidades
    console.log("WhatsApp API response:", response.data);
  } catch (error) {
    // Maneja los errores de la solicitud
    console.error("Error sending WhatsApp template message:", error.message);
  }
};

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
