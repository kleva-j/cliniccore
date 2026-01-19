/**
 * Server-side Supabase Storage integration
 * Uses Supabase Storage for file uploads, downloads, and management
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "./env";

export interface UploadResult {
  key: string;
  url: string;
}

export interface DownloadResult {
  key: string;
  url: string;
  data?: ArrayBuffer;
}

// Server-side storage client with service role
let supabaseAdmin: SupabaseClient | null = null;

/**
 * Get or create the Supabase admin client with service role key
 */
function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    if (!ENV.supabaseUrl || !ENV.supabaseServiceKey) {
      throw new Error("Supabase not configured. Check environment variables.");
    }

    supabaseAdmin = createClient(ENV.supabaseUrl, ENV.supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log("[SupabaseStorage] Admin client initialized");
  }
  return supabaseAdmin;
}

/**
 * Upload a file to Supabase Storage
 */
export async function storageUpload(
  bucket: string,
  path: string,
  file: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<UploadResult> {
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error("[SupabaseStorage] Upload error:", error.message);
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    console.log(`[SupabaseStorage] Uploaded: ${data.path}`);

    return {
      key: data.path,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error("[SupabaseStorage] Upload exception:", error);
    throw error;
  }
}

/**
 * Get a signed download URL for a file
 */
export async function storageGetDownloadUrl(
  bucket: string,
  path: string,
  expiresIn = 3600 // 1 hour default
): Promise<string> {
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error("[SupabaseStorage] Get download URL error:", error.message);
      throw new Error(`Failed to get download URL: ${error.message}`);
    }

    return data.signedUrl;
  } catch (error) {
    console.error("[SupabaseStorage] Get download URL exception:", error);
    throw error;
  }
}

/**
 * Delete files from Supabase Storage
 */
export async function storageDelete(
  bucket: string,
  paths: string[]
): Promise<void> {
  const supabase = getSupabaseAdmin();

  try {
    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) {
      console.error("[SupabaseStorage] Delete error:", error.message);
      throw new Error(`Failed to delete files: ${error.message}`);
    }

    console.log(`[SupabaseStorage] Deleted: ${paths.join(", ")}`);
  } catch (error) {
    console.error("[SupabaseStorage] Delete exception:", error);
    throw error;
  }
}

/**
 * List files in a folder
 */
export async function storageList(
  bucket: string,
  folderPath = ""
): Promise<Array<{ name: string; id: string; updated_at: string }>> {
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folderPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error("[SupabaseStorage] List error:", error.message);
      throw new Error(`Failed to list files: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("[SupabaseStorage] List exception:", error);
    throw error;
  }
}

/**
 * Get file metadata
 */
export async function storageGetMetadata(
  bucket: string,
  path: string
): Promise<{
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, string>;
} | null> {
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path.split("/").slice(0, -1).join("/") || "", {
        limit: 1,
        search: path.split("/").pop() || "",
      });

    if (error || !data || data.length === 0) {
      return null;
    }

    return data[0] as any;
  } catch (error) {
    console.error("[SupabaseStorage] Get metadata exception:", error);
    return null;
  }
}

/**
 * Copy a file within Supabase Storage
 */
export async function storageCopy(
  bucket: string,
  fromPath: string,
  toPath: string
): Promise<string> {
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .copy(fromPath, toPath);

    if (error) {
      console.error("[SupabaseStorage] Copy error:", error.message);
      throw new Error(`Failed to copy file: ${error.message}`);
    }

    console.log(`[SupabaseStorage] Copied: ${fromPath} -> ${toPath}`);
    return data.path;
  } catch (error) {
    console.error("[SupabaseStorage] Copy exception:", error);
    throw error;
  }
}

/**
 * Move a file within Supabase Storage
 */
export async function storageMove(
  bucket: string,
  fromPath: string,
  toPath: string
): Promise<string> {
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .move(fromPath, toPath);

    if (error) {
      console.error("[SupabaseStorage] Move error:", error.message);
      throw new Error(`Failed to move file: ${error.message}`);
    }

    console.log(`[SupabaseStorage] Moved: ${fromPath} -> ${toPath}`);
    return data.message;
  } catch (error) {
    console.error("[SupabaseStorage] Move exception:", error);
    throw error;
  }
}

/**
 * Check if a file exists
 */
export async function storageExists(
  bucket: string,
  path: string
): Promise<boolean> {
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path.split("/").slice(0, -1).join("/") || "", {
        limit: 1,
        search: path.split("/").pop() || "",
      });

    return !error && data && data.length > 0;
  } catch (error) {
    console.error("[SupabaseStorage] Exists check exception:", error);
    return false;
  }
}

/**
 * Get the bucket information
 */
export async function getBucketInfo(bucket: string): Promise<{
  id: string;
  name: string;
  public: boolean;
  created_at: string;
  updated_at: string;
} | null> {
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase.storage.getBucket(bucket);

    if (error) {
      console.error("[SupabaseStorage] Get bucket info error:", error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error("[SupabaseStorage] Get bucket info exception:", error);
    return null;
  }
}
