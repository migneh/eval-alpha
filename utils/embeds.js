const { EmbedBuilder } = require("discord.js");

const colors = {
  success: 0x2ecc71,   // أخضر
  error: 0xe74c3c,     // أحمر
  neutral: 0x95a5a6,   // رمادي
  panel: 0x9b59b6,     // بنفسجي
  warning: 0xf1c40f,   // أصفر
  log: 0x3498db        // أزرق
};

/* ==============================
   Create Embed
============================== */
function createEmbed(type, title, description, guild) {
  const embed = new EmbedBuilder()
    .setColor(colors[type] || colors.neutral)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();

  if (guild && guild.iconURL()) {
    embed.setThumbnail(guild.iconURL({ dynamic: true }));
  }

  return embed;
}

/* ==============================
   Panel Embed (لوحات إعدادات)
============================== */
function createPanel(title, fields = [], guild) {
  const embed = new EmbedBuilder()
    .setColor(colors.panel)
    .setTitle(title)
    .setTimestamp();

  if (guild && guild.iconURL()) {
    embed.setThumbnail(guild.iconURL({ dynamic: true }));
  }

  if (fields.length > 0) {
    embed.addFields(fields);
  }

  return embed;
}

module.exports = {
  createEmbed,
  createPanel
};
