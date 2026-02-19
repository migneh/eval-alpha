/* ========================================
   Anti-Abuse System
======================================== */

/**
 * Validate points amount
 */
function validateAmount(amount) {
  if (!amount || isNaN(amount))
    return "❌ يجب إدخال رقم صحيح.";

  if (amount <= 0)
    return "❌ الرقم يجب أن يكون أكبر من صفر.";

  if (!Number.isInteger(amount))
    return "❌ يجب إدخال رقم صحيح بدون كسور.";

  return null;
}

/**
 * Prevent self modification
 */
function preventSelfAction(executorId, targets) {
  if (!targets || targets.length === 0) return null;

  const selfTarget = targets.find(t => t.id === executorId);
  if (selfTarget)
    return "❌ لا يمكنك تعديل نقاط نفسك.";

  return null;
}

/**
 * Check max users per command
 */
function validateTargetCount(targets, maxUsers = 5) {
  if (!targets || targets.length === 0)
    return "❌ يجب تحديد عضو واحد على الأقل.";

  if (targets.length > maxUsers)
    return `❌ الحد الأقصى هو ${maxUsers} أعضاء في نفس العملية.`;

  return null;
}

/**
 * Check Add Limit
 */
function validateAddLimit(amount, guildData) {
  const max = guildData.settings.limits.maxAdd;

  if (amount > max)
    return `❌ الحد الأقصى للإضافة هو ${max}.`;

  return null;
}

/**
 * Check Remove Limit
 */
function validateRemoveLimit(amount, guildData) {
  const max = guildData.settings.limits.maxRemove;

  if (amount > max)
    return `❌ الحد الأقصى للإزالة هو ${max}.`;

  return null;
}

/**
 * Prevent negative points
 */
function preventNegative(currentPoints, removeAmount) {
  if (removeAmount > currentPoints)
    return "❌ لا يمكن جعل النقاط تحت الصفر.";

  return null;
}

module.exports = {
  validateAmount,
  preventSelfAction,
  validateTargetCount,
  validateAddLimit,
  validateRemoveLimit,
  preventNegative
};
