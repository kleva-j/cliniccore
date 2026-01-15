-- PostgreSQL initialization script
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions that might be useful
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Set timezone
SET timezone = 'UTC';

-- Create indexes for better performance
-- These will be created after the schema is applied via Drizzle migrations

-- Note: The actual schema creation is handled by Drizzle migrations
-- This file is for any additional PostgreSQL-specific setup