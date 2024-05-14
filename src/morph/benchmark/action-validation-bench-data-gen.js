import { writeFileSync } from "node:fs";
import { join } from "node:path";

function generateRandomObject() {
  const keys = ["to", "key2", "key3", "key4", "key5"]; // Set of keys
  const obj = {};

  // Assign type property
  obj.type = Math.random() < 0.5 ? "equip" : "unequip";

  // Randomly decide whether to include a random key
  if (Math.random() < 0.5) {
    const randomKey = keys[Math.floor(Math.random() * keys.length)]; // Random key selection
    const randomValue =
      Math.random() < 0.5
        ? Math.random() * 100
        : Math.random() < 0.8
        ? Math.floor(Math.random() * 100)
        : Math.random().toString(36).substring(7); // Random value (either string or number)
    obj[randomKey] = randomValue; // Assign random key-value pair
  }

  return obj;
}

const objects = [];

for (let i = 0; i < 100000; i++) {
  objects.push(generateRandomObject());
}

const destPath = join(import.meta.dirname, "benchmark-input.json");

console.log("writing to ", destPath);

writeFileSync(destPath, JSON.stringify(objects, null, 2));
