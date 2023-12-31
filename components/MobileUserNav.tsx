import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui//button";

import {
  ExitIcon,
  PersonIcon,
  HamburgerMenuIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";

import { signOut, useSession } from "next-auth/react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateProfile } from "@/app/actions";
import MenuThemeToggle from "./menu-theme-toggle";

export default function MobileUserNav({
  user,
}: {
  user: {
    name?: string | null | undefined;
    username?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session, status, update } = useSession();

  const formSchema = z.object({
    email: z.string().email(),
    username: z
      .string()
      .min(5)
      .max(25)
      .refine((s) => !s.includes(" "), "No Spaces Allowed!"),
    name: z.string().includes(" ").min(5).max(25),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email ?? "",
      username: user?.username ?? "",
      name: user?.name ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const { email, username, name } = values;

    if (!username || !name) return;

    await updateProfile(email, username, name);
    await update({
      ...session,
      user: { ...session?.user, username, name },
    });

    setIsOpen(false);
  }

  return (
    <>
      <DropdownMenu onOpenChange={() => setIsDropdownOpen(!isDropdownOpen)}>
        <DropdownMenuTrigger asChild>
          <Button variant="link" type="button" size="icon">
            {isDropdownOpen ? (
              <Cross1Icon className="w-5 h-5" />
            ) : (
              <HamburgerMenuIcon className="w-6 h-6" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            {!user?.username ? (
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm leading-none">@{user?.username}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => setIsOpen(true)}
            className="cursor-pointer"
          >
            <PersonIcon className="w-4 h-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <MenuThemeToggle />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="cursor-pointer"
          >
            <ExitIcon className="w-4 h-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>
              View and edit your profile information.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormDescription>
                      This is your private email address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username..."
                        {...field}
                        required={false}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public username.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name..."
                        {...field}
                        required={false}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your private full name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4 flex gap-2.5 sm:gap-0 flex-col">
                <Button type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Loading..." : "Update"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
