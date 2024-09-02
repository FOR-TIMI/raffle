import xlsx from "xlsx";
import RaffleModel from "../../model/raffle";
import RaffleParticipantModel from "../../model/raffle/participant";
import { CustomFile } from "../../schemas/raffle";

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

const BATCH_SIZE = 1000; // Adjust based on your needs and system capabilities

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

    const atIndex = email.indexOf("@");
    const dotIndex = email.lastIndexOf(".");
    if (atIndex <= 0 || dotIndex <= atIndex + 1) {
      console.warn(`Invalid email format: ${email}. Skipping this row.`);
      skippedCount++;
      continue;
    }

    const namePart = email.slice(0, atIndex);
    const dotInNameIndex = namePart.indexOf(".");
    let firstName, lastName;

    if (dotInNameIndex !== -1) {
      firstName = namePart.slice(0, dotInNameIndex);
      lastName = namePart.slice(dotInNameIndex + 1);
    } else {
      firstName = namePart;
      lastName = "";
    }

    const exclude = positiveResponses.has(
      String(row["Exclude"] || row["exclude"]).toLowerCase()
    );
    console.log({ email, firstName, lastName, exclude });

    if (!exclude) {
      batch.push({
        raffle: raffleId,
        email,
        firstName,
        lastName,
        isWinner: false,
      });

      if (batch.length >= BATCH_SIZE) {
        await RaffleParticipantModel.insertMany(batch);
        processedCount += batch.length;
        batch = [];
      }
    } else {
      skippedCount++;
    }
  }

  // Insert any remaining documents
  if (batch.length > 0) {
    await RaffleParticipantModel.insertMany(batch);
    processedCount += batch.length;
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
