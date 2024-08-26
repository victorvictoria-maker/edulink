import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileUpdateSchema } from "../../schemas";

const EditPopover = ({
  user,
  onClose,
  onProfileUpdated,
}: {
  user: any;
  onClose: () => void;
  onProfileUpdated: (data: z.infer<typeof ProfileUpdateSchema>) => void;
}) => {
  const form = useForm<z.infer<typeof ProfileUpdateSchema>>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      department: user.department,
      matricNo: user.matricNo || "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data: z.infer<typeof ProfileUpdateSchema>) => {
    setIsSubmitting(true);
    onProfileUpdated(data);
    setIsSubmitting(false);
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={onClose}
      ></div>
      <div className='relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-10'>
        <h2 className='text-xl font-bold mb-4'>Edit Profile</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <Input {...form.register("name")} placeholder='Name' required />
          <Input
            {...form.register("email")}
            placeholder='Email'
            type='email'
            required
          />
          <Input
            {...form.register("department")}
            placeholder='Department'
            required
          />
          {user.role === "STUDENT" && (
            <Input
              {...form.register("matricNo")}
              placeholder='Matric No'
              required
            />
          )}
          <div className='flex space-x-4'>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPopover;
