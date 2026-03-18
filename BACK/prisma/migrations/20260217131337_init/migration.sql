-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `is_validated` BOOLEAN NOT NULL DEFAULT false,
    `role` ENUM('customer', 'entreprise', 'admin') NOT NULL DEFAULT 'customer',
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATE NOT NULL,
    `updated_at` DATE NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `created_at` DATE NOT NULL,
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_receives_notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `notification_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` DATE NOT NULL,
    `created_at` DATE NOT NULL,

    INDEX `user_receives_notifications_notification_id_idx`(`notification_id`),
    INDEX `user_receives_notifications_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile` (
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NULL,
    `is_newbie` BOOLEAN NULL DEFAULT false,
    `company_name` VARCHAR(191) NULL,
    `siret` VARCHAR(191) NULL,
    `updated_at` DATE NOT NULL,
    `created_at` DATE NOT NULL,

    UNIQUE INDEX `profile_siret_key`(`siret`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address_line_1` VARCHAR(191) NOT NULL,
    `zip_code` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `updated_at` DATE NOT NULL,
    `created_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `start_date` DATE NOT NULL,
    `address_id` INTEGER NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `is_finished` BOOLEAN NOT NULL DEFAULT false,
    `updated_at` DATE NOT NULL,
    `created_at` DATE NOT NULL,

    INDEX `project_address_id_idx`(`address_id`),
    INDEX `project_customer_id_idx`(`customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entreprise_has_projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `project_id` INTEGER NOT NULL,
    `entreprise_id` INTEGER NOT NULL,
    `updated_at` DATE NOT NULL,
    `created_at` DATE NOT NULL,

    INDEX `entreprise_has_projects_project_id_entreprise_id_idx`(`project_id`, `entreprise_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `status` ENUM('pending', 'stopped', 'finished', 'started') NOT NULL DEFAULT 'pending',
    `entreprise_project_id` INTEGER NULL,
    `updated_at` DATE NOT NULL,
    `created_at` DATE NOT NULL,

    INDEX `task_entreprise_project_id_idx`(`entreprise_project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profession_name` VARCHAR(191) NOT NULL,
    `updated_at` DATE NOT NULL,
    `created_at` DATE NOT NULL,

    UNIQUE INDEX `profession_profession_name_key`(`profession_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task_has_profession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `task_id` INTEGER NOT NULL,
    `profession_id` INTEGER NOT NULL,
    `updated_at` DATE NOT NULL,
    `created_at` DATE NOT NULL,

    INDEX `task_has_profession_task_id_idx`(`task_id`),
    INDEX `task_has_profession_profession_id_idx`(`profession_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_has_profession` (
    `user_id` INTEGER NOT NULL,
    `profession_id` INTEGER NOT NULL,
    `updated_at` DATE NOT NULL,
    `created_at` DATE NOT NULL,

    INDEX `user_has_profession_user_id_idx`(`user_id`),
    INDEX `user_has_profession_profession_id_idx`(`profession_id`),
    PRIMARY KEY (`user_id`, `profession_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_has_addresses` (
    `address_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `updated_at` DATE NOT NULL,
    `created_at` DATE NOT NULL,

    INDEX `user_has_addresses_address_id_idx`(`address_id`),
    INDEX `user_has_addresses_user_id_idx`(`user_id`),
    PRIMARY KEY (`address_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estimate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `estimate_number` INTEGER NOT NULL,
    `payment_type` ENUM('cash', 'check', 'credit_card', 'bank_transfer') NOT NULL DEFAULT 'cash',
    `is_validated_by_customer` BOOLEAN NOT NULL DEFAULT false,
    `limit_date` DATE NOT NULL,
    `project_id` INTEGER NOT NULL,
    `entreprise_id` INTEGER NOT NULL,
    `updated_at` DATE NOT NULL,
    `created_at` DATE NOT NULL,

    UNIQUE INDEX `estimate_estimate_number_key`(`estimate_number`),
    INDEX `estimate_project_id_idx`(`project_id`),
    INDEX `estimate_entreprise_id_idx`(`entreprise_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `line` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price_per_qty` DECIMAL(10, 2) NOT NULL,
    `estimate_id` INTEGER NOT NULL,
    `updated_at` DATE NOT NULL,
    `created_at` DATE NOT NULL,

    INDEX `line_estimate_id_idx`(`estimate_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `payment_type` ENUM('cash', 'check', 'credit_card', 'bank_transfer') NOT NULL DEFAULT 'credit_card',
    `status` ENUM('to_be_payed', 'payed', 'pending', 'cancelled') NOT NULL DEFAULT 'pending',
    `estimate_id` INTEGER NOT NULL,
    `updated_at` DATE NOT NULL,
    `created_at` DATE NOT NULL,

    INDEX `invoice_estimate_id_idx`(`estimate_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token_hash` VARCHAR(255) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,
    `expires_at` DATE NOT NULL,
    `updated_at` DATE NOT NULL,
    `created_at` DATE NOT NULL,

    INDEX `refresh_token_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_receives_notifications` ADD CONSTRAINT `user_receives_notifications_notification_id_fkey` FOREIGN KEY (`notification_id`) REFERENCES `notification`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_receives_notifications` ADD CONSTRAINT `user_receives_notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `profile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project` ADD CONSTRAINT `project_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project` ADD CONSTRAINT `project_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entreprise_has_projects` ADD CONSTRAINT `entreprise_has_projects_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `entreprise_has_projects` ADD CONSTRAINT `entreprise_has_projects_entreprise_id_fkey` FOREIGN KEY (`entreprise_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_entreprise_project_id_fkey` FOREIGN KEY (`entreprise_project_id`) REFERENCES `entreprise_has_projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task_has_profession` ADD CONSTRAINT `task_has_profession_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `task`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `task_has_profession` ADD CONSTRAINT `task_has_profession_profession_id_fkey` FOREIGN KEY (`profession_id`) REFERENCES `profession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_has_profession` ADD CONSTRAINT `user_has_profession_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_has_profession` ADD CONSTRAINT `user_has_profession_profession_id_fkey` FOREIGN KEY (`profession_id`) REFERENCES `profession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_has_addresses` ADD CONSTRAINT `user_has_addresses_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_has_addresses` ADD CONSTRAINT `user_has_addresses_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estimate` ADD CONSTRAINT `estimate_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estimate` ADD CONSTRAINT `estimate_entreprise_id_fkey` FOREIGN KEY (`entreprise_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `line` ADD CONSTRAINT `line_estimate_id_fkey` FOREIGN KEY (`estimate_id`) REFERENCES `estimate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoice` ADD CONSTRAINT `invoice_estimate_id_fkey` FOREIGN KEY (`estimate_id`) REFERENCES `estimate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
