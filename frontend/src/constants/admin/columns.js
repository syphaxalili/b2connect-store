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
    render: (value) => value
  }
];

export const USERS_COLUMNS = [
  {
    id: "name",
    label: "Nom complet",
    render: (value, row) => `${row.first_name} ${row.last_name}`
  },
  { id: "email", label: "Email" },
  {
    id: "role",
    label: "Rôle",
    align: "center",
    render: (value) => (value === "admin" ? "Administrateur" : "Client")
  },
  {
    id: "gender",
    label: "Genre",
    align: "center",
    render: (value) => (value === "male" ? "Homme" : "Femme")
  },
  {
    id: "created_at",
    label: "Date d'inscription",
    render: (value) => new Date(value).toLocaleDateString("fr-FR")
  }
];
