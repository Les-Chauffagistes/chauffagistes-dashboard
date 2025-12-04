-- CreateTable
CREATE TABLE "lnurl_auth" (
    "k1" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "user_id" BIGINT,

    CONSTRAINT "lnurl_auth_pkey" PRIMARY KEY ("k1")
);

-- CreateTable
CREATE TABLE "worker_stats_raw" (
    "worker_id" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avg_hashrate1m" BIGINT,
    "avg_hashrate5m" BIGINT,
    "avg_hashrate1h" BIGINT,
    "avg_hashrate1d" BIGINT,
    "avg_hashrate7d" BIGINT,
    "avg_weight" DECIMAL(6,3),
    "user" TEXT
);

-- CreateTable
CREATE TABLE "workernames" (
    "workername" TEXT NOT NULL,
    "user" BIGINT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "btc_address" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "workernames_pkey" PRIMARY KEY ("workername","user","btc_address")
);

-- CreateTable
CREATE TABLE "discord_users" (
    "id" TEXT NOT NULL,
    "discord_name" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "discord_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ln_users" (
    "id" BIGSERIAL NOT NULL,
    "ln_key" TEXT,
    "user_id" BIGINT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "pseudo" TEXT,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT,

    CONSTRAINT "users_pkey1" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "worker_stats_raw_timestamp_idx" ON "worker_stats_raw"("timestamp" DESC);

-- CreateIndex
CREATE INDEX "worker_stats_raw_user_worker_id_timestamp_idx" ON "worker_stats_raw"("user", "worker_id", "timestamp" DESC);

-- AddForeignKey
ALTER TABLE "workernames" ADD CONSTRAINT "fk workernames.user" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discord_users" ADD CONSTRAINT "fk dc_users.users" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ln_users" ADD CONSTRAINT "ln_users_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

