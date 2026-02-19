const config = require("../config/botConfig.json");

/* ==============================
   Permission Check
============================== */
function hasPermission(member, guildData) {
  if (!member || !guildData) return false;

  // 👑 Owner Override
  if (config.owners.includes(member.id)) return true;

  // 🛡 Administrator Permission
  if (member.permissions.has("Administrator")) return true;

  const roles = guildData.settings.roles;

  // 🎖 Custom Admin Role
  if (roles.admin && member.roles.cache.has(roles.admin)) return true;

  // 🎯 Points Manager Role
  if (
    roles.pointsManager &&
    member.roles.cache.has(roles.pointsManager)
  )
    return true;

  return false;
}

/* ==============================
   Owner Only Check
============================== */
function isOwner(userId) {
  return config.owners.includes(userId);
}

module.exports = {
  hasPermission,
  isOwner
};
