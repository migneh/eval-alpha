const db = require("../utils/database");
const { createEmbed } = require("../utils/embeds");
const { hasPermission } = require("../utils/permissions");

module.exports = {
  name: "history",
  cooldown: 5,

  async execute(client, message) {
    const data = db.ensureGuild(message.guild.id);
    const guildData = data[message.guild.id];

    /* ======================
       Permission Check
    ====================== */
    if (!hasPermission(message.member, guildData)) {
      return message.reply({
        embeds: [
          createEmbed(
            "error",
            "❌ لا تملك صلاحية",
            "ليس لديك صلاحية لاستخدام هذا الأمر.",
            message.guild
          )
        ]
      });
    }

    const history = guildData.history;

    if (!history || history.length === 0) {
      return message.reply({
        embeds: [
          createEmbed(
            "warning",
            "📜 لا يوجد سجل",
            "لم يتم تنفيذ أي عمليات حتى الآن.",
            message.guild
          )
        ]
      });
    }

    const last10 = history.slice(-10).reverse();

    let description = "";

    last10.forEach((entry, index) => {
      description += `**#${index + 1}**\n`;
      description += `👤 المنفذ: <@${entry.executor}>\n`;

      if (entry.targets && entry.targets.length > 0) {
        description += `🎯 المستهدف: ${entry.targets
          .map(id => `<@${id}>`)
          .join(", ")}\n`;
      } else {
        description += `🎯 المستهدف: الجميع\n`;
      }

      description += `📌 النوع: ${entry.type}\n`;
      description += `🔢 الكمية: ${entry.amount}\n`;
      description += `🕒 <t:${Math.floor(
        entry.timestamp / 1000
      )}:R>\n\n`;
    });

    const embed = createEmbed(
      "panel",
      "📜 آخر 10 عمليات",
      description,
      message.guild
    );

    message.reply({ embeds: [embed] });
  }
};
