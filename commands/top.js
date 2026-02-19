const db = require("../utils/database");
const { createEmbed } = require("../utils/embeds");

module.exports = {
  name: "top",
  cooldown: 5,

  async execute(client, message) {
    const data = db.ensureGuild(message.guild.id);
    const guildData = data[message.guild.id];

    const users = guildData.points.users;

    if (!users || Object.keys(users).length === 0) {
      const embed = createEmbed(
        "warning",
        "🏆 التوب فارغ",
        "لا يوجد أي نقاط مسجلة بعد.",
        message.guild
      );
      return message.reply({ embeds: [embed] });
    }

    const sorted = Object.entries(users)
      .sort((a, b) => b[1].points - a[1].points)
      .slice(0, 10);

    let description = "";

    sorted.forEach((user, index) => {
      description += `**#${index + 1}** - <@${user[0]}>  
⭐ ${user[1].points} نقطة\n\n`;
    });

    const embed = createEmbed(
      "panel",
      "🏆 أفضل 10 أعضاء",
      description,
      message.guild
    );

    message.reply({ embeds: [embed] });
  }
};
