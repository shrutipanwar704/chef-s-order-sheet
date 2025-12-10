import { RequirementItem } from "@/types/requirement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

interface ItemsTableProps {
  items: RequirementItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, field: keyof RequirementItem, value: string | number) => void;
}

const UNITS = ["kg", "g", "ltr", "ml", "pcs", "dozen", "packet", "box", "can", "bottle"];

export function ItemsTable({ items, onAddItem, onRemoveItem, onUpdateItem }: ItemsTableProps) {
  const calculateTotal = (qty: number, price: number) => {
    return (qty * price).toFixed(2);
  };

  const grandTotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/5 hover:bg-primary/5">
              <TableHead className="font-semibold text-foreground">Item</TableHead>
              <TableHead className="font-semibold text-foreground w-24">Qty</TableHead>
              <TableHead className="font-semibold text-foreground w-32">Unit</TableHead>
              <TableHead className="font-semibold text-foreground w-28">Price</TableHead>
              <TableHead className="font-semibold text-foreground w-28 text-right">Total</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow 
                key={item.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell>
                  <Input
                    placeholder="Enter item name"
                    value={item.item}
                    onChange={(e) => onUpdateItem(item.id, "item", e.target.value)}
                    className="bg-background border-border"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={item.qty || ""}
                    onChange={(e) => onUpdateItem(item.id, "qty", parseFloat(e.target.value) || 0)}
                    className="bg-background border-border"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={item.unit}
                    onValueChange={(value) => onUpdateItem(item.id, "unit", value)}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={item.price || ""}
                    onChange={(e) => onUpdateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                    className="bg-background border-border"
                  />
                </TableCell>
                <TableCell className="text-right font-medium text-primary">
                  ₹{calculateTotal(item.qty, item.price)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No items added yet. Click "Add Item" to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onAddItem} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>

        <div className="bg-primary/5 rounded-lg px-6 py-3 border border-primary/20">
          <span className="text-sm text-muted-foreground mr-3">Grand Total:</span>
          <span className="text-xl font-display font-semibold text-primary">
            ₹{grandTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
