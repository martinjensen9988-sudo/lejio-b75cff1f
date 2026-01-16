import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Car,
  Calendar,
  CalendarDays,
  Receipt,
  Users,
  Heart,
  Repeat,
  Wrench,
  CircleDot,
  Shield,
  AlertCircle,
  BarChart3,
  Sparkles,
  Truck,
  TrendingDown,
  MapPin,
  MessageCircle,
  FileText,
  Search,
  Settings,
  LogOut,
  Home,
  Building2,
  Gift,
  Bike,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import LejioLogo from "@/components/LejioLogo";

interface MenuItem {
  label: string;
  icon: React.ElementType;
  value: string;
  badge?: number;
}

interface MenuGroup {
  title: string;
  icon: React.ElementType;
  items: MenuItem[];
  defaultOpen?: boolean;
}

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount?: number;
  pendingBookings?: number;
  onSignOut: () => void;
}

export const DashboardSidebar = ({
  activeTab,
  onTabChange,
  unreadCount = 0,
  pendingBookings = 0,
  onSignOut,
}: DashboardSidebarProps) => {
  const navigate = useNavigate();

  const menuGroups: MenuGroup[] = [
    {
      title: "Overblik",
      icon: Home,
      defaultOpen: true,
      items: [
        { label: "Mine biler", icon: Car, value: "vehicles" },
        { label: "Kalender", icon: CalendarDays, value: "calendar" },
        { label: "Bookinger", icon: Calendar, value: "bookings", badge: pendingBookings },
      ],
    },
    {
      title: "Økonomi",
      icon: Receipt,
      items: [
        { label: "Fakturaer", icon: Receipt, value: "invoices" },
        { label: "Bøder", icon: AlertCircle, value: "fines" },
        { label: "Tabt indtægt", icon: TrendingDown, value: "revenue-loss" },
      ],
    },
    {
      title: "Kunder",
      icon: Users,
      items: [
        { label: "Kundesegmenter", icon: Users, value: "customers" },
        { label: "Favoritter", icon: Heart, value: "favorites" },
        { label: "Abonnementer", icon: Repeat, value: "recurring" },
      ],
    },
    {
      title: "Værksted & Service",
      icon: Wrench,
      items: [
        { label: "Service", icon: Wrench, value: "service" },
        { label: "Dæk", icon: CircleDot, value: "tires" },
        { label: "Syn", icon: Shield, value: "inspections" },
      ],
    },
    {
      title: "AI & Analytics",
      icon: Sparkles,
      items: [
        { label: "Analytics", icon: BarChart3, value: "analytics" },
        { label: "AI Priser", icon: Sparkles, value: "ai-pricing" },
        { label: "Flåde AI", icon: Truck, value: "fleet-ai" },
      ],
    },
    {
      title: "Selvrisiko",
      icon: Shield,
      items: [
        { label: "Selvrisko-profiler", icon: Shield, value: "deductibles" },
      ],
    },
  ];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    menuGroups.forEach((group) => {
      if (group.defaultOpen || group.items.some((item) => item.value === activeTab)) {
        initial[group.title] = true;
      }
    });
    return initial;
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <LejioLogo size="sm" />
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-border space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => navigate("/search")}
        >
          <Search className="w-4 h-4 mr-2" />
          Find bil
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start relative"
          onClick={() => navigate("/messages")}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Beskeder
          {unreadCount > 0 && (
            <span className="absolute right-2 min-w-5 h-5 flex items-center justify-center text-xs font-bold bg-destructive text-destructive-foreground rounded-full px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => navigate("/gps")}
        >
          <MapPin className="w-4 h-4 mr-2" />
          GPS-sporing
        </Button>
      </div>

      {/* Menu Groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuGroups.map((group) => (
          <Collapsible
            key={group.title}
            open={openGroups[group.title]}
            onOpenChange={() => toggleGroup(group.title)}
          >
            <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <group.icon className="w-4 h-4" />
                <span>{group.title}</span>
              </div>
              {openGroups[group.title] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 mt-1 space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.value}
                  onClick={() => onTabChange(item.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors",
                    activeTab === item.value
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="min-w-5 h-5 flex items-center justify-center text-xs font-bold bg-accent text-accent-foreground rounded-full px-1">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => navigate("/my-rentals")}
        >
          <FileText className="w-4 h-4 mr-2" />
          Mine lejeaftaler
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => navigate("/settings")}
        >
          <Settings className="w-4 h-4 mr-2" />
          Indstillinger
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log ud
        </Button>
      </div>
    </div>
  );
};
