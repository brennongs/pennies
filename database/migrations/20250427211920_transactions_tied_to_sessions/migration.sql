/*
  Warnings:

  - Added the required column `sessionId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originatorId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    CONSTRAINT "Transaction_originatorId_fkey" FOREIGN KEY ("originatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "id", "originatorId", "recipientId", "transactionType") SELECT "amount", "id", "originatorId", "recipientId", "transactionType" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
