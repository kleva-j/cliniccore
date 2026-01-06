# ClinicCore TODO

## Database & Schema
- [x] Create users table with role-based access control
- [x] Create doctors table with specialty and contact info
- [x] Create patients table with demographics
- [x] Create appointments table with status tracking
- [x] Create visit_notes table for clinical documentation
- [x] Create logs table for audit trail
- [x] Run database migrations

## Backend API (tRPC Procedures)
- [x] Implement auth procedures (login, logout, me)
- [x] Implement user management procedures (create, read, update, delete)
- [x] Implement doctor management procedures (CRUD)
- [x] Implement patient management procedures (CRUD, search)
- [x] Implement appointment procedures (create, update, cancel, list)
- [x] Implement visit notes procedures (create, read, update)
- [x] Implement logging procedures (audit trail)
- [x] Add role-based access control to all procedures

## Frontend Components
- [x] Design system setup (Scandinavian aesthetic, colors, typography)
- [x] Authentication pages (login)
- [x] Role-based dashboard layouts (Admin, Receptionist, Doctor)
- [x] User management pages (Admin only)
- [x] Doctor management pages (Admin only)
- [x] Patient registration form
- [x] Patient search and list view
- [x] Appointment scheduling form
- [x] Appointment list view
- [x] Visit notes form (Doctor only)
- [x] Audit logs view (Admin only)
- [x] Navigation and routing

## Testing & Validation
- [x] Write vitest tests for backend procedures
- [x] Test authentication flows
- [x] Test role-based access control
- [x] Test patient registration and search
- [x] Test appointment scheduling
- [x] Test visit notes creation and retrieval
- [x] All 27 tests passing

## Deployment & Delivery
- [x] Final status check
- [ ] Create checkpoint
- [ ] Deliver to user


## Patient Portal Feature
- [x] Add patient role to users table and extend schema
- [x] Create patient_accounts table for patient login credentials
- [x] Implement patient authentication procedures (login, register, logout)
- [x] Add patient appointment query procedures
- [x] Create patient login page
- [x] Create patient dashboard with appointment history
- [x] Create upcoming appointments view
- [x] Create appointment detail view with doctor information
- [x] Implement patient portal routing and protection
- [x] Write tests for patient portal features (12 tests passing)
- [x] All tests passing (39 total tests)
