-- AlterTable to set default planType
ALTER TABLE "Subscription" ALTER COLUMN "planType" SET DEFAULT 'STARTER';

-- Insert subscriptions for existing restaurants without subscriptions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
INSERT INTO "Subscription" ("id", "restaurantId", "planType", "startDate", "freeTrialEndDate", "status")
SELECT
    uuid_generate_v4(),
    "id",
    'STARTER',
    now(),
    now() + interval '30 days',
    'ACTIVE'
FROM "Restaurant"
WHERE "id" NOT IN (SELECT "restaurantId" FROM "Subscription");