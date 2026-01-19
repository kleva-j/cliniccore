/**
 * Client-side Supabase Storage utilities
 * Uses Supabase browser client for file operations
 */

import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, string>;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  bucket = "clinic-documents",
  folder = "uploads"
): Promise<{ key: string; url: string }> {
  const filePath = `${folder}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    console.error("[Storage] Upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    key: data.path,
    url: urlData.publicUrl,
  };
}

/**
 * Get a signed download URL for a file
 */
export async function getDownloadUrl(
  key: string,
  bucket = "clinic-documents",
  expiresIn = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(key, expiresIn);

  if (error) {
    console.error("[Storage] Get download URL error:", error);
    throw new Error(`Failed to get download URL: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Delete files from Supabase Storage
 */
export async function deleteFile(
  key: string,
  bucket = "clinic-documents"
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([key]);

  if (error) {
    console.error("[Storage] Delete error:", error);
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Delete multiple files from Supabase Storage
 */
export async function deleteFiles(
  keys: string[],
  bucket = "clinic-documents"
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove(keys);

  if (error) {
    console.error("[Storage] Delete files error:", error);
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * List files in a folder
 */
export async function listFiles(
  bucket = "clinic-documents",
  folder = "",
  limit = 100
): Promise<StorageFile[]> {
  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    limit,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    console.error("[Storage] List error:", error);
    throw new Error(`Failed to list files: ${error.message}`);
  }

  return data || [];
}

/**
 * Check if a file exists
 */
export async function fileExists(
  key: string,
  bucket = "clinic-documents"
): Promise<boolean> {
  try {
    const { data } = await supabase.storage.from(bucket).download(key);
    return !!data;
  } catch {
    return false;
  }
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(key: string, bucket = "clinic-documents"): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(key);
  return data.publicUrl;
}

/**
 * React hook to get a file URL that refreshes when the key changes
 */
export function useFileUrl(
  key: string | null,
  bucket = "clinic-documents"
): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!key) {
      setUrl(null);
      return;
    }

    getDownloadUrl(key, bucket)
      .then(setUrl)
      .catch(err => {
        console.error("[useFileUrl] Error:", err);
        setUrl(null);
      });
  }, [key, bucket]);

  return url;
}

/**
 * React hook to list files in a folder
 */
export function useFileList(
  bucket = "clinic-documents",
  folder = ""
): { files: StorageFile[]; loading: boolean; error: Error | null } {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    listFiles(bucket, folder)
      .then(setFiles)
      .catch(err =>
        setError(err instanceof Error ? err : new Error(String(err)))
      )
      .finally(() => setLoading(false));
  }, [bucket, folder]);

  return { files, loading, error };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

/**
 * Check if file type is allowed
 */
export function isFileTypeAllowed(
  filename: string,
  allowedTypes: string[] = ["jpg", "jpeg", "png", "pdf", "doc", "docx"]
): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return allowedTypes.includes(ext);
}
