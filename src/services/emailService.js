import { google } from "googleapis";
import nodemailer from "nodemailer";
import path from "path";

/*POPULATE BELOW FIELDS WITH YOUR CREDETIALS*/

const CLIENT_ID =
  "20592726281-i3h7gdksp13gquom3cmpb2t3ppclgdkp.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REFRESH_TOKEN =
  "1//04A_jdQUWj05bCgYIARAAGAQSNwF-L9IrYS7Cw1JKkzJ2we9uJYXzwxaMIZkM_dJwvJZ6GnohroCK1-oilb_PGXvEOrEc5TcYBH8";
const REDIRECT_URI = "https://developers.google.com/oauthplayground"; //DONT EDIT THIS
const MY_EMAIL = "rratel76@gmail.com";

/*POPULATE ABOVE FIELDS WITH YOUR CREDETIALS*/

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

//YOU CAN PASS MORE ARGUMENTS TO THIS FUNCTION LIKE CC, TEMPLATES, ATTACHMENTS ETC. IM JUST KEEPING IT SIMPLE
export const sendEmail = async (to,user,password,rol,name,birthdate,email,phone) => {
  const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: MY_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

 /*  const __dirname = path.resolve();
  // Update the path to the image dynamically
  const logoPath = path.join(__dirname, "images", "ser.jpg");
  console.log(logoPath);
  const attachments = [
    {
      filename: "ser.jpg",
      path: logoPath,
      cid: "unique@nodemailer.com", // use same cid value in the HTML img src attribute
    },
  ]; */

  //EMAIL OPTIONS
  const from = MY_EMAIL;
  const subject = "¡Registro exitoso en  SER0!";
  const html = `<!DOCTYPE html>
  <html lang="es">
  
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Registro Exitoso</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #1F2D40;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding:200px;
      }
  
      .container {
        width: 80%;
        max-width: 600px;
        padding: 20px;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      }
  
      .header {
        background-color: #1F2D40;
        color: #fff;
        text-align: center;
        padding: 20px;
        border-radius: 10px 10px 0 0;
      }
  
      h2 {
        color: #00FF00;
        margin-bottom: 10px;
      }
  
      p {
        line-height: 1.6;
        margin-bottom: 15px;
      }
  
      .footer {
        margin-top: 20px;
        text-align: center;
        color: #777;
      }

      hr {
        border: 0;
        height: 0.5px;
        background: white;
        margin: 30px 0;
      }
    </style>
  </head>
  
  <body>
    <div class="container">
      <div class="header">
        <h2>¡Registro Exitoso! 🎉</h2>
      </div>
      <p>Estamos emocionados de tenerte como parte de nuestra comunidad. Tu cuenta ha sido creada con éxito. Aquí están los detalles clave:</p>
      <ul>
        <li><strong>Usuario:</strong> ${user} 👤</li>
        <li><strong>Contraseña:</strong> ${password} 🔐</li>
        <li><strong>Rol:</strong> ${rol} 🌐</li>
      </ul>
      <hr>
      <p>Detalles adicionales:</p>
      <ul>
        <li><strong>Nombre Completo:</strong> ${name} 💼</li>
        <li><strong>Fecha de Nacimiento:</strong> ${birthdate} 🎂</li>
        <li><strong>Correo Electrónico:</strong> ${email} 📧</li>
        <li><strong>Número de Teléfono:</strong> ${phone} ☎️</li>
      </ul>
      <hr>
      <p>Además, tu rol en SER0 WEB te brinda acceso a:</p>
      <ul>
        <li>[Funcionalidad1] 🚀</li>
        <li>[Funcionalidad2] 🌐</li>
        <li>[Funcionalidad3] 🛠️</li>
      </ul>
      <hr>
      <p>Guarde estos detalles de forma segura. Si tienes preguntas, nuestro equipo de soporte está aquí para ayudarte. 🤝</p>
      <p>¡Esperamos que disfrutes explorando todas las características que SER0 WEB tiene para ofrecer! 🚀</p>
      <div class="footer">
        <p>No responda a este correo electrónico. Este es un mensaje automático. 🤖</p>
      </div>
    </div>
  </body>
  
  </html>
  
  `;


  try {
    const info = await transport.sendMail({ from, subject, to, html });
    console.log("Correo electrónico enviado con éxito:", info);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    throw error;
  }
};