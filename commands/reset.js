const db = require("../utils/database");
const { createEmbed } = require("../utils/embeds");
const { hasPermission } = require("../utils/permissions");
const { confirmAction } = require("../utils/confirm");
const { sendLog, buildLog } = require("../utils/logger");

module.exports = {
  name: "reset",
  cooldown: 10,

  async execute(client, message, args) {
    const data = db.ensureGuild(message.guild.id);
    const guildData = data[message.guild.id];

    /* ======================
       Permission Check
    ====================== */
    if (!hasPermission(message.member, guildData)) {
      const embed = createEmbed(
        "error",
        "❌ لا تملك صلاحية",
        "ليس لديك صلاحية لاستخدام هذا الأمر.",
        message.guild
      );
      return message.reply({ embeds: [embed] });
    }

    const targetAll = args[0] === "all";
    const member = message.mentions.members.first();

    /* ======================
       Reset All
    ====================== */
    if (targetAll) {
      const confirmEmbed = createEmbed(
        "warning",
        "⚠️ تأكيد التصفير الكامل",
        "هل أنت متأكد أنك تريد تصفير جميع النقاط؟",
        message.guild
      );

      const confirmed = await confirmAction(message, confirmEmbed);
      if (!confirmed) return;

      guildData.points.users = {};

      guildData.history.push({
        id: Date.now().toString(),
        type: "reset_all",
        executor: message.author.id,
        targets: [],
        amount: 0,
        timestamp: Date.now()
      });

      db.save(data);

      const embed = createEmbed(
        "success",
        "🔁 تم التصفير",
        "تم تصفير جميع النقاط بنجاح.",
        message.guild
      );

      message.reply({ embeds: [embed] });

      const logContent = buildLog({
        executor: message.author.id,
        targets: [],
        type: "reset_all",
        amount: 0
      });

      return sendLog(client, message.guild, guildData.settings, logContent);
    }

    /* ======================
       Reset Single User
    ====================== */
    if (!member) {
      const embed = createEmbed(
        "error",
        "❌ خطأ",
        "حدد عضو أو استخدم `reset all`",
        message.guild
      );
      return message.reply({ embeds: [embed] });
    }

    const confirmEmbed = createEmbed(
      "warning",
      "⚠️ تأكيد التصفير",
      `هل أنت متأكد أنك تريد تصفير نقاط ${member}?`,
      message.guild
    );

    const confirmed = await confirmAction(message, confirmEmbed);
    if (!confirmed) return;

    guildData.points.users[member.id] = {
      points: 0,
      lastUpdated: Date.now()
    };

    guildData.history.push({
      id: Date.now().toString(),
      type: "reset_user",
      executor: message.author.id,
      targets: [member.id],
      amount: 0,
      timestamp: Date.now()
    });

    db.save(data);

    const embed = createEmbed(
      "success",
      "🔁 تم التصفير",
      `تم تصفير نقاط ${member} بنجاح.`,
      message.guild
    );

    message.reply({ embeds: [embed] });

    const logContent = buildLog({
      executor: message.author.id,
      targets: [member.id],
      type: "reset_user",
      amount: 0
    });

    sendLog(client, message.guild, guildData.settings, logContent);
  }
};
