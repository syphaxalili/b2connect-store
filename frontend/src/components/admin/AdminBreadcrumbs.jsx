import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon
} from "@mui/icons-material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

// Configuration des labels pour les routes
const ROUTE_LABELS = {
  admin: "Administration",
  categories: "Catégories",
  products: "Produits",
  orders: "Commandes",
  users: "Utilisateurs",
  new: "Nouveau",
  edit: "Modifier"
};

function AdminBreadcrumbs({ customLabel }) {
  const location = useLocation();
  // const params = useParams();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const items = [];

    // Toujours commencer par Admin
    items.push({
      label: "Admin",
      path: "/admin",
      icon: <HomeIcon fontSize="small" />
    });

    let currentPath = "";
    pathSegments.forEach((segment) => {
      // Ignorer le premier segment "admin"
      if (segment === "admin") {
        currentPath = "/admin";
        return;
      }

      currentPath += `/${segment}`;

      // Si c'est un ID MongoDB (24 caractères hexadécimaux)
      if (/^[0-9a-fA-F]{24}$/.test(segment)) {
        items.push({
          label: customLabel || `Détails`,
          path: currentPath,
          isId: true
        });
      } else {
        // Utiliser le label configuré ou le segment lui-même
        const label =
          ROUTE_LABELS[segment] ||
          segment.charAt(0).toUpperCase() + segment.slice(1);
        items.push({
          label,
          path: currentPath
        });
      }
    });

    setBreadcrumbs(items);
  }, [location.pathname, customLabel]);

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: 2 }}
    >
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return isLast ? (
          <Typography
            key={item.path}
            color="text.primary"
            fontWeight={500}
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            {item.icon}
            {item.label}
          </Typography>
        ) : (
          <Link
            key={item.path}
            component={RouterLink}
            to={item.path}
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

export default AdminBreadcrumbs;
