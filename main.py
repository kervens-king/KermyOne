import os
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import requests
import json

# -- CONFIGURATION : Récupère les secrets --
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY')
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# Vérification simple au démarrage
if not TELEGRAM_BOT_TOKEN:
    print("⚠️  ATTENTION: TELEGRAM_BOT_TOKEN non défini!")
if not DEEPSEEK_API_KEY:
    print("⚠️  ATTENTION: DEEPSEEK_API_KEY non définie!")

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
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        response_data = response.json()
        ai_response = response_data['choices'][0]['message']['content']
        await update.message.reply_text(ai_response)

    except Exception as e:
        print(f"Erreur: {e}")
        await update.message.reply_text("🫤 Oups! Mon cerveau IA a un petit grain de sable. Réessaie!")

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    print(f"Une erreur s'est produite: {context.error}")
    if update and update.message:
        await update.message.reply_text("😵 Oups! Une erreur inattendue s'est produite. Mon créateur, Kervens King, en a été informé!")

if __name__ == '__main__':
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
    
    # Lancer le bot
    application.run_polling()
