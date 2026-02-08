"use client";

/**
 * Profile Page
 * User profile and sign-out
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/layout/Container";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ArrowLeftToLine } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, signOut, isLoading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!isAuthenticated || !user) {
    return null; // Middleware should redirect to signin
  }

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      // Redirect is handled by auth context
    } catch {
      setIsSigningOut(false);
    }
  };

  if (isLoading || isSigningOut) {
    return <LoadingSpinner message="Signing out..." fullscreen />;
  }

  return (
    <Container size="sm" className="py-8">
      <div className="space-y-8">
        {/* Profile Header */}
        <div>
          <h1
            className="text-3xl font-semibold"
            style={{
              color: "#4A4458",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Profile
          </h1>
          <p className="mt-2 text-text-secondary">Manage your account</p>
        </div>

        {/* Profile Information */}
        <div className="rounded-lg bg-background p-8 shadow-sm border border-cards space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Full Name
            </label>
            <p className="mt-1 text-lg text-text-primary">
              {user.name || "Not set"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Email Address
            </label>
            <p className="mt-1 text-lg text-text-primary">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">
              User ID
            </label>
            <p className="mt-1 font-mono text-sm text-text-secondary">{user.id}</p>
          </div>

          {user.createdAt && (
            <div>
              <label className="block text-sm font-medium text-text-secondary">
                Member Since
              </label>
              <p className="mt-1 text-lg text-text-primary">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Sign Out Section */}
          <div className="border-t border-cards pt-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Session
            </h2>
            <Button
              variant="danger"
              onClick={handleSignOut}
              disabled={isLoading}
              isLoading={isSigningOut}
            >
              Sign Out
            </Button>
            <p className="mt-2 text-sm text-text-secondary">
              This will end your current session and redirect you to the sign-in
              page.
            </p>
          </div>
        </div>

        {/* Back to Tasks */}
        <Button variant="secondary" onClick={() => router.push("/tasks")}>
          <ArrowLeftToLine />
          <span>Back to Tasks</span>
        </Button>
      </div>
    </Container>
  );
}
