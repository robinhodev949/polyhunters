import { randomBytes } from "crypto";

/** Generates a unique rental code like RC-a1b2c3d4 */
export function generateRentalCode(): string {
    return "RC-" + randomBytes(4).toString("hex");
}
