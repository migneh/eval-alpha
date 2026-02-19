const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

/* ========================================
   Confirm Action with Buttons
======================================== */
async function confirmAction(message, embed) {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("confirm_action")
      .setLabel("تأكيد")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("cancel_action")
      .setLabel("إلغاء")
      .setStyle(ButtonStyle.Danger)
  );

  const msg = await message.reply({
    embeds: [embed],
    components: [row]
  });

  const filter = interaction =>
    interaction.user.id === message.author.id;

  const collector = msg.createMessageComponentCollector({
    filter,
    time: 15000
  });

  return new Promise((resolve) => {
    collector.on("collect", async interaction => {
      if (interaction.customId === "confirm_action") {
        await interaction.update({ components: [] });
        resolve(true);
      } else {
        await interaction.update({ components: [] });
        resolve(false);
      }
    });

    collector.on("end", async () => {
      try {
        await msg.edit({ components: [] });
      } catch {}
      resolve(false);
    });
  });
}

module.exports = {
  confirmAction
};
