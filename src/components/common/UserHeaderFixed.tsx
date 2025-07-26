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

// Mock data for admin search
const mockAdminData = [
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
  { id: "3", name: "Summer Sale Campaign", status: "active", type: "campaign" },
  { id: "4", name: "Welcome Message", category: "greeting", type: "template" },
  {
    id: "5",
    name: "Follow-up Template",
    category: "follow-up",
    type: "template",
  },
];

const UserHeaderFixed: React.FC<UserHeaderProps> = ({
  role,
  onRefresh,
  refreshing = false,
}) => {
  const navigate = useNavigate();
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
  const searchRef = useRef<HTMLDivElement>(null);

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
        // Admin search functionality
        results = mockAdminData
          .filter(
            (item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (item.email &&
                item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (item.phone && item.phone.includes(searchTerm))
          )
          .slice(0, 8);
      }

      setSearchResults(results);
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
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
      // Admin navigation
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
        default:
          navigate("/admin/dashboard");
      }
    }
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    authService.logout();
    navigate(role === "admin" ? "/admin/login" : "/superadmin/login");
  };

  const brandColor = role === "admin" ? "teal" : "purple";

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Global Search - Available for both Admin and SuperAdmin */}
        <div className="flex-1 max-w-md w-full" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder={
                typeof window !== "undefined" && window.innerWidth < 640
                  ? "Search"
                  : "Search contacts, campaigns, templates..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 h-10 w-full max-w-full text-base rounded-md border border-gray-300 focus:ring-1 focus:ring-teal-500 transition-all duration-150 shadow-sm md:w-[400px] lg:w-[500px]"
              onFocus={() => searchTerm && setShowSuggestions(true)}
            />
          </div>
          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchResults.map((item) => {
                const getItemIcon = () => {
                  if (role === "superadmin") {
                    return item.type === "business" ? Building2 : Users;
                  } else {
                    switch (item.type) {
                      case "contact":
                        return Users;
                      case "campaign":
                        return Send;
                      case "template":
                        return FileText;
                      default:
                        return Users;
                    }
                  }
                };
                const getColorClasses = () => {
                  if (role === "superadmin") {
                    return item.type === "business"
                      ? { bg: "bg-blue-100", text: "text-blue-600" }
                      : { bg: "bg-green-100", text: "text-green-600" };
                  } else {
                    switch (item.type) {
                      case "contact":
                        return { bg: "bg-green-100", text: "text-green-600" };
                      case "campaign":
                        return { bg: "bg-purple-100", text: "text-purple-600" };
                      case "template":
                        return { bg: "bg-orange-100", text: "text-orange-600" };
                      default:
                        return { bg: "bg-gray-100", text: "text-gray-600" };
                    }
                  }
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
                      default:
                        return item.email || "";
                    }
                  }
                };
                const IconComponent = getItemIcon();
                const colorClasses = getColorClasses();
                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSearchSelect(item)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
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
              {/* Mobile: Only show avatar, hide name/info/chevron. Desktop: show full section */}
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
                      ? user?.company || user?.email || "Admin"
                      : "Super Administrator"}
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

export default UserHeaderFixed;
