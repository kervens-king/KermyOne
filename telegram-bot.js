const { Telegraf } = require('telegraf');
const axios = require('axios');
require('dotenv').config();

class TelegramAIBot {
    constructor() {
        this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
        this.deepseekApiKey = process.env.DEEPSEEK_API_KEY;
        this.conversations = new Map(); // Pour stocker l'historique des conversations
        this.setupHandlers();
    }

    // Configuration des gestionnaires de messages
    setupHandlers() {
        // Commande de démarrage
        this.bot.start((ctx) => {
            ctx.reply('🤖 Bonjour ! Je suis votre assistant IA powered by DeepSeek.\n\n'
                + 'Envoyez-moi un message et je vous répondrai !\n\n'
                + 'Commandes disponibles:\n'
                + '/start - Démarrer le bot\n'
                + '/help - Afficher l\'aide\n'
                + '/clear - Effacer l\'historique de conversation\n'
                + '/info - Informations sur le bot');
        });

        // Commande d'aide
        this.bot.help((ctx) => {
            ctx.reply('💡 Comment utiliser ce bot:\n\n'
                + '• Envoyez simplement un message et je répondrai\n'
                + '• Je maintiens le contexte de notre conversation\n'
                + '• Utilisez /clear pour effacer l\'historique\n'
                + '• Je suis basé sur DeepSeek AI\n\n'
                + 'Posez-moi n\'importe quelle question !');
        });

        // Commande pour effacer l'historique
        this.bot.command('clear', (ctx) => {
            const chatId = ctx.chat.id;
            this.conversations.delete(chatId);
            ctx.reply('🗑️ Historique de conversation effacé !');
        });

        // Commande info
        this.bot.command('info', (ctx) => {
            ctx.reply('🤖 Telegram AI Bot\n\n'
                + '• Powered by DeepSeek AI\n'
                + '• Développé avec Node.js\n'
                + '• Mainient le contexte des conversations\n'
                + '• Supporte le markdown\n\n'
                + 'Version: 1.0.0');
        });

        // Gestionnaire pour tous les messages texte
        this.bot.on('text', async (ctx) => {
            try {
                const message = ctx.message.text;
                const chatId = ctx.chat.id;
                const userId = ctx.from.id;

                // Afficher "typing..."
                await ctx.sendChatAction('typing');

                // Récupérer ou créer l'historique de conversation
                if (!this.conversations.has(chatId)) {
                    this.conversations.set(chatId, []);
                }

                const conversationHistory = this.conversations.get(chatId);

                // Ajouter le message de l'utilisateur à l'historique
                conversationHistory.push({
                    role: 'user',
                    content: message
                });

                // Limiter l'historique à 10 messages pour éviter les tokens excessifs
                if (conversationHistory.length > 10) {
                    conversationHistory.splice(0, conversationHistory.length - 10);
                }

                // Obtenir la réponse de DeepSeek
                const aiResponse = await this.getDeepSeekResponse(conversationHistory);

                // Ajouter la réponse de l'IA à l'historique
                conversationHistory.push({
                    role: 'assistant',
                    content: aiResponse
                });

                // Envoyer la réponse formatée
                await ctx.reply(aiResponse, {
                    parse_mode: 'Markdown',
                    reply_to_message_id: ctx.message.message_id
                });

            } catch (error) {
                console.error('Erreur:', error);
                ctx.reply('❌ Désolé, une erreur s\'est produite. Veuillez réessayer.');
            }
        });

        // Gestionnaire pour les messages autres que texte
        this.bot.on('message', (ctx) => {
            ctx.reply('📝 Je ne peux traiter que les messages texte pour le moment.');
        });
    }

    // Méthode pour interagir avec l'API DeepSeek
    async getDeepSeekResponse(messages) {
        try {
            const response = await axios.post(
                'https://api.deepseek.com/v1/chat/completions',
                {
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: 'Vous êtes un assistant IA utile, friendly et professionnel. '
                                + 'Répondez en français de manière claire et concise. '
                                + 'Utilisez le markdown pour formater vos réponses quand c\'est approprié.'
                        },
                        ...messages
                    ],
                    temperature: 0.7,
                    max_tokens: 2000,
                    stream: false
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.deepseekApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000 // 30 secondes timeout
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Erreur DeepSeek API:', error.response?.data || error.message);
            throw new Error('Erreur de communication avec l\'IA');
        }
    }

    // Gestion des erreurs
    setupErrorHandling() {
        this.bot.catch((error, ctx) => {
            console.error('Erreur du bot:', error);
            ctx.reply('❌ Une erreur interne s\'est produite. Veuillez réessayer.');
        });
    }

    // Démarrer le bot
    start() {
        this.setupErrorHandling();
        this.bot.launch().then(() => {
            console.log('🤖 Bot Telegram AI démarré avec succès!');
        });

        // Gestion propre de l'arrêt
        process.once('SIGINT', () => this.bot.stop('SIGINT'));
        process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
    }
}

// Initialisation et démarrage du bot
const initializeBot = () => {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.error('❌ TELEGRAM_BOT_TOKEN manquant dans les variables d\'environnement');
        process.exit(1);
    }

    if (!process.env.DEEPSEEK_API_KEY) {
        console.error('❌ DEEPSEEK_API_KEY manquant dans les variables d\'environnement');
        process.exit(1);
    }

    const aiBot = new TelegramAIBot();
    aiBot.start();
};

module.exports = { TelegramAIBot, initializeBot };

// Si le fichier est exécuté directement
if (require.main === module) {
    initializeBot();
}
