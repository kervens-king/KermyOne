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
