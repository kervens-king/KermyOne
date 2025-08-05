{
  "name": "your Botname",
  "description": "ᴊᴀᴠᴀsᴄʀɪᴘᴛ ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛ ᴄʀᴇᴀᴛᴇᴅ ʙʏ your name ",
  "logo": "your image url",
  "keywords": ["bot"],
  "success_url": "/",

    "stack": "container",
  "env": {
    "SESSION_ID": {
      "description": "Put the session-id here.",
      "required": true,
      "value": ""
    },  
    
    "ALIVE_IMG": {
      "description": "paste your image url if you don't have you can use this public url.",
      "required": true,
      "value": "your image url"
    }, 
    
    "ALIVE_MSG": {
      "description": "paste your alive message hear.",
      "required": true,
      "value": "HI DEAR IM ONLINE.!!♻️"
    },
    
    "PREFIX": {
      "description": "paste your bot prefix note! Don't apply null prefix.",
      "required": true,
      "value": "."
    },
    
    "MODE": {
      "description": "select your bot work type public-private-inbox-group.",
      "required": true,
      "value": "public"
    }, 

    "AUTO_VOICE": {
      "description": "Make it true if you want bot auto voice.",
      "required": true,
      "value": "true"
    }, 

    "AUTO_REPLY": {
      "description": "Make it true if you want bot auto reply.",
      "required": true,
      "value": "true"
    }, 

    "AUTO_STICKER": {
      "description": "Make it true if you want bot auto sticker.",
      "required": true,
      "value": "false"
    }, 

    "AUTO_READ_STATUS": {
      "description": "Make it true if you want bot auto auto_read_status.",
      "required": true,
      "value": "true"
    }, 

    "ANTI_LINK": {
      "description": "Make it true if you want bot auto remove group link.",
      "required": true,
      "value": "true"
    },

    "ANTI_BAD": {
      "description": "Make it true if you want bot auto delete bad words from group example xxx porn etc.",
      "required": true,
      "value": "false"
    }, 

    "FAKE_RECORDING": {
      "description": "Make it true if you want bot fake record.",
      "required": true,
      "value": "true"
    },

    "AUTO_REACT": {
      "description": "Make it true if you want bot AutoReact.",
      "required": false,
      "value": "false"
    },

{
  "name": "PATERSON-MD",
  "description": "🤖 WhatsApp Bot créé par KERVENS AUBOURG",
  "logo": "https://i.ibb.co/pXL9RYv/temp-image.jpg",
  "keywords": ["whatsapp", "bot", "baileys", "PATERSON-MD"],
  "success_url": "/",
  "stack": "container",
  "env": {
    "SESSION_ID": {
      "description": "ID de session pour le bot (laissez vide pour générer un nouveau QR)",
      "required": false,
      "value": ""
    },
    "PREFIX": {
      "description": "Préfixe des commandes du bot (ex: . )",
      "required": true,
      "value": "."
    },
    "MODE": {
      "description": "Mode du bot (public/private)",
      "required": true,
      "value": "public"
    },
    "ALIVE_MSG": {
      "description": "Message de présence du bot",
      "required": true,
      "value": "🌟 PATERSON-MD est en ligne !"
    },
    "ALIVE_IMG": {
      "description": "URL de l'image pour la présence",
      "required": true,
      "value": "https://i.ibb.co/pXL9RYv/temp-image.jpg"
    },
    "AUTO_READ_STATUS": {
      "description": "Marquer les messages comme lus automatiquement (true/false)",
      "required": true,
      "value": "true"
    },
    "AUTO_REPLY": {
      "description": "Répondre automatiquement aux messages non-commandes (true/false)",
      "required": true,
      "value": "false"
    },
    "AUTO_STICKER": {
      "description": "Convertir les images en stickers automatiquement (true/false)",
      "required": true,
      "value": "false"
    },
    "ANTI_LINK": {
      "description": "Supprimer les liens dans les groupes (true/false)",
      "required": true,
      "value": "true"
    },
    "ANTI_BAD": {
      "description": "Supprimer les gros mots (true/false)",
      "required": true,
      "value": "false"
    },
    "BOT_NAME": {
      "description": "Nom du bot",
      "required": true,
      "value": "✦『PATERSON-MD』✦"
    },
    "OWNER_NUMBER": {
      "description": "Numéro du propriétaire (avec l'indicatif, ex: 1234567890@s.whatsapp.net)",
      "required": true,
      "value": "1234567890@s.whatsapp.net"
    },
    "MEGA_EMAIL": {
      "description": "Email du compte MEGA pour le stockage",
      "required": false,
      "value": ""
    },
    "MEGA_PASSWORD": {
      "description": "Mot de passe du compte MEGA",
      "required": false,
      "value": ""
    }
  },
  "buildpacks": [
    {
      "url": "heroku/nodejs"
    }
  ],
  "stack": "heroku-24"
        }
