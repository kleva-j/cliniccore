# MySQL to PostgreSQL Migration Guide

This guide will help you migrate your ClinicCore application from MySQL to PostgreSQL.

## Prerequisites

- Existing MySQL database with data
- PostgreSQL server running (or use Docker Compose)
- `pg_dump` and `psql` tools installed

## Migration Steps

### 1. Backup MySQL Data

First, create a backup of your MySQL database:

```bash
# Export data from MySQL
mysqldump -u your_mysql_user -p --no-create-info --complete-insert --single-transaction cliniccore > mysql_data.sql

# Or if using Docker:
docker-compose exec database mysqldump -u cliniccore_user -p --no-create-info --complete-insert --single-transaction cliniccore > mysql_data.sql
```

### 2. Update Dependencies

Install the new PostgreSQL dependencies:

```bash
pnpm install
```

This will install:
- `postgres` (postgres-js driver)
- `@types/pg` (TypeScript types)

And remove:
- `mysql2`

### 3. Start PostgreSQL Database

Using Docker Compose:

```bash
# Stop the old MySQL container
docker-compose down

# Start the new PostgreSQL container
docker-compose --profile dev up -d database

# Wait for PostgreSQL to be ready
docker-compose logs -f database
```

### 4. Run Database Migrations

Generate and run the new PostgreSQL schema:

```bash
# Generate new migration files
pnpm db:push

# Or manually run:
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 5. Data Migration Script

Create a data migration script to convert MySQL data to PostgreSQL format:

```bash
# Create the migration script
node scripts/migrate-data.js
```

### 6. Manual Data Conversion (if needed)

Some data types may need manual conversion:

#### Boolean Values
- MySQL: `1`/`0` → PostgreSQL: `true`/`false`
- Update `isActive` field in `patient_accounts` table

#### Enum Values
- MySQL enums are now PostgreSQL enums
- Values should remain the same: `admin`, `receptionist`, `doctor`, `patient`

#### Auto-increment IDs
- MySQL: `AUTO_INCREMENT` → PostgreSQL: `SERIAL`
- Sequences will be automatically created

### 7. Verify Migration

Run these queries to verify the migration:

```sql
-- Check table structure
\d+ users
\d+ doctors
\d+ patients
\d+ appointments
\d+ visit_notes
\d+ logs
\d+ patient_accounts

-- Check data counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'doctors', COUNT(*) FROM doctors
UNION ALL
SELECT 'patients', COUNT(*) FROM patients
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'visit_notes', COUNT(*) FROM visit_notes
UNION ALL
SELECT 'logs', COUNT(*) FROM logs
UNION ALL
SELECT 'patient_accounts', COUNT(*) FROM patient_accounts;

-- Check enum values
SELECT unnest(enum_range(NULL::role)) as role_values;
SELECT unnest(enum_range(NULL::gender)) as gender_values;
SELECT unnest(enum_range(NULL::status)) as status_values;
```

### 8. Update Application Configuration

Update your `.env` file:

```bash
# Old MySQL connection
# DATABASE_URL=mysql://cliniccore_user:cliniccore_pass@localhost:3306/cliniccore

# New PostgreSQL connection
DATABASE_URL=postgresql://cliniccore_user:cliniccore_pass@localhost:5432/cliniccore
```

### 9. Test Application

Start the application and test all functionality:

```bash
# Development
pnpm dev

# Or production
docker-compose --profile prod up -d
```

## Key Changes Made

### Schema Changes
- `mysqlTable` → `pgTable`
- `int().autoincrement()` → `serial()`
- `mysqlEnum` → `pgEnum` (defined separately)
- `int("isActive").default(1)` → `boolean("isActive").default(true)`
- Removed `onUpdateNow()` (PostgreSQL handles this differently)

### Database Driver Changes
- `drizzle-orm/mysql2` → `drizzle-orm/postgres-js`
- `mysql2` → `postgres` (postgres-js)
- `onDuplicateKeyUpdate` → `onConflictDoUpdate`

### Docker Changes
- `mysql:8.0` → `postgres:16-alpine`
- Port `3306` → `5432`
- Environment variables updated
- Health check updated

## Troubleshooting

### Connection Issues
```bash
# Test PostgreSQL connection
psql -h localhost -p 5432 -U cliniccore_user -d cliniccore

# Check if PostgreSQL is running
docker-compose ps database
```

### Migration Issues
```bash
# Reset database (WARNING: This will delete all data)
docker-compose down -v
docker-compose --profile dev up -d database
pnpm db:push
```

### Data Type Issues
- Check for any remaining MySQL-specific syntax in queries
- Verify boolean values are properly converted
- Check date/time formats

## Performance Considerations

PostgreSQL offers several advantages over MySQL:
- Better JSON support
- More advanced indexing options
- Better concurrent performance
- More SQL standard compliance

Consider adding indexes for better performance:

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);
CREATE INDEX idx_visit_notes_patient ON visit_notes(patient_id);
```

## Rollback Plan

If you need to rollback to MySQL:

1. Keep your MySQL data backup
2. Revert the code changes using git
3. Restore the MySQL Docker container
4. Import your MySQL backup

```bash
# Rollback steps
git checkout HEAD~1  # or specific commit
docker-compose down -v
# Update docker-compose.yml back to MySQL
docker-compose --profile dev up -d database
mysql -u cliniccore_user -p cliniccore < mysql_data.sql
```