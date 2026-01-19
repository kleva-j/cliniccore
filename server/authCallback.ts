/**
 * OAuth callback handler for Supabase authentication
 * Handles the OAuth redirect from providers like Google, GitHub
 */

import type { Express, Request, Response } from "express";

import { exchangeCodeForSession, createSupabaseClient } from "./_core/supabase";
import { ENV } from "./_core/env";

export function registerAuthCallbackRoutes(app: Express) {
  /**
   * Main OAuth callback endpoint
   * Exchanges authorization code for session and redirects to app
   */
  app.get("/auth/callback", async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const next = req.query.next as string | undefined;

    if (!code) {
      res.status(400).json({ error: "Authorization code missing" });
      return;
    }

    try {
      // Exchange code for session - this will set cookies automatically
      await exchangeCodeForSession(req, res, code);

      // Redirect to app or specified next page
      const redirectUrl = next || ENV.publicAppUrl;
      console.log(`[Auth Callback] Redirecting to: ${redirectUrl}`);
      res.redirect(302, redirectUrl);
    } catch (error) {
      console.error("[Auth Callback] Error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  /**
   * Auth confirmation page (optional - shown when email confirmation is required)
   */
  app.get("/auth/confirm", async (req: Request, res: Response) => {
    const { type, token_hash, access_token } = req.query;

    if (access_token) {
      // Auto-confirm with access token
      const supabase = createSupabaseClient(req, res);
      const { error } = await supabase.auth.setSession({
        access_token: access_token as string,
        refresh_token: (req.query.refresh_token as string) || "",
      });

      if (error) {
        console.error("[Auth Confirm] Session error:", error);
      }
    }

    // Show confirmation page
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Confirmed</title>
          <style>
            body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; text-align: center; }
            .success { color: #10b981; }
          </style>
        </head>
        <body>
          <h1 class="success">✓ Authentication Successful</h1>
          <p>You have been successfully authenticated.</p>
          <p>You can close this window and return to the application.</p>
          <script>
            // Notify parent window if embedded in iframe
            if (window.opener) {
              window.opener.postMessage({ type: 'auth-success' }, '*');
            }
            // Auto-close after 2 seconds
            setTimeout(() => window.close(), 2000);
          </script>
        </body>
      </html>
    `);
  });

  /**
   * Recovery callback (password reset)
   */
  app.get("/auth/recovery", async (req: Request, res: Response) => {
    const { code } = req.query;

    if (!code) {
      res.status(400).json({ error: "Recovery code missing" });
      return;
    }

    try {
      const supabase = createSupabaseClient(req, res);
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        code as string
      );

      if (error) {
        console.error("[Auth Recovery] Error:", error);
        throw error;
      }

      // Redirect to reset password page with session
      res.redirect(
        302,
        `${ENV.publicAppUrl}/reset-password?access_token=${data.session?.access_token}`
      );
    } catch (error) {
      console.error("[Auth Recovery] Error:", error);
      res.status(500).json({ error: "Password recovery failed" });
    }
  });
}
