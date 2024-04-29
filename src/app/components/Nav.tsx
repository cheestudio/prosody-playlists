import { Navbar, NavbarContent, NavbarItem, Link, Switch } from "@nextui-org/react";
import { IconRestore } from '@tabler/icons-react';
import DarkMode from "./DarkMode";

const AppNav = () => {
  return (
    <Navbar
      classNames={{
        content: "w-full"
      }}
    >
      <NavbarContent
        justify="center"
      >
        <NavbarItem>
          <Link href="/">
            <IconRestore />
          </Link>
        </NavbarItem>
        <NavbarItem
          className="mr-0 ml-auto"
        >
          <DarkMode />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default AppNav;

