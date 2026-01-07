import { GithubIcon } from "lucide-react";

interface HeaderProps {
  onNavigate?: (page: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const items = [{ label: "profile" }, { label: "lab" }, { label: "contact" }];

  const handleItemClick = (label: string) => {
    if (onNavigate) {
      onNavigate(label);
    }
  };

  return (
    <header className="w-full flex items-center justify-between py-6 px-16 font-comma">
      <nav className="flex items-center gap-24">
        {items.map((i) => {
          return (
            <button
              key={i.label}
              className="group"
              onClick={() => handleItemClick(i.label)}
            >
              <span className="text-lg text-white cursor-pointer hover:opacity-70 transition-opacity">
                {i.label}
              </span>
            </button>
          );
        })}
      </nav>

      <a
        href="https://github.com/tarabakz25/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
      >
        <GithubIcon className="w-6 h-auto text-white" />
        <span className="text-lg text-white cursor-pointer">Github</span>
      </a>
    </header>
  );
}
