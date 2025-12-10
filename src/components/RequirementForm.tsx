import { RequirementForm as FormData } from "@/types/requirement";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, User, Utensils, Users } from "lucide-react";
import { MEAL_TYPES } from "@/data/kitchenItems";

interface RequirementFormProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
}

export function RequirementForm({ formData, onChange }: RequirementFormProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="date" className="flex items-center gap-2 text-foreground/80">
          <Calendar className="h-4 w-4 text-primary" />
          Date <span className="text-destructive">*</span>
        </Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => onChange({ date: e.target.value })}
          className="h-11 bg-background border-border focus:border-primary"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="chefName" className="flex items-center gap-2 text-foreground/80">
          <User className="h-4 w-4 text-primary" />
          Chef Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="chefName"
          type="text"
          placeholder="Enter chef name"
          value={formData.chefName}
          onChange={(e) => onChange({ chefName: e.target.value })}
          className="h-11 bg-background border-border focus:border-primary"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mealType" className="flex items-center gap-2 text-foreground/80">
          <Utensils className="h-4 w-4 text-primary" />
          Meal Type <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.mealType}
          onValueChange={(value) => onChange({ mealType: value })}
        >
          <SelectTrigger className="h-11 bg-background border-border">
            <SelectValue placeholder="Select meal type" />
          </SelectTrigger>
          <SelectContent>
            {MEAL_TYPES.map((meal) => (
              <SelectItem key={meal} value={meal}>
                {meal}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numberOfPax" className="flex items-center gap-2 text-foreground/80">
          <Users className="h-4 w-4 text-primary" />
          Number of Pax <span className="text-destructive">*</span>
        </Label>
        <Input
          id="numberOfPax"
          type="number"
          min="1"
          placeholder="Enter number of guests"
          value={formData.numberOfPax || ""}
          onChange={(e) => onChange({ numberOfPax: parseInt(e.target.value) || 0 })}
          className="h-11 bg-background border-border focus:border-primary"
          required
        />
      </div>
    </div>
  );
}
