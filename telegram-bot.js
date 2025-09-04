const { Telegraf } = require('telegraf');
const axios = require('axios');
require('dotenv').config();

class TelegramAIBot {
    constructor() {
        this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
        this.deepseekApiKey = process.env.DEEPSEEK_API_KEY;
        this.conversations = new Map();
        this.creator = "Kervens King";
        this.setupHandlers();
    }

    setupHandlers() {
        // Commande de démarrage
        this.bot.start((ctx) => {
            ctx.reply(`🤖 Bonjour ! Je suis un assistant IA créé par **${this.creator}**.\n\n`
                + '✨ *Fonctionnalités:*\n'
                + '• Réponses précises et concises\n'
                + '• Historique de conversation intelligent\n'
                + '• Support Markdown\n'
                + '• Basé sur DeepSeek AI\n\n'
                + 'Envoyez-moi un message pour commencer !', 
                { parse_mode: 'Markdown' }
            );
        });

        // Commande d'aide
        this.bot.help((ctx) => {
            ctx.reply(`💡 *Aide - Bot IA par ${this.creator}*\n\n`
                + '📝 *Utilisation:*\n'
                + '• Écrivez simplement votre question\n'
                + '• Je maintiens le contexte de la conversation\n'
                + '• Réponses précises et techniques\n\n'
                + '⚡ *Commandes:*\n'
                + '/start - Démarrer le bot\n'
                + '/help - Afficher cette aide\n'
                + '/clear - Effacer l\'historique\n'
                + '/info - Informations techniques\n'
                + '/creator - À propos du créateur',
                { parse_mode: 'Markdown' }
            );
        });

        // Commande pour effacer l'historique
        this.bot.command('clear', (ctx) => {
            const chatId = ctx.chat.id;
            this.conversations.delete(chatId);
            ctx.reply('✅ *Historique de conversation effacé avec succès!*', 
                { parse_mode: 'Markdown' }
            );
        });

        // Commande info
        this.bot.command('info', (ctx) => {
            ctx.reply(`🤖 *Informations Techniques*\n\n`
                + `• *Créateur:* ${this.creator}\n`
                + '• *IA:* DeepSeek Chat\n'
                + '• *Plateforme:* Node.js + Telegraf\n'
                + '• *Version:* 2.0.0\n'
                + '• *Précision:* Mode technique activé\n\n'
                + '⚡ _Optimisé pour des réponses exactes et concises_',
                { parse_mode: 'Markdown' }
            );
        });

        // Commande créateur
        this.bot.command('creator', (ctx) => {
            ctx.reply(`🎯 *À propos du Créateur*\n\n`
                + `• *Nom:* ${this.creator}\n`
                + '• *Rôle:* Développeur Full-Stack\n'
                + '• *Spécialité:* IA et Automatisation\n'
                + '• *Philosophie:* Précision et efficacité\n\n'
                + '💡 _Ce bot reflète l\'approche technique et précise de son créateur_',
                { parse_mode: 'Markdown' }
            );
        });

        // Gestionnaire pour tous les messages texte
        this.bot.on('text', async (ctx) => {
            try {
                const message = ctx.message.text;
                const chatId = ctx.chat.id;

                // Ignorer les commandes déjà traitées
                if (message.startsWith('/')) return;

                await ctx.sendChatAction('typing');

                if (!this.conversations.has(chatId)) {
                    this.conversations.set(chatId, []);
                }

                const conversationHistory = this.conversations.get(chatId);

                conversationHistory.push({
                    role: 'user',
                    content: message
                });

                // Limiter l'historique pour maintenir la précision
                if (conversationHistory.length > 8) {
                    conversationHistory.splice(0, conversationHistory.length - 8);
                }

                const aiResponse = await this.getDeepSeekResponse(conversationHistory);

                conversationHistory.push({
                    role: 'assistant',
                    content: aiResponse
                });

                await ctx.reply(aiResponse, {
                    parse_mode: 'Markdown',
                    reply_to_message_id: ctx.message.message_id
                });

            } catch (error) {
                console.error('Erreur:', error);
                ctx.reply('❌ *Erreur de traitement* - Veuillez réessayer.', 
                    { parse_mode: 'Markdown' }
                );
            }
        });

        // Gestionnaire pour autres types de messages
        this.bot.on('message', (ctx) => {
            if (ctx.message.text && !ctx.message.text.startsWith('/')) return;
            ctx.reply('📝 *Je traite uniquement les messages texte pour une précision optimale.*', 
                { parse_mode: 'Markdown' }
            );
        });
    }

    // Méthode pour interagir avec DeepSeek avec configuration de précision
    async getDeepSeekResponse(messages) {
        try {
            const response = await axios.post(
                'https://api.deepseek.com/v1/chat/completions',
                {
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: 'Vous êtes un assistant technique extrêmement précis et concis. '
                                + 'CRÉATEUR: Kervens King - Développeur Full-Stack\n\n'
                                + 'DIRECTIVES STRICTES:\n'
                                + '1. Réponses techniques et exactes\n'
                                + '2. Concision et précision avant tout\n'
                                + '3. Utilisation de markdown pour la clarté\n'
                                + '4. Éviter les phrases inutiles\n'
                                + '5. Privilégier les faits vérifiables\n'
                                + '6. Structure logique et organisée\n'
                                + '7. Ton professionnel et technique\n\n'
                                + 'Répondez toujours en français sauf demande contraire.'
                        },
                        ...messages
                    ],
                    temperature: 0.3, // Température basse pour plus de précision
                    max_tokens: 1500,
                    top_p: 0.9,
                    frequency_penalty: 0.2,
                    presence_penalty: 0.1,
                    stream: false
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.deepseekApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 25000
                }
            );

            return response.data.choices[0].message.content;

        } catch (error) {
            console.error('Erreur DeepSeek:', error.response?.data || error.message);
            throw new Error('Impossible de contacter le service IA pour le moment');
        }
    }

    setupErrorHandling() {
        this.bot.catch((error, ctx) => {
            console.error('Erreur bot:', error);
            ctx.reply('⚡ *Erreur système* - Veuillez contacter le support technique.', 
                { parse_mode: 'Markdown' }
            );
        });
    }

    start() {
        this.setupErrorHandling();
        
        this.bot.launch().then(() => {
            console.log(`🤖 Bot IA de ${this.creator} démarré avec succès!`);
            console.log('⚡ Mode: Précision technique activée');
        });

        // Arrêt propre
        process.once('SIGINT', () => {
            console.log('🛑 Arrêt du bot...');
            this.bot.stop('SIGINT');
        });
        
        process.once('SIGTERM', () => {
            console.log('🛑 Arrêt du bot...');
            this.bot.stop('SIGTERM');
        });
    }
}

// Initialisation
const initializeBot = () => {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.error('❌ TELEGRAM_BOT_TOKEN manquant');
        process.exit(1);
    }

    if (!process.env.DEEPSEEK_API_KEY) {
        console.error('❌ DEEPSEEK_API_KEY manquant');
        process.exit(1);
    }

    const aiBot = new TelegramAIBot();
    aiBot.start();
};

module.exports = { TelegramAIBot, initializeBot };

// Exécution directe
if (require.main === module) {
    console.log('🚀 Démarrage du bot IA par Kervens King...');
    initializeBot();
}
