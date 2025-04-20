
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const CustomEmailField = ({ control, disabled = false }) => {
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nouvel email de contact</FormLabel>
          <FormControl>
            <Input
              disabled={disabled}
              placeholder="Votre email de contact alternatif"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomEmailField;
