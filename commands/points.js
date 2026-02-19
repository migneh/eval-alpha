const db = require("../utils/database");
const { createEmbed } = require("../utils/embeds");

module.exports = {
  name: "points",
  cooldown: 3,

  async execute(client, message) {
    const data = db.ensureGuild(message.guild.id);
    const guildData = data[message.guild.id];

    const member =
      message.mentions.members.first() || message.member;

    if (!guildData.points.users[member.id]) {
      guildData.points.users[member.id] = {
        points: 0,
        lastUpdated: Date.now()
      };
      db.save(data);
    }

    const userData = guildData.points.users[member.id];

    const embed = createEmbed(
      "neutral",
      "📊 نقاط العضو",
      `👤 **العضو:** ${member}
⭐ **النقاط:** ${userData.points}
🕒 **آخر تحديث:** <t:${Math.floor(
        userData.lastUpdated / 1000
      )}:R>`,
      message.guild
    );

    message.reply({ embeds: [embed] });
  }
};
