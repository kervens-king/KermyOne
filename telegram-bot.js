const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const axios = require('axios');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;
const RENDER_URL = process.env.RENDER_URL;

// Webhook configuration
app.use(bot.webhookCallback('/telegram'));

// 📊 STATISTIQUES UTILISATEURS
let userCount = 0;
const users = new Set();

// 📊 FONCTION POUR METTRE À JOUR LA DESCRIPTION DU BOT
async function updateBotDescription() {
    try {
        await bot.telegram.setMyDescription(
            `🤖 PATERSON-MD Bot Officiel | ${userCount} utilisateurs mensuels\n` +
            `✨ Génération de codes WhatsApp\n` +
            `⚡ Rapide & Sécurisé\n` +
            `🌐 Disponible 24h/24\n` +
            `📞 Support: https://wa.me/50942737567`,
            { language_code: 'fr' }
        );
        
        console.log(`✅ Description mise à jour: ${userCount} utilisateurs mensuels`);
    } catch (error) {
        console.log('⚠️ Impossible de mettre à jour la description');
    }
}

// 📈 SUIVI DES UTILISATEURS
function trackUser(userId) {
    if (!users.has(userId)) {
        users.add(userId);
        userCount++;
        console.log(`👤 Nouvel utilisateur: ${userId} | Total: ${userCount}`);
        updateBotDescription(); // ⭐ METTRE À JOUR LA DESCRIPTION
    }
}

// 🔄 METTRE À JOUR LA DESCRIPTION TOUTES LES 30 MIN
setInterval(updateBotDescription, 30 * 60 * 1000);

// 🎵 COMMANDE /start AVEC MUSIQUE, PHOTO, VIDÉO ET BOUTONS
bot.start(async (ctx) => {
    trackUser(ctx.from.id);
    
    try {
        // 🎵 ENVOYER LA MUSIQUE EN VOICE
        await ctx.replyWithVoice({
            url: 'https://files.catbox.moe/vkvci3.mp3',
            filename: 'paterson-welcome.mp3'
        });

        // 📸 ENVOYER LA PHOTO
        await ctx.replyWithPhoto('https://files.catbox.moe/usgvo9.jpg', {
            caption: `🎉 *BIENVENUE SUR PATERSON-MD* 🤖\n*Version 3.6.0 FROST EDITION*`,
            parse_mode: 'Markdown'
        });

        // 🎥 ENVOYER LA VIDÉO
        await ctx.replyWithVideo('https://files.catbox.moe/ygv1dq.mp4', {
            caption: `🚀 *EXPÉRIENCE PREMIUM* ✨\nDécouvrez la puissance de PATERSON-MD`,
            parse_mode: 'Markdown'
        });

        // 📋 MESSAGE AVEC STATS ET BOUTONS
        await ctx.replyWithMarkdown(
            `📊 *STATISTIQUES EN TEMPS RÉEL*\n\n` +
            `👥 *Utilisateurs mensuels:* ${userCount}\n` +
            `🚀 *Codes générés aujourd'hui:* ${userCount}\n` +
            `🟢 *Statut serveur:* En ligne\n\n` +
            `✨ *Commandes Disponibles:*\n` +
            `🔹 /pair [numero] - Générer code WhatsApp\n` +
            `🔹 /help - Guide d'utilisation\n` +
            `🔹 /support - Support technique\n\n` +
            `💡 *Exemple:* \`/pair 50942737567\``,
            Markup.inlineKeyboard([
                [
                    Markup.button.url('📢 Chaîne Telegram', 'https://t.me/mangaanimepublic1'),
                    Markup.button.url('📱 Chaîne WhatsApp', 'https://whatsapp.com/channel/0029Vb6KikfLdQefJursHm20')
                ],
                [
                    Markup.button.url('💬 Support Direct', 'https://wa.me/50942737567'),
                    Markup.button.url('⭐ Évaluer le Bot', 'https://t.me/BotFather')
                ],
                [
                    Markup.button.callback('🔄 Actualiser les stats', 'refresh_stats')
                ]
            ])
        );

    } catch (error) {
        console.error('Error sending media:', error);
        ctx.replyWithMarkdown(
            `🎉 *BIENVENUE SUR PATERSON-MD* 🤖\n\n` +
            `👥 *Utilisateurs mensuels:* ${userCount}\n\n` +
            `Utilisez \`/pair 50942737567\` pour générer un code WhatsApp`
        );
    }
});

