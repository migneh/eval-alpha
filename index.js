const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config/botConfig.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Prefix
client.prefix = config.prefix;

// Command Collection
client.commands = new Collection();

// Cooldowns Map
client.cooldowns = new Map();

/* ===============================
   Load Commands Automatically
================================ */
const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file =>
    file.endsWith(".js")
  );

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.name) {
      client.commands.set(command.name, command);
    }
  }
}

/* ===============================
   Load Events Automatically
================================ */
const eventsPath = path.join(__dirname, "events");

if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file =>
    file.endsWith(".js")
  );

  for (const file of eventFiles) {
    require(`./events/${file}`)(client);
  }
}

/* ===============================
   Basic Fallback Ready Event
================================ */
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

/* ===============================
   Login
================================ */
client.login(config.token);
