import { Calendar, Fuel, DollarSign, Clock } from "lucide-react";
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
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { da } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { SearchFiltersState, RentalPeriodType } from "@/pages/Search";

interface SearchFiltersProps {
  filters: SearchFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<SearchFiltersState>>;
}

const SearchFilters = ({ filters, setFilters }: SearchFiltersProps) => {
  const handlePeriodChange = (type: RentalPeriodType, count: number) => {
    setFilters((prev) => {
      const newFilters = { ...prev, periodType: type, periodCount: count };
      
      // Auto-calculate end date based on period type and count
      if (prev.startDate) {
        let endDate: Date;
        switch (type) {
          case 'weekly':
            endDate = addWeeks(prev.startDate, count);
            break;
          case 'monthly':
            endDate = addMonths(prev.startDate, count);
            break;
          default:
            endDate = addDays(prev.startDate, count - 1);
        }
        newFilters.endDate = endDate;
      }
      
      return newFilters;
    });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setFilters((prev) => {
      const newFilters = { ...prev, startDate: date };
      
      if (date) {
        let endDate: Date;
        switch (prev.periodType) {
          case 'weekly':
            endDate = addWeeks(date, prev.periodCount);
            break;
          case 'monthly':
            endDate = addMonths(date, prev.periodCount);
            break;
          default:
            endDate = addDays(date, prev.periodCount - 1);
        }
        newFilters.endDate = endDate;
      }
      
      return newFilters;
    });
  };

  return (
    <div className="bg-card border-b border-border py-4 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Rental Period Type */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Lejetype</Label>
            <Select
              value={filters.periodType}
              onValueChange={(value: RentalPeriodType) => handlePeriodChange(value, filters.periodCount)}
            >
              <SelectTrigger className="w-[130px]">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Dage</SelectItem>
                <SelectItem value="weekly">Uger</SelectItem>
                <SelectItem value="monthly">Måneder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Period Count */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Antal {filters.periodType === 'daily' ? 'dage' : filters.periodType === 'weekly' ? 'uger' : 'måneder'}
            </Label>
            <Input
              type="number"
              min={1}
              max={filters.periodType === 'monthly' ? 12 : filters.periodType === 'weekly' ? 52 : 365}
              value={filters.periodCount}
              onChange={(e) => handlePeriodChange(filters.periodType, Math.max(1, Number(e.target.value) || 1))}
              className="w-20"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Startdato</Label>
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
                  onSelect={handleStartDateChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date Display */}
          {filters.endDate && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Slutdato</Label>
              <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted/50 text-sm flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                {format(filters.endDate, "dd. MMM yyyy", { locale: da })}
              </div>
            </div>
          )}

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
                periodType: 'daily',
                periodCount: 1,
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
