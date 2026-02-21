const db = require("../utils/database");
const { hasPermission } = require("../utils/permissions");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  name: "help",
  cooldown: 5,

  async execute(client, message) {
    const data = db.ensureGuild(message.guild.id);
    const guildData = data[message.guild.id];
    const prefix = guildData.settings.prefix || "!";
    const isAdmin = hasPermission(message.member, guildData);

    /* ======================
       EMBEDS
    ====================== */

    const homeEmbed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle("🤖 Advanced Points System")
      .setDescription(
        `مرحباً ${message.author}\n\n` +
        "اختر القسم من الأزرار بالأسفل لعرض الأوامر.\n\n" +
        "✨ نظام نقاط احترافي مع لوق + حماية + صلاحيات."
      )
      .addFields(
        {
          name: "📌 معلومات سريعة",
          value:
            `• استخدم \`${prefix}points\` لعرض نقاطك\n` +
            `• استخدم \`${prefix}top\` لعرض الترتيب\n` +
            `• النظام يسجل كل العمليات`
        }
      )
      .setFooter({ text: "Help Menu • Interactive System" });

    const publicEmbed = new EmbedBuilder()
      .setColor("#57F287")
      .setTitle("📋 الأوامر العامة")
      .setDescription("هذه الأوامر متاحة لجميع الأعضاء.")
      .addFields(
        {
          name: `📊 ${prefix}points [@user]`,
          value: "عرض نقاطك أو نقاط عضو آخر."
        },
        {
          name: `🏆 ${prefix}top`,
          value: "عرض ترتيب أعلى 10 أعضاء."
        },
        {
          name: `❓ ${prefix}help`,
          value: "فتح قائمة المساعدة التفاعلية."
        }
      );

    const adminEmbed = new EmbedBuilder()
      .setColor("#ED4245")
      .setTitle("🛠 أوامر الإدارة")
      .setDescription("هذه الأوامر تتطلب صلاحيات خاصة.")
      .addFields(
        {
          name: `➕ ${prefix}add @user 100`,
          value: "إضافة نقاط."
        },
        {
          name: `➖ ${prefix}remove @user 50`,
          value: "خصم نقاط."
        },
        {
          name: `🔁 ${prefix}reset`,
          value: "تصفير جميع النقاط."
        },
        {
          name: `📜 ${prefix}history`,
          value: "عرض آخر العمليات."
        },
        {
          name: `⚙️ ${prefix}setup`,
          value: "إدارة إعدادات النظام."
        }
      );

    /* ======================
       BUTTONS
    ====================== */

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("home")
        .setLabel("الرئيسية")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("public")
        .setLabel("الأوامر العامة")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("admin")
        .setLabel("أوامر الإدارة")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(!isAdmin)
    );

    const msg = await message.reply({
      embeds: [homeEmbed],
      components: [row]
    });

    /* ======================
       COLLECTOR
    ====================== */

    const collector = msg.createMessageComponentCollector({
      time: 60000
    });

    collector.on("collect", async interaction => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({
          content: "❌ هذا الزر ليس لك.",
          ephemeral: true
        });
      }

      if (interaction.customId === "home") {
        await interaction.update({ embeds: [homeEmbed] });
      }

      if (interaction.customId === "public") {
        await interaction.update({ embeds: [publicEmbed] });
      }

      if (interaction.customId === "admin") {
        if (!isAdmin)
          return interaction.reply({
            content: "❌ لا تملك صلاحية.",
            ephemeral: true
          });

        await interaction.update({ embeds: [adminEmbed] });
      }
    });

    collector.on("end", () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        row.components.map(button => button.setDisabled(true))
      );

      msg.edit({ components: [disabledRow] }).catch(() => {});
    });
  }
};
