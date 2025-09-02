const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const axios = require('axios');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;

// ⭐ REMPLACEZ CETTE LIGNE AVEC VOTRE LIEN RENDER PLUS TARD ⭐
const RENDER_URL = process.env.RENDER_URL || "https://votre-lien-render.onrender.com";

// Configuration webhook
app.use(bot.webhookCallback('/telegram'));

// Message de bienvenue
bot.start((ctx) => {
    ctx.replyWithMarkdown(`
🎉 *BIENVENUE SUR PATERSON-MD* 🤖

✨ *Commandes disponibles:*
/pair [numero] - Générer un code WhatsApp
/status - Vérifier le statut
/support - Support technique

💡 *Exemple:* \`/pair 50942737567\`
    `);
});

// Commande pair
bot.command('pair', async (ctx) => {
    const number = ctx.message.text.split(' ')[1];
    
    if (!number) {
        return ctx.reply('❌ Usage: /pair 50942737567');
    }

    try {
        const message = await ctx.reply('🔄 Connexion à WhatsApp en cours...');
        
        const response = await axios.get(`https://votre-paterson-render.onrender.com/pair?number=${number}`);
        
        if (response.data.success) {
            ctx.replyWithMarkdown(`
✅ *CODE GÉNÉRÉ AVEC SUCCÈS!*

🔢 *Code:* \`${response.data.code}\`
⏰ *Expire dans:* 2 minutes

📋 *Instructions:*
1. Ouvrez WhatsApp → Paramètres
2. → Appareils liés
3. Entrez le code ci-dessus
            `);
        } else {
            ctx.reply(`❌ Erreur: ${response.data.message}`);
        }
        
        await ctx.deleteMessage(message.message_id);
    } catch (error) {
        ctx.reply('❌ Erreur de connexion au serveur');
    }
});

// Démarrer le serveur
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    
    // Configurer le webhook
    try {
        await bot.telegram.setWebhook(`${RENDER_URL}/telegram`);
        console.log('✅ Webhook configured successfully');
    } catch (error) {
        console.log('⚠️  Using polling mode');
        bot.launch();
    }
});

// Gestion des erreurs
bot.catch((err) => {
    console.error('Bot error:', err);
});
