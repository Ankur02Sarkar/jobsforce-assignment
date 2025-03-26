"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Logo } from "./logo";
import { SignedIn, SignedOut, useClerk, UserButton } from "@clerk/nextjs";

const menuItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Profile", href: "/profile" },
  { name: "AI Interview", href: "/interview" },
  { name: "JobBoard", href: "/jobboard" },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const clerk = useClerk();
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className={cn(
                  "flex items-center space-x-2",
                  pathname === "/" && "font-medium text-primary"
                )}
              >
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block duration-150 relative group",
                        pathname === item.href
                          ? "font-medium text-primary"
                          : "text-muted-foreground hover:text-accent-foreground"
                      )}
                    >
                      <span>{item.name}</span>
                      <span 
                        className={cn(
                          "absolute -bottom-1 left-0 h-0.5 bg-primary transform origin-left transition-all duration-300",
                          pathname === item.href 
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        )}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block duration-150 relative group",
                          pathname === item.href
                            ? "font-medium text-primary"
                            : "text-muted-foreground hover:text-accent-foreground"
                        )}
                      >
                        <span>{item.name}</span>
                        <span 
                          className={cn(
                            "absolute -bottom-1 left-0 h-0.5 bg-primary transform origin-left transition-all duration-300",
                            pathname === item.href 
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          )}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <SignedOut>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className={cn(isScrolled && "lg:hidden")}
                    onClick={() => clerk.openSignIn()}
                  >
                    <Link href="#">
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className={cn(isScrolled && "lg:hidden")}
                    onClick={() => clerk.openSignUp()}
                  >
                    <Link href="#">
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                </SignedOut>

                <Button
                  asChild
                  size="sm"
                  className={cn(isScrolled ? "lg:inline-flex" : "hidden")}
                >
                  <Link href="#">
                    <span>Get Started</span>
                  </Link>
                </Button>

                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
