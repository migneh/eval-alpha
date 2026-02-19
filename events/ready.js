module.exports = (client) => {
  client.once("ready", () => {
    console.log("======================================");
    console.log("🚀 Advanced Points System Bot v2");
    console.log(`👤 Logged in as: ${client.user.tag}`);
    console.log(`🆔 Bot ID: ${client.user.id}`);
    console.log(`🌍 Serving ${client.guilds.cache.size} servers`);
    console.log("======================================");

    // نشاط البوت (Presence)
    client.user.setPresence({
      activities: [
        {
          name: `${client.prefix}help | Points System`,
          type: 0
        }
      ],
      status: "online"
    });
  });
};
