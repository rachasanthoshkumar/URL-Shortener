-- Drop link organization/status fields that are no longer part of the product.
ALTER TABLE "Link"
  DROP COLUMN IF EXISTS "folderId",
  DROP COLUMN IF EXISTS "status",
  DROP COLUMN IF EXISTS "expiresAt",
  DROP COLUMN IF EXISTS "clickLimit";

DROP TABLE IF EXISTS "LinkHealthCheck";
DROP TABLE IF EXISTS "LinkTag";
DROP TABLE IF EXISTS "Folder";
DROP TABLE IF EXISTS "Tag";

DROP TYPE IF EXISTS "HealthStatus";
DROP TYPE IF EXISTS "LinkStatus";
