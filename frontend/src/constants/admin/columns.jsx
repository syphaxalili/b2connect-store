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

export const PRODUCTS_COLUMNS = [
  { id: "name", label: "Nom" },
  {
    id: "category_id",
    label: "Catégorie",
    render: (value) => value?.name || "N/A"
  },
  { id: "brand", label: "Marque" },
  {
    id: "price",
    label: "Prix",
    align: "right",
    render: (value) => `${value.toFixed(2)} €`
  },
  {
    id: "stock",
    label: "Stock",
    align: "center",
    render: (value) => value
  },
  {
    id: "created_at",
    label: "Date de création",
    render: (value) => new Date(value).toLocaleDateString("fr-FR")
  }
];

export const ORDERS_COLUMNS = [
  { id: "id", label: "N° Commande", align: "center" },
  {
    id: "User",
    label: "Client",
    render: (value) =>
      `${value?.first_name || ""} ${value?.last_name || ""}`.trim() || "N/A"
  },
  {
    id: "total_amount",
    label: "Montant total",
    align: "right",
    render: (value) => `${parseFloat(value).toFixed(2)} €`
  },
  {
    id: "status",
    label: "Statut",
    align: "center",
    render: (value) => {
      const statusMap = {
        pending: "En attente",
        approved: "Validée",
        shipped: "Expédiée",
        delivered: "Livrée",
        cancelled: "Annulée",
        archived: "Archivée"
      };
      const colorMap = {
        pending: "#ff9800",
        approved: "#2196f3",
        shipped: "#9c27b0",
        delivered: "#4caf50",
        cancelled: "#f44336",
        archived: "#757575"
      };
      return (
        <span
          style={{
            backgroundColor: colorMap[value] || "#999",
            color: "white",
            padding: "4px 12px",
            borderRadius: "16px",
            fontSize: "12px",
            fontWeight: "600",
            whiteSpace: "nowrap"
          }}
        >
          {statusMap[value] || value}
        </span>
      );
    }
  },
  {
    id: "tracking_number",
    label: "N° Suivi",
    render: (value) => value || "-"
  },
  {
    id: "created_at",
    label: "Date de commande",
    render: (value) => new Date(value).toLocaleDateString("fr-FR")
  }
];

// Ordre de tri personnalisé pour le statut
export const STATUS_SORT_ORDER = {
  pending: 0,
  approved: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 4,
  archived: 5
};
