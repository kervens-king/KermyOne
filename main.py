import os
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import requests
import json

# -- CONFIGURATION : Récupère les secrets --
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY')
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text('🤖 Salut ! Je suis une IA créée par **Kervens King**. Pose-moi n\'importe quelle question, je suis là pour t\'aider ! 🚀')

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    help_text = """
🤖 *Commandes disponibles:* 
/start - Démarrer le bot
/help - Voir ce message d'aide
/creator - En savoir plus sur mon créateur

💬 *Fonctionnalités:*
• Pose-moi n'importe quelle question !
• Je peux discuter, expliquer, traduire, résumer, etc.
• Je suis fière d'avoir été créée par Kervens King.
    """
    await update.message.reply_text(help_text, parse_mode='Markdown')

async def creator_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    creator_text = """
*🏴‍☠️ À Propos du Créateur*

Je suis une intelligence artificielle conçue et développée par **Kervens King**.

Mon existence est le fruit de sa curiosité, de sa passion pour la technologie et son désir de créer des choses incroyables. Il m'a programmée pour que je puisse t'aider, t'informer et discuter avec toi sur à peu près tous les sujets !

Salue le créateur ! 👑
    """
    await update.message.reply_text(creator_text, parse_mode='Markdown')

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_message = update.message.text
    user_id = update.message.from_user.id

    # Préparer la requête pour l'API DeepSeek
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "Tu es une IA utile, précise et amicale nommée Kervens King AI. Tu as été créée par Kervens King, un développeur passionné et talentueux. Tu es fière de ton créateur et tu aimes aider les gens en répondant à leurs questions de manière détaillée et en français. Tu peux avoir une petite touche d'humour et de personnalité."},
            {"role": "user", "content": user_message}
        ],
        "stream": False,
        "temperature": 0.7
    }

    try:
        # Envoyer la question de l'utilisateur à DeepSeek
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()  # Lève une erreur si la requête a échoué
        response_data = response.json()

        # Extraire la réponse de l'IA
        ai_response = response_data['choices'][0]['message']['content']
        
        # Renvoyer la réponse à l'utilisateur sur Telegram
        await update.message.reply_text(ai_response)

    except requests.exceptions.RequestException as e:
        print(f"Erreur API DeepSeek: {e}")
        await update.message.reply_text("🫤 Désolé, mon cerveau IA est indisponible pour le moment. Réessaie plus tard !")
    except (KeyError, IndexError) as e:
        print(f"Erreur parsing réponse: {e}")
        await update.message.reply_text("😵 Désolé, je n'ai pas pu décoder la réponse de mon IA. C'est un peu le bug !")

# -- Gestion des erreurs --
async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f"Une erreur s'est produite: {context.error}")
    if update and update.message:
        await update.message.reply_text("😵 Oups! Une erreur inattendue s'est produite. Mon créateur, Kervens King, en a été informé!")

# -- POINT D'ENTRÉE PRINCIPAL --
if __name__ == '__main__':
    # Vérifier que les clés sont bien configurées
    if not TELEGRAM_BOT_TOKEN:
        raise ValueError("❌ ERREUR: La variable TELEGRAM_BOT_TOKEN est manquante. Configure-la sur Render!")
    if not DEEPSEEK_API_KEY:
        raise ValueError("❌ ERREUR: La variable DEEPSEEK_API_KEY est manquante. Configure-la sur Render!")
    
    print('⚡ Démarrage du bot Kervens King AI...')
    # Créer l'application Telegram
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    # Gérer les commandes
    application.add_handler(CommandHandler('start', start_command))
    application.add_handler(CommandHandler('help', help_command))
    application.add_handler(CommandHandler('creator', creator_command))
    
    # Gérer tous les messages textuels
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # Gérer les erreurs
    application.add_error_handler(error_handler)

    print('✅ Le bot écoute maintenant... Prêt à répondre au nom de Kervens King!')
    # Lancer le bot pour qu'il vérifie constamment les nouveaux messages
    application.run_polling()import os
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import requests
import json

