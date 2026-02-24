-- CreateTable
CREATE TABLE "password_users" (
    "id" BIGSERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "password_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_users_username_key" ON "password_users"("username");

-- AddForeignKey
ALTER TABLE "password_users" ADD CONSTRAINT "password_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
