export const CATEGORIES_COLUMNS = [
  { id: "name", label: "Nom" },
  { id: "description", label: "Description" },
  {
    id: "created_at",
    label: "Date de création",
    render: (value) => new Date(value).toLocaleDateString("fr-FR")
  },
  {
    id: "product_count",
    label: "Nombre de produits",
    align: "center",
    render: (value) => value || "Non disponible"
  }
];
