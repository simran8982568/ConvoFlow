import React, { useState, useEffect, useRef } from "react";
import {
  RefreshCw,
  User,
  ChevronDown,
  Search,
  Building2,
  Users,
  Send,
  FileText,
  Settings,
  Globe,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authService } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { getUserAvatarPath } from "@/utils/assets";

interface UserHeaderProps {
  role: "admin" | "superadmin";
  onRefresh?: () => void;
  refreshing?: boolean;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

// Mock data for search suggestions
const mockBusinesses = [
  {
    id: "1",
    name: "TechCorp Solutions",
    email: "contact@techcorp.com",
    type: "business",
  },
  {
    id: "2",
    name: "Global Retail Co",
    email: "info@globalretail.com",
    type: "business",
  },
  {
    id: "3",
    name: "Digital Marketing Pro",
    email: "hello@digitalmarketing.com",
    type: "business",
  },
  {
    id: "4",
    name: "StartupXYZ",
    email: "team@startupxyz.com",
    type: "business",
  },
  {
    id: "5",
    name: "Creative Solutions",
    email: "support@creativesolutions.com",
    type: "business",
  },
];

const mockUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    type: "user",
    business: "TechCorp Solutions",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    type: "user",
    business: "Global Retail Co",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike.wilson@email.com",
    type: "user",
    business: "Digital Marketing Pro",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    type: "user",
    business: "StartupXYZ",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david.brown@email.com",
    type: "user",
    business: "Creative Solutions",
  },
];

// Mock data for admin search - Enhanced with new search items
const mockAdminData = [
  // Contacts
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    type: "contact",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1234567891",
    type: "contact",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1234567892",
    type: "contact",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+1234567893",
    type: "contact",
  },

  // Campaigns
  { id: "5", name: "Summer Sale Campaign", status: "active", type: "campaign" },
  {
    id: "6",
    name: "Black Friday Promotion",
    status: "draft",
    type: "campaign",
  },
  { id: "7", name: "New Year Special", status: "completed", type: "campaign" },

  // Templates
  { id: "8", name: "Welcome Message", category: "greeting", type: "template" },
  {
    id: "9",
    name: "Follow-up Template",
    category: "follow-up",
    type: "template",
  },
  {
    id: "10",
    name: "Order Confirmation",
    category: "transactional",
    type: "template",
  },
  {
    id: "11",
    name: "Promotional Offer",
    category: "marketing",
    type: "template",
  },

  // Settings
  {
    id: "12",
    name: "Account Settings",
    description: "Manage your account preferences",
    type: "settings",
  },
  {
    id: "13",
    name: "Notification Settings",
    description: "Configure notification preferences",
    type: "settings",
  },
  {
    id: "14",
    name: "Billing Settings",
    description: "Manage billing and subscription",
    type: "settings",
  },
  {
    id: "15",
    name: "API Settings",
    description: "Configure API keys and webhooks",
    type: "settings",
  },

  // Campaign Pages
  {
    id: "16",
    name: "Campaign Dashboard",
    description: "View all campaigns overview",
    type: "page",
  },
  {
    id: "17",
    name: "Create Campaign",
    description: "Create a new marketing campaign",
    type: "page",
  },
  {
    id: "18",
    name: "Campaign Analytics",
    description: "View campaign performance metrics",
    type: "page",
  },
];

