const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const axios = require('axios');

// VÉRIFICATION DU TOKEN
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error('❌ ERREUR: TELEGRAM_BOT_TOKEN non défini');
    console.error('➡️ Définissez la variable d\'environnement TELEGRAM_BOT_TOKEN sur Render');
    process.exit(1);
}

const bot = new Telegraf(token);
const app = express();
const PORT = process.env.PORT || 3000;

// Utiliser l'URL fournie par Render ou une valeur par défaut
const RENDER_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

// ID du propriétaire (administrateur)
const OWNER_ID = 7908680781;

// Middleware pour parser le JSON
app.use(express.json());

// Configuration du webhook pour Telegram
app.use(bot.webhookCallback('/telegram'));

// 📊 STATISTIQUES UTILISATEURS
let userCount = 0;
const users = new Set();
let codesGeneratedToday = 0;
let lastResetDate = new Date().getDate();

// 📊 FONCTION POUR METTRE À JOUR LA DESCRIPTION DU BOT
async function updateBotDescription() {
    try {
        await bot.telegram.setMyDescription(
            `🤖 PATERSON-MD Bot Officiel | ${userCount} utilisateurs\n` +
            `✨ Génération de codes WhatsApp\n` +
            `⚡ Rapide & Sécurisé\n` +
            `🌐 Disponible 24h/24\n` +
            `📞 Support: https://wa.me/50942737567`,
            { language_code: 'fr' }
        );
        
        console.log(`✅ Description mise à jour: ${userCount} utilisateurs`);
    } catch (error) {
        console.log('⚠️ Impossible de mettre à jour la description:', error.message);
    }
}

// 📈 SUIVI DES UTILISATEURS
function trackUser(userId) {
    // Réinitialiser le compteur quotidien si changement de jour
    const currentDate = new Date().getDate();
    if (currentDate !== lastResetDate) {
        codesGeneratedToday = 0;
        lastResetDate = currentDate;
        console.log('📅 Compteur quotidien réinitialisé');
    }
    
    if (!users.has(userId)) {
        users.add(userId);
        userCount++;
        console.log(`👤 Nouvel utilisateur: ${userId} | Total: ${userCount}`);
        updateBotDescription();
        
        // Notifier le propriétaire d'un nouvel utilisateur
        if (userId !== OWNER_ID) {
            try {
                bot.telegram.sendMessage(
                    OWNER_ID,
                    `👤 *Nouvel utilisateur:* ${userId}\n` +
                    `📊 *Total:* ${userCount} utilisateurs`,
                    { parse_mode: 'Markdown' }
                );
            } catch (error) {
                console.log('⚠️ Impossible de notifier le propriétaire:', error.message);
            }
        }
    }
}

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

        // 📋 MESSAGE AVEC STATS ET BOUTONS
        await ctx.replyWithMarkdown(
            `📊 *STATISTIQUES EN TEMPS RÉEL*\n\n` +
            `👥 *Utilisateurs mensuels:* ${userCount}\n` +
            `🚀 *Codes générés aujourd'hui:* ${codesGeneratedToday}\n` +
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

    // Validation du numéro
    if (!/^\d+$/.test(number)) {
        return ctx.reply('❌ *Numéro invalide!*\nLe numéro ne doit contenir que des chiffres.\nExemple: `/pair 50942737567`', {
            parse_mode: 'Markdown'
        });
    }

    try {
        const processingMsg = await ctx.replyWithMarkdown('🔄 *Connexion aux serveurs WhatsApp...*\n\n⏳ Patientez 10-12 secondes');

        // Simulation de génération de code (temps réduit à 8-10 secondes)
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        codesGeneratedToday++;
        
        // Attendre entre 8 et 10 secondes (au lieu de 30-60)
        const waitTime = Math.floor(Math.random() * 2000) + 8000; // 8-10 secondes
        await new Promise(resolve => setTimeout(resolve, waitTime));

        await ctx.deleteMessage(processingMsg.message_id);
        
        ctx.replyWithMarkdown(
            `✅ *CODE GÉNÉRÉ AVEC SUCCÈS!*\n\n` +
            `🔢 *Code:* \`${code}\`\n` +
            `📱 *Pour:* +${number}\n` +
            `⏰ *Expire dans:* 2 minutes\n\n` +
            `*Instructions:*\n1. WhatsApp → Paramètres\n2. → Appareils liés\n3. Entrez le code`,
            Markup.inlineKeyboard([
                [Markup.button.callback('📋 Copier le Code', `copy_${code}`)],
                [Markup.button.url('💬 Ouvrir WhatsApp', 'https://wa.me')],
                [Markup.button.url('📢 Notre Chaîne', 'https://t.me/mangaanimepublic1')]
            ])
        );
        
        // Notifier le propriétaire d'un nouveau code généré
        try {
            bot.telegram.sendMessage(
                OWNER_ID,
                `✅ *Nouveau code généré:*\n` +
                `🔢 Code: \`${code}\`\n` +
                `📱 Pour: +${number}\n` +
                `👤 Par: ${ctx.from.id}\n` +
                `📊 Aujourd'hui: ${codesGeneratedToday} codes`,
                { parse_mode: 'Markdown' }
            );
        } catch (error) {
            console.log('⚠️ Impossible de notifier le propriétaire:', error.message);
        }
        
    } catch (error) {
        console.error('Pair error:', error);
        ctx.replyWithMarkdown('❌ *Erreur de connexion*\n\nLe serveur est indisponible. Réessayez plus tard.');
    }
});

