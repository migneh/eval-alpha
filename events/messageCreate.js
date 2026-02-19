const config = require("../config/botConfig.json");
const { checkCooldown } = require("../utils/cooldown");
const { handleError } = require("../utils/errorHandler");
const { createEmbed } = require("../utils/embeds");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    // ❌ تجاهل البوتات
    if (message.author.bot) return;

    // ❌ تجاهل الخاص
    if (!message.guild) return;

    // ❌ تحقق من البيرفكس
    if (!message.content.startsWith(client.prefix)) return;

    const args = message.content
      .slice(client.prefix.length)
      .trim()
      .split(/ +/);

    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
      /* ==========================
         Cooldown System
      ========================== */
      const cooldownSeconds =
        command.cooldown || config.defaultCooldown;

      const cooldownMessage = checkCooldown(
        client,
        message,
        command.name,
        cooldownSeconds
      );

      if (cooldownMessage) {
        const embed = createEmbed(
          "warning",
          "Cooldown",
          cooldownMessage,
          message.guild
        );

        return message.reply({ embeds: [embed] });
      }

      /* ==========================
         Execute Command
      ========================== */
      await command.execute(client, message, args);
    } catch (error) {
      handleError(message, error);
    }
  });
};
