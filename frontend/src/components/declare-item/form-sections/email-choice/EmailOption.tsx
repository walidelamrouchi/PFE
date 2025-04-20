
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

const EmailOption = ({ value, label, disabled = false }) => {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={`${value}-email`} disabled={disabled} />
      <Label htmlFor={`${value}-email`}>{label}</Label>
    </div>
  );
};

export default EmailOption;
