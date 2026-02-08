"use client";

/**
 * Navbar Component
 * Modern dashboard navigation bar with user info and sign-out button
 * Uses consistent gradient logo with landing navbar
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth/useAuth";
import { Button } from "./Button";
import { Menu, X, LogOut, Settings } from "lucide-react";

export function Navbar() {
  const { user, signOut, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // Error is handled by auth context
    }
  };

  // Get user initials for avatar
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  const initials = getInitials(user?.name, user?.email);

  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-sidebar/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span
              className="text-xl font-bold"
              style={{
                color: "#4A4458",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Notely
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {user && (
              <>
                {/* User Info Card */}
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-sidebar border border-cards">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">
                      {initials}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-cards"></div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Link href="/profile">
                    <button
                      className="p-2 rounded-lg text-text-secondary hover:bg-sidebar/30 hover:text-primary transition-colors"
                      title="Profile settings"
                    >
                      <Settings size={20} />
                    </button>
                  </Link>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSignOut}
                    disabled={isLoading}
                    isLoading={isLoading}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-sidebar/30 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-text-primary" />
            ) : (
              <Menu size={24} className="text-text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-sidebar/50 bg-background/50 backdrop-blur-lg">
            <div className="px-4 py-6 space-y-4">
              {user && (
                <>
                  {/* Mobile User Info */}
                  <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm flex-shrink-0">
                      <span className="text-white text-sm font-bold">
                        {initials}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-sm font-semibold text-text-primary">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-text-secondary truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="border-t border-sidebar pt-4 space-y-2">
                    <Link href="/profile" className="block">
                      <button className="w-full px-3 py-2 rounded-lg text-left text-text-secondary hover:bg-primary/10 hover:text-primary font-medium transition-colors text-sm flex items-center gap-2">
                        <Settings size={16} />
                        Profile Settings
                      </button>
                    </Link>

                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      onClick={handleSignOut}
                      disabled={isLoading}
                      isLoading={isLoading}
                      className="flex items-center justify-center gap-2"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
