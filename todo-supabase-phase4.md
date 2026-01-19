# Supabase Migration - Phase 4: Storage Migration

## Phase 4 Tasks

### 4.1 Create Server-side Storage Client
- [ ] 4.1.1 Create `server/_core/supabaseStorage.ts` with admin client
- [ ] 4.1.2 Implement `storageUpload()` function
- [ ] 4.1.3 Implement `storageGetDownloadUrl()` function
- [ ] 4.1.4 Implement `storageDelete()` function
- [ ] 4.1.5 Implement `storageList()` function

### 4.2 Update Storage API Router
- [ ] 4.2.1 Add upload endpoint to routers.ts
- [ ] 4.2.2 Add getDownloadUrl endpoint
- [ ] 4.2.3 Add delete endpoint
- [ ] 4.2.4 Add role-based access control

### 4.3 Create Client-side Storage
- [ ] 4.3.1 Create `client/src/lib/storage.ts`
- [ ] 4.3.2 Implement uploadFile function
- [ ] 4.3.3 Implement getDownloadUrl function
- [ ] 4.3.4 Implement deleteFile function

### 4.4 Storage Migration
- [ ] 4.4.1 Create storage migration script
- [ ] 4.4.2 Test migration from old storage to Supabase

## Phase 4 Status: IN PROGRESS 🚧

## Implementation Details

### Server-side Storage Client
```typescript
// server/_core/supabaseStorage.ts
import { createClient } from '@supabase/supabase-js';

let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      process.env.PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return supabaseAdmin;
}

export async function storageUpload(bucket, path, file, contentType) { ... }
export async function storageGetDownloadUrl(bucket, path) { ... }
export async function storageDelete(bucket, paths) { ... }
export async function storageList(bucket, folderPath) { ... }
```

### Bucket Configuration
- **clinic-documents**: Public bucket for patient documents, reports, etc.

## Next Steps

After Phase 4 complete:
- Phase 5: Data Migration (migrate existing users)
- Phase 6: Testing & Cleanup
- Phase 7: Production Deployment