const UserHeader: React.FC<UserHeaderProps> = ({
  role,
  onRefresh,
  refreshing = false,
  onToggleSidebar,
  isSidebarOpen = true,
}) => {
  const navigate = useNavigate();
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Define the user type to include 'avatar'
  interface CurrentUser {
    name?: string;
    email?: string;
    company?: string;
    avatar?: string;
  }
  const user: CurrentUser = authService.getCurrentUser();

  // Search functionality for both Admin and SuperAdmin
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Check screen size for tablet and mobile detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm.length > 0) {
      let results: any[] = [];

      if (role === "superadmin") {
        const filteredBusinesses = mockBusinesses.filter(
          (business) =>
            business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            business.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const filteredUsers = mockUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.business.toLowerCase().includes(searchTerm.toLowerCase())
        );

        results = [...filteredBusinesses, ...filteredUsers].slice(0, 8);
      } else {
        // Admin search functionality - Enhanced to search in more fields
        results = mockAdminData
          .filter(
            (item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (item.email &&
                item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (item.phone && item.phone.includes(searchTerm)) ||
              (item.description &&
                item.description
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())) ||
              (item.category &&
                item.category
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())) ||
              (item.status &&
                item.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
              item.type.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 8);
      }

      setSearchResults(results);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [searchTerm, role]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSelect = (item: any) => {
    if (role === "superadmin") {
      if (item.type === "business") {
        navigate("/superadmin/businesses");
      } else {
        navigate("/superadmin/businesses"); // Could navigate to user management page
      }
    } else {
      // Admin navigation - Enhanced with new types
      switch (item.type) {
        case "contact":
          navigate("/admin/contacts");
          break;
        case "campaign":
          navigate("/admin/campaigns");
          break;
        case "template":
          navigate("/admin/templates");
          break;
        case "settings":
          navigate("/admin/settings");
          break;
        case "page":
          // Handle specific page navigation based on item name
          if (item.name.includes("Campaign Dashboard")) {
            navigate("/admin/campaigns");
          } else if (item.name.includes("Create Campaign")) {
            navigate("/admin/campaigns?action=create");
          } else if (item.name.includes("Analytics")) {
            navigate("/admin/campaigns?tab=analytics");
          } else {
            navigate("/admin/dashboard");
          }
          break;
        default:
          navigate("/admin/dashboard");
      }
    }
    setSearchTerm("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleLogout = () => {
    authService.logout();
    navigate(role === "admin" ? "/admin/login" : "/superadmin/login");
  };

  const brandColor = role === "admin" ? "teal" : "purple";

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left side: Sidebar toggle button (desktop/tablet only) */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button - Only show on desktop and tablet, NOT mobile */}
          {!isMobile &&
            (isTablet || window.innerWidth >= 1024) &&
            onToggleSidebar && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>
            )}

          {/* Global Search - Available for both Admin and SuperAdmin */}
          <div className="flex-1 max-w-sm relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={
                  typeof window !== "undefined" && window.innerWidth < 640
                    ? "Search..."
                    : role === "superadmin"
                    ? "Search businesses or users..."
                    : "Search contacts, campaigns, templates, settings..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 h-9 w-full text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-teal-500 transition-all duration-150 shadow-sm sm:w-[280px] md:w-[320px] lg:w-[360px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (selectedIndex >= 0 && searchResults[selectedIndex]) {
                      handleSearchSelect(searchResults[selectedIndex]);
                    } else if (searchResults.length > 0) {
                      handleSearchSelect(searchResults[0]);
                    }
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                      prev < searchResults.length - 1 ? prev + 1 : 0
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                      prev > 0 ? prev - 1 : searchResults.length - 1
                    );
                  } else if (e.key === "Escape") {
                    setShowSuggestions(false);
                    setSearchTerm("");
                    setSelectedIndex(-1);
                  }
                }}
                onFocus={() => searchTerm && setShowSuggestions(true)}
              />
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {searchResults.map((item, index) => {
                  const getItemIcon = () => {
                    if (role === "superadmin") {
                      return item.type === "business" ? Building2 : Users;
                    } else {
                      // Admin icons - Enhanced with new types
                      switch (item.type) {
                        case "contact":
                          return Users;
                        case "campaign":
                          return Send;
                        case "template":
                          return FileText;
                        case "settings":
                          return Settings;
                        case "page":
                          return Globe;
                        default:
                          return Users;
                      }
                    }
                  };

                  const getItemColor = () => {
                    if (role === "superadmin") {
                      return item.type === "business" ? "blue" : "green";
                    } else {
                      switch (item.type) {
                        case "contact":
                          return "green";
                        case "campaign":
                          return "purple";
                        case "template":
                          return "orange";
                        case "settings":
                          return "blue";
                        case "page":
                          return "indigo";
                        default:
                          return "gray";
                      }
                    }
                  };

                  const getColorClasses = (color: string) => {
                    const colorMap = {
                      blue: { bg: "bg-blue-100", text: "text-blue-600" },
                      green: { bg: "bg-green-100", text: "text-green-600" },
                      purple: { bg: "bg-purple-100", text: "text-purple-600" },
                      orange: { bg: "bg-orange-100", text: "text-orange-600" },
                      indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
                      gray: { bg: "bg-gray-100", text: "text-gray-600" },
                    };
                    return (
                      colorMap[color as keyof typeof colorMap] || colorMap.gray
                    );
                  };

                  const getItemSubtext = () => {
                    if (role === "superadmin") {
                      return item.type === "business"
                        ? item.email
                        : `${item.email} • ${item.business}`;
                    } else {
                      switch (item.type) {
                        case "contact":
                          return `${item.email} • ${item.phone}`;
                        case "campaign":
                          return `Status: ${item.status}`;
                        case "template":
                          return `Category: ${item.category}`;
                        case "settings":
                          return item.description || "Settings configuration";
                        case "page":
                          return item.description || "Navigate to page";
                        default:
                          return item.email || item.description || "";
                      }
                    }
                  };

                  const IconComponent = getItemIcon();
                  const color = getItemColor();
                  const colorClasses = getColorClasses(color);

                  return (
                    <div
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSearchSelect(item)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                        index === selectedIndex
                          ? "bg-gray-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClasses.bg}`}
                      >
                        <IconComponent
                          className={`h-4 w-4 ${colorClasses.text}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {getItemSubtext()}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {item.type}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No results message */}
            {showSuggestions && searchTerm && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="px-4 py-6 text-center text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No results found for "{searchTerm}"</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Refresh button and User dropdown */}
        <div className="flex items-center gap-4">
          {/* Refresh Button */}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          )}

          {/* User Details */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 px-3 py-2 h-auto"
              >
                {/* Avatar always visible */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    brandColor === "teal" ? "bg-teal-100" : "bg-purple-100"
                  }`}
                >
                  {user?.avatar ? (
                    <img
                      src={getUserAvatarPath(user.avatar)}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User
                      className={`h-5 w-5 ${
                        brandColor === "teal"
                          ? "text-teal-600"
                          : "text-purple-600"
                      }`}
                    />
                  )}
                </div>
                {/* Hide on mobile, show on md+ */}
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900">
                    {user?.name || "User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {role === "admin"
                      ? user?.name || user?.email || "Admin"
                      : "Super Admin"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/${role}/settings`)}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/${role}/${role === "admin" ? "billing" : "plans"}`)
                }
              >
                {role === "admin" ? "Billing" : "Plans"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
