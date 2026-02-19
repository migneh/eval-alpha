const db = require("../utils/database");
const { createEmbed } = require("../utils/embeds");
const { hasPermission } = require("../utils/permissions");
const {
  validateAmount,
  preventSelfAction,
  validateTargetCount,
  validateRemoveLimit,
  preventNegative
} = require("../utils/antiAbuse");
const { sendLog, buildLog } = require("../utils/logger");

module.exports = {
  name: "remove",
  cooldown: 5,

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

    /* ======================
       Get Targets
    ====================== */
    const targets = message.mentions.members.map(m => m);
    const amount = parseInt(args[targets.length]);

    /* ======================
       Anti-Abuse Validations
    ====================== */
    const targetError = validateTargetCount(targets, 5);
    if (targetError)
      return message.reply({ embeds: [createEmbed("error", "خطأ", targetError, message.guild)] });

    const selfError = preventSelfAction(message.author.id, targets);
    if (selfError)
      return message.reply({ embeds: [createEmbed("error", "خطأ", selfError, message.guild)] });

    const amountError = validateAmount(amount);
    if (amountError)
      return message.reply({ embeds: [createEmbed("error", "خطأ", amountError, message.guild)] });

    const limitError = validateRemoveLimit(amount, guildData);
    if (limitError)
      return message.reply({ embeds: [createEmbed("error", "خطأ", limitError, message.guild)] });

    /* ======================
       Apply Remove
    ====================== */
    for (const member of targets) {
      if (!guildData.points.users[member.id]) {
        guildData.points.users[member.id] = {
          points: 0,
          lastUpdated: Date.now()
        };
      }

      const currentPoints = guildData.points.users[member.id].points;

      const negativeError = preventNegative(currentPoints, amount);
      if (negativeError)
        return message.reply({
          embeds: [createEmbed("error", "خطأ", negativeError, message.guild)]
        });

      guildData.points.users[member.id].points -= amount;
      guildData.points.users[member.id].lastUpdated = Date.now();
    }

    /* ======================
       Save History
    ====================== */
    guildData.history.push({
      id: Date.now().toString(),
      type: "remove",
      executor: message.author.id,
      targets: targets.map(t => t.id),
      amount,
      timestamp: Date.now()
    });

    db.save(data);

    /* ======================
       Success Embed
    ====================== */
    const embed = createEmbed(
      "success",
      "➖ تمت إزالة النقاط",
      `تم إزالة **${amount}** نقطة من:\n${targets.map(t => t.toString()).join("\n")}`,
      message.guild
    );

    message.reply({ embeds: [embed] });

    /* ======================
       Log
    ====================== */
    const logContent = buildLog({
      executor: message.author.id,
      targets: targets.map(t => t.id),
      type: "remove",
      amount
    });

    sendLog(client, message.guild, guildData.settings, logContent);
  }
};
