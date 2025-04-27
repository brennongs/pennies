-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originatorId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    CONSTRAINT "Transaction_originatorId_fkey" FOREIGN KEY ("originatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
