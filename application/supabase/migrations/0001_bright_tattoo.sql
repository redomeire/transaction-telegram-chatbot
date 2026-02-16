ALTER TABLE "reminders" RENAME COLUMN "remind_at" TO "time";
ALTER TABLE "reminders" ALTER COLUMN "time" TYPE varchar USING time::varchar;