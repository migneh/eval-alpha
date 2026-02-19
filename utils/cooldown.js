/* ========================================
   Cooldown System (Guild + Command + User)
======================================== */

function checkCooldown(client, message, commandName, cooldownSeconds = 5) {
  const now = Date.now();

  // إنشاء guild map إذا غير موجود
  if (!client.cooldowns.has(message.guild.id)) {
    client.cooldowns.set(message.guild.id, new Map());
  }

  const guildCooldowns = client.cooldowns.get(message.guild.id);

  // إنشاء command map إذا غير موجود
  if (!guildCooldowns.has(commandName)) {
    guildCooldowns.set(commandName, new Map());
  }

  const commandCooldowns = guildCooldowns.get(commandName);

  const expireTime = cooldownSeconds * 1000;

  if (commandCooldowns.has(message.author.id)) {
    const lastUsed = commandCooldowns.get(message.author.id);
    const remaining = expireTime - (now - lastUsed);

    if (remaining > 0) {
      const seconds = Math.ceil(remaining / 1000);
      return `⏳ الرجاء الانتظار ${seconds} ثانية قبل استخدام الأمر مرة أخرى.`;
    }
  }

  // تسجيل وقت الاستخدام
  commandCooldowns.set(message.author.id, now);

  return null;
}

/**
 * Optional: Clear old cooldowns manually
 * Useful if you want scheduled cleanup in future
 */
function clearCooldown(client, guildId, commandName, userId) {
  if (!client.cooldowns.has(guildId)) return;

  const guildCooldowns = client.cooldowns.get(guildId);
  if (!guildCooldowns.has(commandName)) return;

  guildCooldowns.get(commandName).delete(userId);
}

module.exports = {
  checkCooldown,
  clearCooldown
};
