const mongoose = require("mongoose");

const TARGET_DB = "genzpedia";

function getDbNameFromUri(uri) {
  if (!uri || typeof uri !== "string") return null;
  const withoutQuery = uri.split("?")[0];
  const afterScheme = withoutQuery.replace(/^mongodb(\+srv)?:\/\//i, "");
  const slashIdx = afterScheme.indexOf("/");
  if (slashIdx === -1) return null;
  const dbPart = afterScheme.slice(slashIdx + 1).trim();
  return dbPart || null;
}

function getHostsForLog(uri) {
  try {
    const withoutQuery = uri.split("?")[0];
    const afterScheme = withoutQuery.replace(/^mongodb(\+srv)?:\/\//i, "");
    const atIdx = afterScheme.lastIndexOf("@");
    const hostPart = atIdx >= 0 ? afterScheme.slice(atIdx + 1) : afterScheme;
    const slashIdx = hostPart.indexOf("/");
    return slashIdx >= 0 ? hostPart.slice(0, slashIdx) : hostPart;
  } catch {
    return "(unable to parse)";
  }
}

function getConnectionOptions(uri) {
  const connectOptions = {};
  const uriDbName = getDbNameFromUri(uri);

  if (!uriDbName || uriDbName.toLowerCase() !== TARGET_DB) {
    connectOptions.dbName = TARGET_DB;

    if (uriDbName && uriDbName.toLowerCase() !== TARGET_DB) {
      console.log(
        `URI path database "${uriDbName}" is not "${TARGET_DB}"; using mongoose option dbName: "${TARGET_DB}"`
      );
    } else if (!uriDbName) {
      console.log(
        `No database name in URI path; using mongoose option dbName: "${TARGET_DB}"`
      );
    }
  }

  return connectOptions;
}

function logMongoUriPlan(uri) {
  console.log(
    `Using MONGO_URI from environment (hosts: ${getHostsForLog(uri)})`
  );
}

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is missing in .env");
    }

    logMongoUriPlan(uri);

    const options = getConnectionOptions(uri);

    await mongoose.connect(uri, options);

    console.log(`MongoDB connected successfully to database "${TARGET_DB}"`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;