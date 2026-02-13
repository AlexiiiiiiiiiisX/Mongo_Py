"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { UserForm } from "@/components/user-form";
import { DeleteConfirm } from "@/components/delete-confirm";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  Loader2,
  AlertCircle,
  Database,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

export function UserList() {
  const { data: users, error, isLoading, mutate } = useSWR<User[]>("/api/users", fetcher);

  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  function handleCreate() {
    setEditUser(null);
    setFormOpen(true);
  }

  function handleEdit(user: User) {
    setEditUser(user);
    setFormOpen(true);
  }

  function handleFormSuccess() {
    mutate();
    setEditUser(null);
  }

  function handleDeleteSuccess() {
    mutate();
    setDeleteUser(null);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-destructive">
          Failed to load users. Check your MongoDB connection.
        </p>
        <Button variant="outline" size="sm" onClick={() => mutate()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {users?.length ?? 0} user{users?.length !== 1 ? "s" : ""} in
              database
            </p>
          </div>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New User
        </Button>
      </div>

      {/* User list */}
      {!users || users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 gap-3">
          <Users className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No users yet</p>
          <Button variant="outline" size="sm" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create your first user
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="group flex items-center justify-between rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-accent/50"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate font-mono">
                  {user.email}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(user)}
                  aria-label={`Edit ${user.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteUser(user)}
                  aria-label={`Delete ${user.name}`}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit dialog */}
      <UserForm
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editUser}
        onSuccess={handleFormSuccess}
      />

      {/* Delete confirmation */}
      {deleteUser && (
        <DeleteConfirm
          open={!!deleteUser}
          onOpenChange={(open) => {
            if (!open) setDeleteUser(null);
          }}
          userId={deleteUser.id}
          userName={deleteUser.name}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
