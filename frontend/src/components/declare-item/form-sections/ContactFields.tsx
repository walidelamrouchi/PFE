
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FormLabel } from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import EmailOption from "./email-choice/EmailOption";
import CustomEmailField from "./email-choice/CustomEmailField";

const ContactFields = ({ control, disabled = false }) => {
  const { user } = useAuth();
  const [emailChoice, setEmailChoice] = useState("registered");
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FormLabel>Email de contact</FormLabel>
        <RadioGroup 
          defaultValue="registered" 
          className="flex flex-col space-y-2"
          onValueChange={(value) => setEmailChoice(value)}
        >
          <EmailOption 
            value="registered" 
            label={`Utiliser mon email d'inscription (${user?.email})`}
            disabled={disabled}
          />
          <EmailOption 
            value="custom" 
            label="Utiliser un autre email"
            disabled={disabled}
          />
        </RadioGroup>
      </div>
      
      {emailChoice === "custom" && (
        <CustomEmailField control={control} disabled={disabled} />
      )}
    </div>
  );
};

export default ContactFields;
