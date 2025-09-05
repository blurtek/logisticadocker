-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "transporter" TEXT NOT NULL,
    "scheduledDate" TEXT NOT NULL,
    "scheduledTime" TEXT NOT NULL,
    "customerObservations" TEXT,
    "customerPhone" TEXT NOT NULL,
    "hasPickup" BOOLEAN NOT NULL DEFAULT false,
    "pickupItems" TEXT,
    "deliveredMaterials" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PREPARACION',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paymentAmount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
