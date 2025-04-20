
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

export interface ContactMethod {
  id: string;
  value: string;
  label: string;
}

export const DEFAULT_CONTACT_METHODS: ContactMethod[] = [
  { id: 'contact-email', value: 'email', label: 'Email' },
  { id: 'contact-phone', value: 'phone', label: 'Téléphone' },
  { id: 'contact-whatsapp', value: 'whatsapp', label: 'WhatsApp' }
];

interface ContactMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  options?: ContactMethod[];
  multiple?: boolean;
  className?: string;
}

const ContactMethodSelector = ({
  value,
  onChange,
  disabled = false,
  options = DEFAULT_CONTACT_METHODS,
  multiple = false,
  className = ''
}: ContactMethodSelectorProps) => {
  // For multiple selection (checkboxes)
  if (multiple) {
    const selectedValues = value ? value.split(',') : [];
    
    const handleCheckboxChange = (checked: boolean, optionValue: string) => {
      let newValues = [...selectedValues];
      
      if (checked) {
        // Add value if it doesn't exist
        if (!newValues.includes(optionValue)) {
          newValues.push(optionValue);
        }
      } else {
        // Remove value if it exists
        newValues = newValues.filter(v => v !== optionValue);
      }
      
      onChange(newValues.join(','));
    };
    
    return (
      <div className={`space-y-3 ${className}`}>
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.id}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) => 
                handleCheckboxChange(checked as boolean, option.value)
              }
              disabled={disabled}
            />
            <FormLabel 
              htmlFor={option.id} 
              className="cursor-pointer"
            >
              {option.label}
            </FormLabel>
          </div>
        ))}
      </div>
    );
  }
  
  // For single selection (radio buttons)
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className={`flex flex-col space-y-3 ${className}`}
      disabled={disabled}
    >
      {options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <RadioGroupItem value={option.value} id={option.id} />
          <FormLabel 
            htmlFor={option.id} 
            className="cursor-pointer"
          >
            {option.label}
          </FormLabel>
        </div>
      ))}
    </RadioGroup>
  );
};

export default ContactMethodSelector;
