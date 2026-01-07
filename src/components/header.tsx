import { MapPinPlusInside, GithubIcon } from "lucide-react";

export default function Header() {
  const items = [
    { label: "Home", icon: MapPinPlusInside },
    { label: "About", icon: MapPinPlusInside },
    { label: "Contact", icon: MapPinPlusInside },
  ];

  return (
    <main className="w-full flex items-center justify-between py-6 px-16 font-comma">
      <div className="flex items-center gap-24">
        {items.map((i) => {
          return (
            <div key={i.label} className=""> 
              <span className="text-lg text-white cursor-pointer">{i.label}</span>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center">
        <GithubIcon className="w-6 h-auto text-white" />
        <span className="text-lg text-white cursor-pointer">Github</span>
      </div>
    </main>
  );
}
