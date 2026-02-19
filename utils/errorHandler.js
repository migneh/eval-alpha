const { createEmbed } = require("./embeds");

/* ========================================
   Global Error Handler
======================================== */
function handleError(message, error) {
  console.error("Command Error:", error);

  if (!message || !message.guild) return;

  try {
    const embed = createEmbed(
      "error",
      "❌ حدث خطأ غير متوقع",
      "حصل خطأ أثناء تنفيذ الأمر.\nإذا استمر الخطأ تواصل مع مطور البوت.",
      message.guild
    );

    message.reply({ embeds: [embed] }).catch(() => {});
  } catch (e) {
    console.error("ErrorHandler Failed:", e);
  }
}

module.exports = {
  handleError
};