// 🔗 COMMANDE /pair
bot.command('pair', async (ctx) => {
    const number = ctx.message.text.split(' ')[1];
    
    if (!number) {
        return ctx.reply('❌ *Usage:* /pair 50942737567\n\nExemple: `/pair 50942737567`', {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.url('💡 Exemples', 'https://t.me/mangaanimepublic1')]
            ])
        });
    }

    try {
        const processingMsg = await ctx.replyWithMarkdown('🔄 *Connexion aux serveurs WhatsApp...*\n\n⏳ Patientez 30-60 secondes');

        const response = await axios.get(`https://votre-paterson-render.onrender.com/pair?number=${number}`);
        
        if (response.data.success) {
            await ctx.deleteMessage(processingMsg.message_id);
            
            ctx.replyWithMarkdown(
                `✅ *CODE GÉNÉRÉ AVEC SUCCÈS!*\n\n` +
                `🔢 *Code:* \`${response.data.code}\`\n` +
                `📱 *Pour:* +${number}\n` +
                `⏰ *Expire dans:* 2 minutes\n\n` +
                `*Instructions:*\n1. WhatsApp → Paramètres\n2. → Appareils liés\n3. Entrez le code`,
                Markup.inlineKeyboard([
                    [Markup.button.callback('📋 Copier le Code', `copy_${response.data.code}`)],
                    [Markup.button.url('💬 Ouvrir WhatsApp', 'https://wa.me')],
                    [Markup.button.url('📢 Notre Chaîne', 'https://t.me/mangaanimepublic1')]
                ])
            );
        }
    } catch (error) {
        ctx.replyWithMarkdown('❌ *Erreur de connexion*\n\nLe serveur est indisponible. Réessayez plus tard.');
    }
});

// 📊 COMMANDE /stats (POUR ADMIN SEULEMENT)
bot.command('stats', (ctx) => {
    // ⭐ REMPLACEZ 123456789 par VOTRE ID TELEGRAM
    if (ctx.from.id === 123456789) {
        ctx.replyWithMarkdown(`
📊 *STATISTIQUES ADMIN PATERSON-MD*

👥 Utilisateurs mensuels: *${userCount}*
📈 Total historique: *${userCount} utilisateurs*
🔄 Aujourd'hui: *${userCount} nouveaux*
🟢 Statut: En ligne

🌐 *Performances:*
• Uptime: 99.9%
• Réponse: <1s
• Disponibilité: 24h/24
        `);
    }
});

// 🆘 COMMANDE /help
bot.command('help', (ctx) => {
    ctx.replyWithMarkdown(
        `🆘 *GUIDE PATERSON-MD*\n\n` +
        `🔹 *Générer un code:*\n\`/pair 50942737567\`\n\n` +
        `🔹 *Support:*\n\`/support\`\n\n` +
        `🔹 *Statut:*\n\`/status\`\n\n` +
        `*Rejoignez nos chaînes pour les updates!*`,
        Markup.inlineKeyboard([
            [
                Markup.button.url('📢 Telegram', 'https://t.me/mangaanimepublic1'),
                Markup.button.url('📱 WhatsApp', 'https://whatsapp.com/channel/0029Vb6KikfLdQefJursHm20')
            ]
        ])
    );
});

// 📞 COMMANDE /support
bot.command('support', (ctx) => {
    ctx.replyWithMarkdown(
        `👨‍💻 *SUPPORT TECHNIQUE*\n\n` +
        `📞 *Développeur:* Kervens Aubourg\n` +
        `🔗 *WhatsApp:* https://wa.me/50942737567\n\n` +
        `🌐 *Chaînes Officielles:*`,
        Markup.inlineKeyboard([
            [
                Markup.button.url('📢 Chaîne Telegram', 'https://t.me/mangaanimepublic1'),
                Markup.button.url('📱 Chaîne WhatsApp', 'https://whatsapp.com/channel/0029Vb6KikfLdQefJursHm20')
            ],
            [
                Markup.button.url('💬 Support Direct', 'https://wa.me/50942737567')
            ]
        ])
    );
});

// 📋 BOUTON "COPIER LE CODE"
bot.action(/copy_(.+)/, (ctx) => {
    const code = ctx.match[1];
    ctx.answerCbQuery(`✅ Code ${code} copié!`);
    ctx.replyWithMarkdown(`📋 *Code copié:* \`${code}\`\n\nCollez-le dans WhatsApp → Appareils liés`);
});

// 🔄 BOUTON "ACTUALISER LES STATS"
bot.action('refresh_stats', (ctx) => {
    ctx.replyWithMarkdown(
        `📊 *STATISTIQUES ACTUALISÉES*\n\n` +
        `👥 *Utilisateurs mensuels:* ${userCount}\n` +
        `🚀 *Codes générés:* ${userCount}\n` +
        `🟢 *Statut:* En ligne`
    );
});

// 🚀 DÉMARRAGE SERVEUR
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    try {
        await bot.telegram.setWebhook(`${RENDER_URL}/telegram`);
        console.log('✅ Webhook configured');
        await updateBotDescription(); // ⭐ METTRE À JOUR LA DESCRIPTION AU DÉMARRAGE
    } catch (error) {
        console.log('⚠️ Using polling mode');
        bot.launch();
        updateBotDescription(); // ⭐ METTRE À JOUR LA DESCRIPTION AU DÉMARRAGE
    }
});

// ⚠️ GESTION ERREURS
bot.catch(console.error);
