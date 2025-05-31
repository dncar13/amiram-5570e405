
import React from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchBar = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-grow">
        <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="חיפוש שאלה..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-3 pr-10 py-5"
        />
      </div>
      
      <div>
        <Button className="w-full md:w-auto bg-electric-blue">
          <Plus className="h-4 w-4 mr-2" />
          הוספת שאלה חדשה
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
