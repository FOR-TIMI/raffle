import xlsx from "xlsx";
import RaffleModel from "../../model/raffle";
import RaffleParticipantModel from "../../model/raffle/participant";
import { CustomFile } from "../../schemas/raffle";
import capitalize from "../../utils/capitalize";

export async function getOneRaffle(userEmail: string) {
  return await RaffleModel.find({ creatorEmail: userEmail }).lean();
}

interface ExcelRow {
  email?: string;
  Email?: string;
  exclude?: string | boolean;
  Exclude?: string | boolean;
  [key: string]: any;
}

const BATCH_SIZE = 1000;

export async function processExcelFile(fileBuffer: Buffer, raffleId: string) {
  const workbook = xlsx.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet) as ExcelRow[];

  const positiveResponses = new Set([
    "yes",
    "y",
    "true",
    "1",
    "ok",
    "okay",
    "sure",
  ]);

  let batch: any[] = [];
  let processedCount = 0;
  let skippedCount = 0;

  for (const row of data) {
    const email = row["Email"] || row["email"];
    if (
      typeof email !== "string" ||
      !email.includes("@") ||
      !email.includes(".")
    ) {
      console.warn(`Invalid email: ${email}. Skipping this row.`);
      skippedCount++;
      continue;
    }

    const [namePart, domain] = email.split("@");
    const [firstName, lastName] = namePart.split(".");

    if (!firstName || !lastName) {
      console.warn(`Invalid email format: ${email}. Skipping this row.`);
      skippedCount++;
      continue;
    }

    const capitalizedFirstName = capitalize(firstName);
    const capitalizedLastName = capitalize(lastName);

    const exclude = positiveResponses.has(
      String(row["Exclude"] || row["exclude"] || "").toLowerCase()
    );

    if (!exclude) {
      batch.push({
        raffle: raffleId,
        email,
        firstName: capitalizedFirstName,
        lastName: capitalizedLastName,
        isWinner: false,
      });

      if (batch.length >= BATCH_SIZE) {
        try {
          await RaffleParticipantModel.insertMany(batch);
          processedCount += batch.length;
        } catch (error) {
          console.error("Error inserting batch:", error);
          console.error("Problematic batch:", JSON.stringify(batch, null, 2));
        }
        batch = [];
      }
    } else {
      skippedCount++;
    }
  }

  // Insert any remaining documents
  if (batch.length > 0) {
    try {
      await RaffleParticipantModel.insertMany(batch);
      processedCount += batch.length;
    } catch (error) {
      console.error("Error inserting final batch:", error);
      console.error("Problematic batch:", JSON.stringify(batch, null, 2));
    }
  }

  return { processedCount, skippedCount };
}

export function isCustomFile(
  file: Express.Multer.File | undefined
): file is CustomFile {
  return (
    file !== undefined &&
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}
