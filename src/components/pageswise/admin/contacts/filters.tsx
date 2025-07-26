// filters.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { availableTags } from "./mockdata";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterTag: string;
  setFilterTag: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterTag,
  setFilterTag,
  filterStatus,
  setFilterStatus,
}) => (
  <div className="flex flex-wrap gap-4 items-center">
    <div className="relative flex-1 min-w-[260px] max-w-xl">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 w-full"
      />
    </div>
    <div className="flex gap-4 min-w-[200px]">
      <Select value={filterTag} onValueChange={setFilterTag}>
        <SelectTrigger className="w-44 md:w-48">
          <SelectValue placeholder="All Tags" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="font-semibold">
            All Tags
          </SelectItem>
          {availableTags.map((tag) => (
            <SelectItem key={tag} value={tag} className="truncate">
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-44 md:w-48">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="font-semibold">
            All Status
          </SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

export default Filters;
