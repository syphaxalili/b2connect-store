import {
  Add as AddIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as MoveDownIcon,
  KeyboardArrowUp as MoveUpIcon
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";

const DATA_TYPES = [
  { value: "string", label: "Texte court" },
  { value: "text", label: "Texte long" },
  { value: "number", label: "Nombre" },
  { value: "boolean", label: "Oui/Non" },
  { value: "date", label: "Date" },
  { value: "email", label: "Email" },
  { value: "url", label: "URL" }
];

function DynamicFieldsBuilder({ fields, onChange }) {
  const [localFields, setLocalFields] = useState(fields || []);

  const handleAddField = () => {
    const newField = {
      id: Date.now(),
      name: "",
      label: "",
      dataType: "string",
      required: false,
      order: localFields.length
    };
    const updated = [...localFields, newField];
    setLocalFields(updated);
    onChange(updated);
  };

  const handleRemoveField = (id) => {
    const updated = localFields.filter((f) => f.id !== id);
    setLocalFields(updated);
    onChange(updated);
  };

  const handleFieldChange = (id, key, value) => {
    const updated = localFields.map((f) =>
      f.id === id ? { ...f, [key]: value } : f
    );
    setLocalFields(updated);
    onChange(updated);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...localFields];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    updated.forEach((f, i) => (f.order = i));
    setLocalFields(updated);
    onChange(updated);
  };

  const handleMoveDown = (index) => {
    if (index === localFields.length - 1) return;
    const updated = [...localFields];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    updated.forEach((f, i) => (f.order = i));
    setLocalFields(updated);
    onChange(updated);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Champs spécifiques de la catégorie
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          size="small"
          onClick={handleAddField}
        >
          Ajouter un champ
        </Button>
      </Box>

      {localFields.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center", bgcolor: "grey.50" }}>
          <Typography color="text.secondary">
            Aucun champ défini. Cliquez sur "Ajouter un champ" pour commencer.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {localFields.map((field, index) => (
            <Paper key={field.id} sx={{ p: 2 }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                {/* Drag handle */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    pt: 1
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    <MoveUpIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === localFields.length - 1}
                  >
                    <MoveDownIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Fields */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <TextField
                      label="Nom du champ"
                      placeholder="Ex: cpu"
                      value={field.name}
                      onChange={(e) =>
                        handleFieldChange(
                          field.id,
                          "name",
                          e.target.value.toLowerCase().replace(/\s+/g, "_")
                        )
                      }
                      size="small"
                      sx={{ flex: 1, minWidth: 200 }}
                      required
                    />
                    <TextField
                      label="Label affiché"
                      placeholder="Ex: Processeur"
                      value={field.label}
                      onChange={(e) =>
                        handleFieldChange(field.id, "label", e.target.value)
                      }
                      size="small"
                      sx={{ flex: 1, minWidth: 200 }}
                      required
                    />
                    <TextField
                      select
                      label="Type de données"
                      value={field.dataType}
                      onChange={(e) =>
                        handleFieldChange(field.id, "dataType", e.target.value)
                      }
                      size="small"
                      sx={{ minWidth: 150 }}
                    >
                      {DATA_TYPES.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.required}
                        onChange={(e) =>
                          handleFieldChange(
                            field.id,
                            "required",
                            e.target.checked
                          )
                        }
                        size="small"
                      />
                    }
                    label="Champ obligatoire"
                    sx={{ userSelect: "none" }}
                  />
                </Box>

                {/* Delete button */}
                <IconButton
                  color="error"
                  onClick={() => handleRemoveField(field.id)}
                  sx={{ mt: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default DynamicFieldsBuilder;
