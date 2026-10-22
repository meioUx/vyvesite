CREATE TABLE "WaitlistEntry" (
 "id" TEXT NOT NULL, "name" VARCHAR(80), "email" VARCHAR(254) NOT NULL,
 "consent" BOOLEAN NOT NULL, "consentVersion" VARCHAR(32) NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "source" VARCHAR(120), "campaign" VARCHAR(120), "medium" VARCHAR(120),
 CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "WaitlistEntry_email_key" ON "WaitlistEntry"("email");
CREATE TABLE "RateLimitBucket" (
 "key" TEXT NOT NULL, "count" INTEGER NOT NULL DEFAULT 1, "expiresAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);
CREATE INDEX "RateLimitBucket_expiresAt_idx" ON "RateLimitBucket"("expiresAt");
