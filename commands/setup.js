const db = require("../utils/database");
const { createEmbed, createPanel } = require("../utils/embeds");
const { hasPermission } = require("../utils/permissions");
const { sendLog, buildLog } = require("../utils/logger");

module.exports = {
  name: "setup",
  cooldown: 5,

  async execute(client, message, args) {
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

    /* ======================
       Show Settings
    ====================== */
    if (!args[0]) {
      const settings = guildData.settings;

      const fields = [
        {
          name: "👑 Admin Role",
          value: settings.roles.admin
            ? `<@&${settings.roles.admin}>`
            : "غير معين",
          inline: true
        },
        {
          name: "🎯 Points Manager",
          value: settings.roles.pointsManager
            ? `<@&${settings.roles.pointsManager}>`
            : "غير معين",
          inline: true
        },
        {
          name: "📜 Log Channel",
          value: settings.channels.log
            ? `<#${settings.channels.log}>`
            : "غير معين",
          inline: true
        },
        {
          name: "📈 Max Add",
          value: settings.limits.maxAdd.toString(),
          inline: true
        },
        {
          name: "📉 Max Remove",
          value: settings.limits.maxRemove.toString(),
          inline: true
        }
      ];

      const embed = createPanel(
        "⚙️ إعدادات النظام",
        fields,
        message.guild
      );

      return message.reply({ embeds: [embed] });
    }

    const option = args[0].toLowerCase();

    /* ======================
       Set Admin Role
    ====================== */
    if (option === "admin") {
      const role = message.mentions.roles.first();
      if (!role)
        return message.reply({
          embeds: [
            createEmbed(
              "error",
              "❌ خطأ",
              "يجب منشن رتبة.",
              message.guild
            )
          ]
        });

      guildData.settings.roles.admin = role.id;
      db.save(data);

      const embed = createEmbed(
        "success",
        "✅ تم التحديث",
        `تم تعيين ${role} كرتبة Admin.`,
        message.guild
      );

      message.reply({ embeds: [embed] });
    }

    /* ======================
       Set Manager Role
    ====================== */
    else if (option === "manager") {
      const role = message.mentions.roles.first();
      if (!role)
        return message.reply({
          embeds: [
            createEmbed(
              "error",
              "❌ خطأ",
              "يجب منشن رتبة.",
              message.guild
            )
          ]
        });

      guildData.settings.roles.pointsManager = role.id;
      db.save(data);

      const embed = createEmbed(
        "success",
        "✅ تم التحديث",
        `تم تعيين ${role} كرتبة Points Manager.`,
        message.guild
      );

      message.reply({ embeds: [embed] });
    }

    /* ======================
       Set Log Channel
    ====================== */
    else if (option === "log") {
      const channel = message.mentions.channels.first();
      if (!channel)
        return message.reply({
          embeds: [
            createEmbed(
              "error",
              "❌ خطأ",
              "يجب منشن قناة.",
              message.guild
            )
          ]
        });

      guildData.settings.channels.log = channel.id;
      db.save(data);

      const embed = createEmbed(
        "success",
        "✅ تم التحديث",
        `تم تعيين ${channel} كقناة اللوق.`,
        message.guild
      );

      message.reply({ embeds: [embed] });
    }

    /* ======================
       Set Limits
    ====================== */
    else if (option === "maxadd" || option === "maxremove") {
      const value = parseInt(args[1]);
      if (!value || isNaN(value) || value <= 0)
        return message.reply({
          embeds: [
            createEmbed(
              "error",
              "❌ خطأ",
              "أدخل رقم صحيح أكبر من صفر.",
              message.guild
            )
          ]
        });

      if (option === "maxadd")
        guildData.settings.limits.maxAdd = value;
      else guildData.settings.limits.maxRemove = value;

      db.save(data);

      const embed = createEmbed(
        "success",
        "✅ تم التحديث",
        `تم تعديل ${option} إلى ${value}.`,
        message.guild
      );

      message.reply({ embeds: [embed] });
    }

    else {
      return message.reply({
        embeds: [
          createEmbed(
            "error",
            "❌ خيار غير صحيح",
            "استخدم: admin / manager / log / maxadd / maxremove",
            message.guild
          )
        ]
      });
    }

    /* ======================
       Log Setup Change
    ====================== */
    const logContent = buildLog({
      executor: message.author.id,
      targets: [],
      type: "setup_change",
      amount: 0
    });

    sendLog(client, message.guild, guildData.settings, logContent);
  }
};
