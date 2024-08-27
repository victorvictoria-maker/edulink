"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import EditPopover from "@/components/EditPopover";
import { User } from "../../../../../types";
import { ProfileUpdateSchema } from "../../../../../schemas";
import {
  fetchUserDetailsByEmail,
  updateUserProfile,
} from "@/serveractions/student";
import { toast } from "react-toastify";

function ProfilePage({ email }: { email: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await fetchUserDetailsByEmail(email);
        if (userDetails) {
          setUser(userDetails);
        } else {
          toast.error("Failed to load your profile details.");
        }
      } catch (error) {
        toast.error("Error fetching your profile details.");
      }
    };

    fetchUserDetails();
  }, [email]);

  const { register, handleSubmit } = useForm<
    z.infer<typeof ProfileUpdateSchema>
  >({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      department: user?.department || "",
      matricNo: user?.matricNo || "",
    },
  });

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const handleProfileUpdate = async (
    data: z.infer<typeof ProfileUpdateSchema>
  ) => {
    startTransition(async () => {
      try {
        const result = await updateUserProfile(data);
        if (result.error) {
          toast.error(result.error);
          // Revert the optimistic update if the update failed
          setUser(user);
        } else {
          toast.success(result.success);
          // Optimistically update the UI
          const updatedUser: User = {
            ...user!,
            ...data,
          };
          setUser(updatedUser);

          handleEditClose();
          // Optionally refetch user details after successful update
          const refreshedUser = await fetchUserDetailsByEmail(email);
          setUser(refreshedUser);
        }
      } catch (err) {
        toast.error("Failed to update profile.");
        // Revert the optimistic update if the update failed
        setUser(user);
      }
    });
  };

  if (!user) {
    return <p>Loading your details...</p>;
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Profile</h2>
      <div className='mb-4'>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Department:</strong> {user.department}
        </p>
      </div>
      <Button onClick={handleEditOpen} disabled={isPending}>
        {isPending ? "Loading..." : "Edit Profile"}
      </Button>
      {isEditOpen && (
        <EditPopover
          user={user}
          onClose={handleEditClose}
          onProfileUpdated={handleProfileUpdate}
        />
      )}
    </div>
  );
}

export default ProfilePage;
