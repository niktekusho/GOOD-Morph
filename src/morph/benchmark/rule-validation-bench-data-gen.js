// Function to generate random string
function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to generate random objects
function generateRandomObject() {
  const shouldUseShape = Math.random() < 0.9; // 90% chance to use specified shape

  if (shouldUseShape) {
    const id = Math.floor(Math.random() * 1000);
    const actionType = Math.random() < 0.5 ? "equip" : "unequip";
    const filterCharacterName = generateRandomString(8);

    const obj = {
      id,
      action:
        actionType === "equip"
          ? { type: "equip", to: generateRandomString(10) }
          : { type: "unequip" },
      filter: {
        type: "equippingCharacter",
        characterName: filterCharacterName,
      },
    };

    if (Math.random() < 0.5) {
      obj.name = generateRandomString(10);
    }

    return obj;
  } else {
    // Generate any shape of object
    const randomKey = generateRandomString(5);
    const randomValue =
      Math.random() < 0.5
        ? generateRandomString(10)
        : Math.floor(Math.random() * 100);

    return { [randomKey]: randomValue };
  }
}

// Generate 10,000 objects
const objects = [];
for (let i = 0; i < 10000; i++) {
  objects.push(generateRandomObject());
}

import { writeFileSync } from "node:fs";
import { join } from "node:path";

const filePath = join(import.meta.dirname, "rule-validation-bench-data.json");

writeFileSync(filePath, JSON.stringify(objects));
