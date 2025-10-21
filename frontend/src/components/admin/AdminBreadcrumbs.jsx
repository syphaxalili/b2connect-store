import { NavigateNext as NavigateNextIcon } from "@mui/icons-material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function AdminBreadcrumbs({ items }) {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: 2 }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return isLast ? (
          <Typography key={item.label} color="text.primary" fontWeight={500}>
            {item.label}
          </Typography>
        ) : (
          <Link
            key={item.label}
            component={RouterLink}
            to={item.path}
            underline="hover"
            color="inherit"
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}

export default AdminBreadcrumbs;
