"use client";
import * as React from "react";
import { GalleryVerticalEnd, HandPlatter } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Member",
      url: "/member/dashboard",
      items: [
        {
          title: "Member DashBoard",
          url: "/member/dashboard",
        },
        {
          title: "View Mess",
          url: "/member/view-mess",
        },
        {
          title: "Manage Bazar",
          url: "/member/manage-bazar",
        },
      ],
    },
    {
      title: "Back Home",
      url: "/",
    },
  ],
};

export function MemberAppSideBar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const path = usePathname();
  // console.log(path);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <HandPlatter className="size-6"></HandPlatter>
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Kartify</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url} className="font-medium">
                    {item.title}
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={item.url === path}
                        >
                          <Link href={item.url}>{item.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