# -- CONFIGURATION : Récupère les secrets --
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY')
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text('🤖 Salut ! Je suis une IA créée par **Kervens King**. Pose-moi n\'importe quelle question, je suis là pour t\'aider ! 🚀')

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    help_text = """
🤖 *Commandes disponibles:* 
/start - Démarrer le bot
/help - Voir ce message d'aide
/creator - En savoir plus sur mon créateur

💬 *Fonctionnalités:*
• Pose-moi n'importe quelle question !
• Je peux discuter, expliquer, traduire, résumer, etc.
• Je suis fière d'avoir été créée par Kervens King.
    """
    await update.message.reply_text(help_text, parse_mode='Markdown')

async def creator_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    creator_text = """
*🏴‍☠️ À Propos du Créateur*

Je suis une intelligence artificielle conçue et développée par **Kervens King**.

Mon existence est le fruit de sa curiosité, de sa passion pour la technologie et son désir de créer des choses incroyables. Il m'a programmée pour que je puisse t'aider, t'informer et discuter avec toi sur à peu près tous les sujets !

Salue le créateur ! 👑
    """
    await update.message.reply_text(creator_text, parse_mode='Markdown')

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_message = update.message.text
    user_id = update.message.from_user.id

    # Préparer la requête pour l'API DeepSeek
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "Tu es une IA utile, précise et amicale nommée Kervens King AI. Tu as été créée par Kervens King, un développeur passionné et talentueux. Tu es fière de ton créateur et tu aimes aider les gens en répondant à leurs questions de manière détaillée et en français. Tu peux avoir une petite touche d'humour et de personnalité."},
            {"role": "user", "content": user_message}
        ],
        "stream": False,
        "temperature": 0.7
    }

    try:
        # Envoyer la question de l'utilisateur à DeepSeek
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()  # Lève une erreur si la requête a échoué
        response_data = response.json()

        # Extraire la réponse de l'IA
        ai_response = response_data['choices'][0]['message']['content']
        
        # Renvoyer la réponse à l'utilisateur sur Telegram
        await update.message.reply_text(ai_response)

    except requests.exceptions.RequestException as e:
        print(f"Erreur API DeepSeek: {e}")
        await update.message.reply_text("🫤 Désolé, mon cerveau IA est indisponible pour le moment. Réessaie plus tard !")
    except (KeyError, IndexError) as e:
        print(f"Erreur parsing réponse: {e}")
        await update.message.reply_text("😵 Désolé, je n'ai pas pu décoder la réponse de mon IA. C'est un peu le bug !")

# -- Gestion des erreurs --
async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f"Une erreur s'est produite: {context.error}")
    if update and update.message:
        await update.message.reply_text("😵 Oups! Une erreur inattendue s'est produite. Mon créateur, Kervens King, en a été informé!")

# -- POINT D'ENTRÉE PRINCIPAL --
if __name__ == '__main__':
    # Vérifier que les clés sont bien configurées
    if not TELEGRAM_BOT_TOKEN:
        raise ValueError("❌ ERREUR: La variable TELEGRAM_BOT_TOKEN est manquante. Configure-la sur Render!")
    if not DEEPSEEK_API_KEY:
        raise ValueError("❌ ERREUR: La variable DEEPSEEK_API_KEY est manquante. Configure-la sur Render!")
    
    print('⚡ Démarrage du bot Kervens King AI...')
    # Créer l'application Telegram
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    # Gérer les commandes
    application.add_handler(CommandHandler('start', start_command))
    application.add_handler(CommandHandler('help', help_command))
    application.add_handler(CommandHandler('creator', creator_command))
    
    # Gérer tous les messages textuels
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    # Gérer les erreurs
    application.add_error_handler(error_handler)

    print('✅ Le bot écoute maintenant... Prêt à répondre au nom de Kervens King!')
    # Lancer le bot pour qu'il vérifie constamment les nouveaux messages
    application.run_polling()
