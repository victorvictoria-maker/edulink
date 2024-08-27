"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { createAvailability } from "@/serveractions/admin";
import { AvailabilitySchema } from "../../../../../schemas";
import Link from "next/link";

// Define the schema
// const AvailabilitySchema = z.object({
//   slots: z.array(
//     z.object({
//       day: z.enum([
//         "MONDAY",
//         "TUESDAY",
//         "WEDNESDAY",
//         "THURSDAY",
//         "FRIDAY",
//         "SATURDAY",
//         "SUNDAY",
//       ]),
//       startTime: z.string(),
//       endTime: z.string(),
//     })
//   ),
// });

type AvailabilityFormType = z.infer<typeof AvailabilitySchema>;

const SetAvailability = () => {
  const { control, handleSubmit, reset } = useForm<AvailabilityFormType>({
    resolver: zodResolver(AvailabilitySchema),
    defaultValues: {
      slots: [{ day: "MONDAY", startTime: "", endTime: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "slots",
  });

  const onSubmitForm = async (values: AvailabilityFormType) => {
    try {
      await createAvailability(values);

      toast.success("Availability set successfully!");
      reset({
        slots: [{ day: "MONDAY", startTime: "", endTime: "" }],
      });
    } catch (error) {
      toast.error("Failed to set availability.");
    }
  };

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Set Availability</h2>
      <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-4'>
        {fields.map((field, index) => (
          <div key={field.id} className='space-y-4'>
            <Controller
              name={`slots.${index}.day`}
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-full'>
                    {field.value || "Select Day"}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='MONDAY'>Monday</SelectItem>
                    <SelectItem value='TUESDAY'>Tuesday</SelectItem>
                    <SelectItem value='WEDNESDAY'>Wednesday</SelectItem>
                    <SelectItem value='THURSDAY'>Thursday</SelectItem>
                    <SelectItem value='FRIDAY'>Friday</SelectItem>
                    <SelectItem value='SATURDAY'>Saturday</SelectItem>
                    <SelectItem value='SUNDAY'>Sunday</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name={`slots.${index}.startTime`}
              control={control}
              render={({ field }) => <Input type='time' {...field} />}
            />
            <Controller
              name={`slots.${index}.endTime`}
              control={control}
              render={({ field }) => <Input type='time' {...field} />}
            />
            <Button
              type='button'
              onClick={() => remove(index)}
              variant='destructive'
            >
              Remove Slot
            </Button>
          </div>
        ))}
        <div className='flex flex-col md:flex-row  gap-2'>
          <Button
            type='button'
            onClick={() =>
              append({ day: "MONDAY", startTime: "", endTime: "" })
            }
            variant='default'
          >
            Add Another Slot
          </Button>
          <Button type='submit'>Save Availability</Button>
          <Link href='/admin'>
            <Button>Go to dashboard</Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SetAvailability;
