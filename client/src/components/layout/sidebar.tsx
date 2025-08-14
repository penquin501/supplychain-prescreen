import { useLocation } from "wouter";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { BarChart3, Building, FileText } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Supplier Profile", href: "/supplier-profile", icon: Building },
  { name: "Credit Report", href: "/credit-report", icon: FileText },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <nav className="w-64 bg-white shadow-sm h-screen sticky top-0">
      <div className="p-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div
                    className={cn(
                      "flex items-center px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer",
                      isActive
                        ? "text-financial-primary bg-blue-50"
                        : "text-slate-600 hover:text-financial-primary hover:bg-slate-50"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
