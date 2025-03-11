import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";

interface FormData {
  name: string;
  email: string;
}

const CustomForm: React.FC<{ onSubmit: (data: FormData) => void }> = ({
  onSubmit,
}) => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: { name: "", email: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Nombre" fullWidth margin="normal" />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Correo electrónico"
            fullWidth
            margin="normal"
          />
        )}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Enviar
      </Button>
    </form>
  );
};

export default CustomForm;
