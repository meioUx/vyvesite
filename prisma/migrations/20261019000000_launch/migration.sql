-- AlterTable
ALTER TABLE "WaitlistEntry" ADD COLUMN     "betaInvitedAt" TIMESTAMP(3),
ADD COLUMN     "challengeStartedAt" TIMESTAMP(3),
ADD COLUMN     "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "marketingConsentAt" TIMESTAMP(3),
ADD COLUMN     "migrationConsentAt" TIMESTAMP(3),
ADD COLUMN     "referralCode" TEXT,
ADD COLUMN     "referredById" TEXT,
ADD COLUMN     "verifiedAt" TIMESTAMP(3);

-- Backfill legacy subscribers without falsely verifying their email or opting them into marketing.
UPDATE "WaitlistEntry" SET "referralCode" = gen_random_uuid()::text;
ALTER TABLE "WaitlistEntry" ALTER COLUMN "referralCode" SET NOT NULL;
ALTER TABLE "WaitlistEntry" ADD COLUMN "emailIdentity" VARCHAR(254);
WITH identities AS (
 SELECT id,
 (CASE WHEN split_part(lower(email), '@', 2) IN ('gmail.com', 'googlemail.com')
 THEN replace(split_part(split_part(lower(email), '@', 1), '+', 1), '.', '') || '@gmail.com'
 ELSE split_part(split_part(lower(email), '@', 1), '+', 1) || '@' || split_part(lower(email), '@', 2) END) AS identity
 FROM "WaitlistEntry"
), ranked AS (SELECT *, row_number() OVER (PARTITION BY identity ORDER BY id) AS n FROM identities)
UPDATE "WaitlistEntry" e SET "emailIdentity" = ranked.identity FROM ranked WHERE e.id = ranked.id AND ranked.n = 1;
CREATE UNIQUE INDEX "WaitlistEntry_emailIdentity_key" ON "WaitlistEntry"("emailIdentity");

-- CreateTable
CREATE TABLE "AccessToken" (
    "hash" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessToken_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "MemberSession" (
    "hash" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberSession_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "MailMessage" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),

    CONSTRAINT "MailMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "visitor" VARCHAR(64),
    "source" VARCHAR(32) NOT NULL DEFAULT 'direct',
    "tool" VARCHAR(32),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaunchSettings" (
    "id" TEXT NOT NULL DEFAULT 'launch',
    "rewardsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "rewardRules" TEXT NOT NULL DEFAULT '',
    "rewardThreshold" INTEGER NOT NULL DEFAULT 5,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "LaunchSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAudit" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeDay" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChallengeDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MailMessage_sentAt_createdAt_idx" ON "MailMessage"("sentAt", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_name_idx" ON "AnalyticsEvent"("createdAt", "name");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_visitor_createdAt_idx" ON "AnalyticsEvent"("visitor", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeDay_entryId_day_key" ON "ChallengeDay"("entryId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistEntry_referralCode_key" ON "WaitlistEntry"("referralCode");

-- CreateIndex
CREATE INDEX "WaitlistEntry_referredById_verifiedAt_idx" ON "WaitlistEntry"("referredById", "verifiedAt");

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "WaitlistEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "WaitlistEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberSession" ADD CONSTRAINT "MemberSession_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "WaitlistEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailMessage" ADD CONSTRAINT "MailMessage_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "WaitlistEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeDay" ADD CONSTRAINT "ChallengeDay_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "WaitlistEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "no_self_referral" CHECK ("referredById" IS NULL OR "referredById" <> id);
ALTER TABLE "ChallengeDay" ADD CONSTRAINT "challenge_day_range" CHECK (day BETWEEN 1 AND 30);
