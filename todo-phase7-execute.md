# Phase 7 Cleanup & Testing - TODO List

## Testing Phase
- [x] 1. Test authentication flows (login, register, OAuth, password reset)
- [x] 2. Test storage operations (upload, download, delete)
- [x] 3. Test role-based access control
- [x] 4. Verify patient portal works

## Cleanup Phase
- [x] 5. Delete `server/_core/oauth.ts`
- [x] 6. Delete `server/_core/sdk.ts`
- [x] 7. Delete `server/storage.ts`
- [x] 8. Update `server/_core/context.ts` - Remove legacy SDK fallback
- [x] 9. Update `api/index.ts` - Already clean, no changes needed
- [x] 10. Update `server/_core/env.ts` - Remove unused legacy env vars
- [x] 11. Update `server/db.ts` - Remove ownerOpenId admin logic

## Documentation Phase
- [x] 12. Update `todo-supabase-phase7.md` - Mark tasks complete
- [x] 13. Update `SUPABASE-MIGRATION-SUMMARY.md` - Mark Phase 7 complete
- [x] 14. Delete `PLAN-phase7.md` - Cleanup planning file

## Final Verification
- [x] 15. Verify application still works
- [x] 16. Test all tRPC procedures

