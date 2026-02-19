const db = require("../utils/database");
const { createEmbed, createPanel } = require("../utils/embeds");
const { hasPermission } = require("../utils/permissions");

module.exports = {
  name: "help",
  cooldown: 5,

  async execute(client, message) {
    const data = db.ensureGuild(message.guild.id);
    const guildData = data[message.guild.id];

    const prefix = guildData.settings.prefix || "!";

    const isAdmin = hasPermission(message.member, guildData);

    /* ======================
       Public Commands
    ====================== */
    const publicCommands = [
      {
        name: `📊 ${prefix}points`,
        value: "عرض نقاطك أو نقاط شخص آخر.",
        inline: false
      },
      {
        name: `🏆 ${prefix}top`,
        value: "عرض ترتيب أعلى الأعضاء.",
        inline: false
      },
      {
        name: `❓ ${prefix}help`,
        value: "عرض قائمة الأوامر.",
        inline: false
      }
    ];

    /* ======================
       Admin Commands
    ====================== */
    const adminCommands = [
      {
        name: `➕ ${prefix}add @user 100`,
        value: "إضافة نقاط لعضو معين.",
        inline: false
      },
      {
        name: `➖ ${prefix}remove @user 50`,
        value: "سحب نقاط من عضو معين.",
        inline: false
      },
      {
        name: `🔁 ${prefix}reset`,
        value: "تصفير نقاط جميع الأعضاء.",
        inline: false
      },
      {
        name: `📜 ${prefix}history`,
        value: "عرض آخر العمليات المنفذة.",
        inline: false
      },
      {
        name: `⚙️ ${prefix}setup`,
        value: "إدارة إعدادات النظام.",
        inline: false
      }
    ];

    const fields = [
      {
        name: "📋 أوامر عامة",
        value: publicCommands
          .map(cmd => `**${cmd.name}**\n${cmd.value}`)
          .join("\n\n"),
        inline: false
      }
    ];

    if (isAdmin) {
      fields.push({
        name: "🛠 أوامر الإدارة",
        value: adminCommands
          .map(cmd => `**${cmd.name}**\n${cmd.value}`)
          .join("\n\n"),
        inline: false
      });
    }

    fields.push({
      name: "💡 ملاحظات",
      value:
        "• النظام يدعم نظام صلاحيات احترافي.\n" +
        "• جميع العمليات يتم تسجيلها في قناة اللوق.\n" +
        "• يوجد نظام حماية + كولداون مدمج.",
      inline: false
    });

    const embed = createPanel(
      "🤖 Advanced Points System",
      fields,
      message.guild
    );

    message.reply({ embeds: [embed] });
  }
};
