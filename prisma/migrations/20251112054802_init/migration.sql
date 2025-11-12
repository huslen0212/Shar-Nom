-- CreateTable
CREATE TABLE "place" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "founded_year" INTEGER,
    "image_url" TEXT,
    "short_description" TEXT,
    "long_description" TEXT,
    "location" TEXT,
    "phone_number" TEXT,
    "facebook_url" TEXT,
    "instagram_url" TEXT,
    "website_url" TEXT,
    "category" TEXT,

    CONSTRAINT "place_pkey" PRIMARY KEY ("id")
);
