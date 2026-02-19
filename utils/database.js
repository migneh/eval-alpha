const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "database", "guilds.json");

/* ==============================
   Load Database
============================== */
function load() {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
    }

    const raw = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Database Load Error:", error);
    return {};
  }
}

/* ==============================
   Save Database
============================== */
function save(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Database Save Error:", error);
  }
}

/* ==============================
   Ensure Guild Structure
============================== */
function ensureGuild(guildId) {
  const data = load();

  if (!data[guildId]) {
    data[guildId] = {
      points: {
        users: {}
      },
      history: [],
      settings: {
        roles: {
          admin: null,
          pointsManager: null
        },
        channels: {
          log: null
        },
        limits: {
          maxAdd: 1000,
          maxRemove: 1000
        }
      }
    };

    save(data);
  }

  return data;
}

/* ==============================
   Get User Points Safely
============================== */
function getUser(guildData, userId) {
  if (!guildData.points.users[userId]) {
    guildData.points.users[userId] = {
      points: 0,
      lastUpdated: Date.now()
    };
  }

  return guildData.points.users[userId];
}

module.exports = {
  load,
  save,
  ensureGuild,
  getUser
};
