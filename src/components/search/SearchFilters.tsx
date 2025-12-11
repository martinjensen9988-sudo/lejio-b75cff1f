import { Calendar, Fuel, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { SearchFiltersState } from "@/pages/Search";

interface SearchFiltersProps {
  filters: SearchFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFiltersState>>;
}

const SearchFilters = ({ filters, setFilters }: SearchFiltersProps) => {
  return (
    <div className="bg-card border-b border-border py-4 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Date Range */}
          <div className="flex gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Fra dato</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[140px] justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.startDate ? (
                      format(filters.startDate, "dd. MMM", { locale: da })
                    ) : (
                      <span className="text-muted-foreground">Vælg dato</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.startDate}
                    onSelect={(date) =>
                      setFilters((prev) => ({ ...prev, startDate: date }))
                    }
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Til dato</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[140px] justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.endDate ? (
                      format(filters.endDate, "dd. MMM", { locale: da })
                    ) : (
                      <span className="text-muted-foreground">Vælg dato</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filters.endDate}
                    onSelect={(date) =>
                      setFilters((prev) => ({ ...prev, endDate: date }))
                    }
                    disabled={(date) =>
                      date < new Date() ||
                      (filters.startDate ? date < filters.startDate : false)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Price Range */}
          <div className="flex gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Min pris/dag</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceMin: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-24 pl-9"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Max pris/dag</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceMax: Number(e.target.value) || 10000,
                    }))
                  }
                  className="w-24 pl-9"
                  placeholder="5000"
                />
              </div>
            </div>
          </div>

          {/* Fuel Type */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Brændstof</Label>
            <Select
              value={filters.fuelType}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, fuelType: value }))
              }
            >
              <SelectTrigger className="w-[140px]">
                <Fuel className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Alle typer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle typer</SelectItem>
                <SelectItem value="Benzin">Benzin</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="El">El</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setFilters({
                priceMin: 0,
                priceMax: 5000,
                fuelType: "all",
                startDate: undefined,
                endDate: undefined,
              })
            }
            className="text-muted-foreground"
          >
            Nulstil filtre
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
