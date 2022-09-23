-- CreateTable
CREATE TABLE `Operation` (
    `id` VARCHAR(191) NOT NULL,
    `assetCode` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `valuePerAsset` DOUBLE NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `type` ENUM('BUYING', 'SELLING') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
