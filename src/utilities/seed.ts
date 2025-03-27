import { db } from "~/server/db";
import { backgrounds as backgroundData } from "./backgrounds";
import { backgrounds } from "~/server/db/schema";

async function seedBackgrounds() {
  for (const background of backgroundData) {
    await db.insert(backgrounds).values(background);
  }
}

seedBackgrounds()
  .then(() => console.log("Successfully seeded."))
  .catch((e) => console.log(e));
