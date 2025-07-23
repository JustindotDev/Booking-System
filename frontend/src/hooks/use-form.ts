import { useState } from "react";

function useForm<T>(
  initialState: T,
  onFieldChange?: (name: keyof T, value: string) => void
) {
  const [formData, setFormData] = useState<T>(initialState);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (onFieldChange) {
      onFieldChange(name as keyof T, value);
    }
  };

  return { formData, handleChange, setFormData };
}

export default useForm;