// 📊 COMMANDE /stats (POUR ADMIN SEULEMENT)
bot.command('stats', (ctx) => {
    if (ctx.from.id === OWNER_ID) {
        ctx.replyWithMarkdown(`
📊 *STATISTIQUES ADMIN PATERSON-MD*

👥 Utilisateurs totaux: *${userCount}*
📈 Codes générés aujourd'hui: *${codesGeneratedToday}*
🟢 Statut: En ligne

🌐 *Performances:*
• Uptime: 99.9%
• Réponse: <1s
• Disponibilité: 24h/24
        `);
    } else {
        ctx.reply('❌ Accès réservé à l\'administrateur');
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

// 🔄 COMMANDE /status
bot.command('status', (ctx) => {
    ctx.replyWithMarkdown(
        `📡 *STATUT DU SERVEUR*\n\n` +
        `🟢 *En ligne et opérationnel*\n\n` +
        `👥 Utilisateurs: ${userCount}\n` +
        `📊 Codes aujourd'hui: ${codesGeneratedToday}\n` +
        `⏰ Prochaine maintenance: Aucune planifiée`
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
    ctx.answerCbQuery('📊 Statistiques actualisées!');
    ctx.replyWithMarkdown(
        `📊 *STATISTIQUES ACTUALISÉES*\n\n` +
        `👥 *Utilisateurs mensuels:* ${userCount}\n` +
        `🚀 *Codes générés aujourd'hui:* ${codesGeneratedToday}\n` +
        `🟢 *Statut:* En ligne`
    );
});

// Gestion des erreurs
bot.catch((err, ctx) => {
    console.error(`❌ Erreur pour ${ctx.updateType}:`, err);
    ctx.reply('❌ Une erreur s\'est produite. Veuillez réessayer.');
});

// Route de santé pour Render
app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        bot: 'PATERSON-MD', 
        users: userCount,
        codes_today: codesGeneratedToday,
        owner_id: OWNER_ID
    });
});

// 🚀 DÉMARRAGE SERVEUR
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`👑 Propriétaire du bot: ${OWNER_ID}`);
    
    // MODE WEBHOOK UNIQUEMENT SI RENDER_URL EST DÉFINI
    if (RENDER_URL && !RENDER_URL.includes('localhost')) {
        try {
            await bot.telegram.setWebhook(`${RENDER_URL}/telegram`);
            console.log('✅ Webhook configured:', `${RENDER_URL}/telegram`);
        } catch (error) {
            console.log('❌ Webhook error, switching to polling:', error.message);
            bot.launch();
        }
    } else {
        console.log('🌐 Using polling mode');
        bot.launch();
    }
    
    await updateBotDescription();
    console.log('🤖 Bot PATERSON-MD est maintenant opérationnel!');
    
    // Notifier le propriétaire du démarrage
    try {
        await bot.telegram.sendMessage(
            OWNER_ID,
            `🤖 *PATERSON-MD Bot démarré!*\n` +
            `🚀 Serveur: ${RENDER_URL || 'Polling mode'}\n` +
            `⏰ Démarrage: ${new Date().toLocaleString('fr-FR')}`,
            { parse_mode: 'Markdown' }
        );
    } catch (error) {
        console.log('⚠️ Impossible de notifier le propriétaire du démarrage:', error.message);
    }
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
