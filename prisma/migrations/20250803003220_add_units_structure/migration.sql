-- CreateTable
CREATE TABLE "public"."unit_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "unit_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."units" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitTypeId" TEXT NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unit_types_name_key" ON "public"."unit_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "units_name_key" ON "public"."units"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."units" ADD CONSTRAINT "units_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "public"."unit_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "public"."units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
