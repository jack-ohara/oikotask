"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { FaListCheck, FaUsers, FaCalendarCheck } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";

type NavItemProps = {
  href: string;
  Icon: IconType;
  label: string;
};

const activeRouteMap: Record<string, string> = {
  "/add-todo": "/",
};

function NavItem({ href, Icon, label }: NavItemProps) {
  const pathname = usePathname();
  const isActive = href === pathname || activeRouteMap[pathname] === href;

  return (
    <li className="basis-0 grow">
      <Link
        href={href}
        className={`flex flex-col items-center gap-1 ${
          isActive ? "text-primary-green" : ""
        }`}
      >
        <Icon size={22} />
        <h4 className="font-bold text-sm">{label}</h4>
      </Link>
    </li>
  );
}

export function Navigation() {
  return (
    <nav>
      <ul className="flex justify-around items-start">
        <NavItem href="/" Icon={FaListCheck} label="ToDo list" />
        <NavItem href="/schedule" Icon={FaCalendarCheck} label="Schedule" />
        <NavItem href="/household" Icon={FaUsers} label="Household" />
        <NavItem href="/settings" Icon={IoIosSettings} label="Settings" />
      </ul>
    </nav>
  );
}
