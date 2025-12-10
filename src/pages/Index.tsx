import { useState } from "react";
import { RequirementForm } from "@/components/RequirementForm";
import { ItemsTable } from "@/components/ItemsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RequirementForm as FormData, RequirementItem } from "@/types/requirement";
import { generateRequirementPDF } from "@/utils/generatePDF";
import { ChefHat, Send, Loader2, FileDown } from "lucide-react";

// Replace with your Google Apps Script Web App URL
const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

const Index = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split("T")[0],
    chefName: "",
    mealType: "",
    numberOfPax: 0,
  });

  const [items, setItems] = useState<RequirementItem[]>([
    { id: crypto.randomUUID(), item: "", qty: 0, unit: "kg", price: 0 },
  ]);

  const handleFormChange = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), item: "", qty: 0, unit: "kg", price: 0 },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) {
      toast({
        title: "Cannot remove",
        description: "At least one item row is required.",
        variant: "destructive",
      });
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: keyof RequirementItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const validateForm = (): boolean => {
    if (!formData.date) {
      toast({ title: "Error", description: "Please select a date.", variant: "destructive" });
      return false;
    }
    if (!formData.chefName.trim()) {
      toast({ title: "Error", description: "Please enter chef name.", variant: "destructive" });
      return false;
    }
    if (!formData.mealType) {
      toast({ title: "Error", description: "Please select meal type.", variant: "destructive" });
      return false;
    }
    if (formData.numberOfPax <= 0) {
      toast({ title: "Error", description: "Please enter valid number of pax.", variant: "destructive" });
      return false;
    }
    
    const validItems = items.filter((item) => item.item.trim() !== "");
    if (validItems.length === 0) {
      toast({ title: "Error", description: "Please add at least one item.", variant: "destructive" });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
      toast({
        title: "Configuration Required",
        description: "Please replace SCRIPT_URL with your Google Apps Script Web App URL.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const grandTotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    const validItems = items.filter((item) => item.item.trim() !== "");

    const payload = {
      ...formData,
      items: validItems.map(({ id, ...rest }) => ({
        ...rest,
        total: rest.qty * rest.price,
      })),
      grandTotal,
    };

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      toast({
        title: "Success!",
        description: "Requirement submitted successfully to Google Sheets.",
      });

      // Reset form
      setFormData({
        date: new Date().toISOString().split("T")[0],
        chefName: "",
        mealType: "",
        numberOfPax: 0,
      });
      setItems([{ id: crypto.randomUUID(), item: "", qty: 0, unit: "kg", price: 0 }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!validateForm()) return;
    
    generateRequirementPDF(formData, items);
    toast({
      title: "PDF Generated",
      description: "Your requirement PDF has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground py-8 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-foreground/10 rounded-xl backdrop-blur-sm">
              <ChefHat className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
                Chef Requirements
              </h1>
              <p className="text-primary-foreground/80 mt-1">
                Daily kitchen requirements management system
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Form Card */}
          <Card className="shadow-card animate-fade-in">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-xl font-display flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <RequirementForm formData={formData} onChange={handleFormChange} />
            </CardContent>
          </Card>

          {/* Items Card */}
          <Card className="shadow-card animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-xl font-display flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Items List
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ItemsTable
                items={items}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                onUpdateItem={handleUpdateItem}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-3 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Button
              variant="outline"
              size="lg"
              onClick={handleDownloadPDF}
              className="gap-2"
            >
              <FileDown className="h-5 w-5" />
              Download PDF
            </Button>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2 min-w-[180px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Requirement
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container max-w-4xl mx-auto px-4 text-center text-muted-foreground text-sm">
          Hotel Kitchen Management System
        </div>
      </footer>
    </div>
  );
};

export default Index;
