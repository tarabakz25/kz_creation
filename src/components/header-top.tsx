import { Mail } from "lucide-react";
import { MenuHover } from "./gsap/menuHover";

export default function HeaderTop() {
  const items = [{ label: "profile" }, { label: "lab" }];

  return (
    <header className="w-full flex items-center justify-between py-6 px-16 font-futura_100 tracking-wider">
      <nav className="flex items-center gap-24">
        {items.map((i) => {
          return (
            <MenuHover
              key={i.label}
              href={`/${i.label}`}
              className="text-xl font-medium text-white px-1"
            >
              {i.label}
            </MenuHover>
          );
        })}
      </nav>

      <MenuHover href="/contact" className="flex gap-2">
        <Mail className="w-6 h-auto text-white" />
        <p className="text-xl font-medium text-white px-1">Contact</p>
      </MenuHover>
    </header>
  );
}
