import axios from "axios";

export const sendWhatsAppTemplateMessage = async (
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
      const arrayRoles = [
        "Administrador",
        "Directivo",
        "Gerente",
        "Coordinador",
        "Gestor",
        "Auxiliar Administrativo",
        "Sistemas",
        "Recursos Humanos",
      ];
      const rol = arrayRoles[rol_parameters - 1];
      const apiUrl = "https://graph.facebook.com/v18.0/120123567854245/messages";
      const accessToken =
        "EAAMURZC9yzb8BOwX8yRt2i3RYgh2dqYfUNloE0ZBlfk7cm36C2eXQF8ZBGTCihy43SzznGKfj6oi9axPJaZC1FWNrrc6jCgCRreeTSO729Ss0VXLyTwpy7ZC41b18IHiw1L5gsoUJx7zqkBdoRZAkpxVkLG9fU7yvXUXrFnndSVrGy7bWOYutfTCU9q7VHBtSp9rePugp06d1nyCszuvAU"; // Reemplaza con tu token de acceso
  
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


  function hiddenPhoneNumber(phone) {
    const arrayCaracters = [...phone];
    // Utilizamos map para modificar el array y devolver el nuevo array
    const x = arrayCaracters.map((caracter, index) => {
      if (index < 8) {
        return "*"; // Devolvemos "*" en lugar de modificar directamente arrayCaracters
      } else {
        return caracter; // Devolvemos el carácter sin cambios para los primeros 8 dígitos
      }
    });
    
    return x.join("");
  }