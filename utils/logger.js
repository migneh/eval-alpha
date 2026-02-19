const { createEmbed } = require("./embeds");

/* ========================================
   Send Log Message
======================================== */
async function sendLog(client, guild, settings, content) {
  try {
    if (!settings || !settings.channels || !settings.channels.log)
      return;

    const channelId = settings.channels.log;
    const channel = guild.channels.cache.get(channelId);

    if (!channel) return;

    const embed = createEmbed(
      "log",
      "📜 Points System Log",
      content,
      guild
    );

    await channel.send({ embeds: [embed] }).catch(() => {});
  } catch (error) {
    console.error("Logger Error:", error);
  }
}

/* ========================================
   Structured Log Helper
======================================== */
function buildLog({
  executor,
  targets = [],
  type,
  amount
}) {
  return `
👤 **المنفذ:** <@${executor}>
🎯 **المستهدف:** ${targets.map(id => `<@${id}>`).join(", ")}
📌 **العملية:** ${type.toUpperCase()}
🔢 **الكمية:** ${amount}
🕒 **التاريخ:** <t:${Math.floor(Date.now() / 1000)}:F>
`;
}

module.exports = {
  sendLog,
  buildLog
};
