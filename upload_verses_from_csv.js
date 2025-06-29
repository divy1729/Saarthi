const admin = require("firebase-admin");
const csv = require("csvtojson");
const path = require("path");

// Path to your service account key
const serviceAccount = require("./serviceAccountKey.json");

// Path to your CSV file
const csvFilePath = path.join(__dirname, "verses.csv"); // Change if your file has a different name

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadVerses() {
    const verses = await csv().fromFile(csvFilePath);
    console.log("First 3 parsed rows:", verses.slice(0, 3));
    const batch = db.batch();
    verses.forEach((verse) => {
      // Skip rows with missing or invalid chapter/verse
      if (!verse.Chapter || !verse.Verse || isNaN(Number(verse.Chapter)) || isNaN(Number(verse.Verse))) {
        return;
      }
      // Compose a unique doc ID, e.g., chapter_verse
      const docId = `${verse.Chapter}_${verse.Verse}`;
      // Prepare the Firestore document
      const docData = {
        chapter: Number(verse.Chapter),
        verse: Number(verse.Verse),
        shloka: verse.Shloka || "",
        transliteration: verse.Transliteration || "",
        meaning_hindi: verse.HinMeaning || "",
        meaning_english: verse.EngMeaning || "",
        tags: []
      };
      batch.set(db.collection("verses").doc(docId), docData);
    });
    await batch.commit();
    console.log("Upload complete!");
  }
  
uploadVerses().catch(console.error); 