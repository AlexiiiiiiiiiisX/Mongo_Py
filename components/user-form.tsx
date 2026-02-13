"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSuccess: () => void;
}

export function UserForm({ open, onOpenChange, user, onSuccess }: UserFormProps) {
  const isEditing = !!user;
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset form when dialog opens with new data
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setName(user?.name ?? "");
      setEmail(user?.email ?? "");
      setPassword("");
      setError("");
    }
    onOpenChange(open);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isEditing ? `/api/users/${user.id}` : "/api/users";
      const method = isEditing ? "PUT" : "POST";

      const body: Record<string, string> = {};
      if (name) body.name = name;
      if (email) body.email = email;
      if (password) body.password = password;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      onSuccess();
      onOpenChange(false);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit User" : "Create New User"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the user information below. Leave password empty to keep it unchanged."
              : "Fill in the details to create a new user."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isEditing}
              autoComplete="name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={!isEditing}
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">
              Password{isEditing && " (leave empty to keep current)"}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={isEditing ? "Leave empty to keep current" : "Min. 6 characters"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isEditing}
              minLength={isEditing ? undefined : 6}
              autoComplete={isEditing ? "new-password" : "new-password"}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
