// sidebar.tsx
import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building,
  FileText,
  ChevronDown,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: BarChart3,
    // submenu: [
    //   { key: "overview", label: "Overview", icon: BarChart3 },
    //   { key: "analytics", label: "Analytics", icon: TrendingUp },
    //   { key: "reports", label: "Reports", icon: FileText },
    // ],
  },
  {
    name: "Supplier Profile",
    href: "/supplier-profile",
    icon: Building,
    submenu: [
      { key: "business", label: "Business Profile", icon: Building },
      { key: "score", label: "Score", icon: BarChart3 },
      {
        key: "qualification",
        label: "Qualification Criteria",
        icon: CheckCircle,
      },
      {
        key: "financePerformance",
        label: "Finance Performance",
        icon: TrendingUp,
      },
      { key: "financialTable", label: "Financial Table", icon: FileText },
      { key: "icTable", label: "Income Statement", icon: FileText },
    ],
  },
  {
    name: "Credit Decision Intelligence",
    href: "/credit-report",
    icon: FileText,
    submenu: [
      { key: "score", label: "Score", icon: BarChart3 },
      { key: "risk", label: "Risk Assessment", icon: AlertTriangle },
      { key: "buyer", label: "Buyer Performance", icon: Users },
      { key: "monitoring", label: "Risk Monitoring", icon: TrendingUp },
      { key: "postFactoring", label: "Post-Factoring", icon: FileText },
      { key: "pricing", label: "Pricing", icon: BarChart3 },
      { key: "recommendation", label: "Recommendation", icon: FileText },
    ],
  },
];

export default function Sidebar() {
  const [location, navigate] = useLocation();
  const [hash, setHash] = useState<string>(() => window.location.hash);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(
    // new Set(["Credit Decision Intelligence"])
    new Set()
  );

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const scrollToId = (id: string) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) {
        setTimeout(() => {
          const retryEl = document.getElementById(id);
          if (retryEl) {
            retryEl.scrollIntoView({ behavior: "smooth", block: "start" });
            window.scrollBy({
              top: -80,
              left: 0,
              behavior: "instant" as ScrollBehavior,
            });
          }
        }, 200);
        return;
      }
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollBy({
        top: -80,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
    }, 100);
  };

  const toggleMenu = (menuName: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuName)) {
      newExpanded.delete(menuName);
    } else {
      newExpanded.add(menuName);
    }
    setExpandedMenus(newExpanded);
  };

  const handleSubmenuClick = (
    href: string,
    sectionId: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    navigate(href);

    setTimeout(() => {
      window.location.hash = sectionId;

      const hashChangeEvent = new HashChangeEvent("hashchange", {
        oldURL: window.location.href.split("#")[0],
        newURL: window.location.href,
      });
      window.dispatchEvent(hashChangeEvent);

      // Scroll to section
      scrollToId(sectionId);
    }, 50);
  };

  const getCurrentPage = () => {
    if (location === "/") return "Dashboard";
    if (location.startsWith("/supplier-profile")) return "Supplier Profile";
    if (location.startsWith("/credit-report"))
      return "Credit Decision Intelligence";
    return "";
  };

  const currentPage = getCurrentPage();
  const activeHash = (hash || "#overview").replace("#", "");

  return (
    <nav className="w-64 bg-white shadow-sm h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-slate-900">FinFlow</h1>
          <p className="text-sm text-slate-500">Credit Intelligence Platform</p>
        </div>

        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = currentPage === item.name;
            const isExpanded = expandedMenus.has(item.name);
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            return (
              <li key={item.name}>
                <div className="flex items-center">
                  <Link href={item.href} className="flex-1">
                    <div
                      className={cn(
                        "flex items-center px-4 py-3 font-medium transition-all cursor-pointer",
                        isActive
                          ? "text-financial-primary border-l-4 border-financial-primary"
                          : "hover:text-financial-primary hover:bg-slate-50"
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span className="flex-1">{item.name}</span>
                    </div>
                  </Link>

                  {hasSubmenu && (
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={cn(
                        "p-1 rounded transition-transform",
                        isActive
                          ? "text-financial-primary"
                          : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isExpanded ? "transform rotate-180" : ""
                        )}
                      />
                    </button>
                  )}
                </div>

                {/* Submenu */}
                {hasSubmenu && isExpanded && (
                  <ul className="mt-2 ml-6 space-y-1 border-l-2 border-slate-100 pl-4">
                    {item.submenu.map((submenuItem) => {
                      const isSubmenuActive =
                        isActive && activeHash === submenuItem.key;

                      return (
                        <li key={submenuItem.key}>
                          <button
                            onClick={(e) => {
                              const submenuHref =
                                item.href === "/" ? "/" : item.href;
                              handleSubmenuClick(
                                submenuHref,
                                submenuItem.key,
                                e
                              );
                            }}
                            className="w-full"
                          >
                            <div
                              className={cn(
                                "flex items-center text-sm px-3 py-2 cursor-pointer transition-all group",
                                isSubmenuActive
                                  ? "text-financial-primary border-l-2 border-financial-primary"
                                  : "hover:text-financial-primary hover:bg-slate-50"
                              )}
                              style={{ textAlign: "left" }}
                            >
                              <span>{submenuItem.label}</span>
                              {isSubmenuActive && (
                                <div className="ml-auto w-2 h-2 bg-financial-primary"></div>
                              )}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
