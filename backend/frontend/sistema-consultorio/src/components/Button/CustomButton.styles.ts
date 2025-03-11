import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

export const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  borderRadius: "8px",
  textTransform: "none",
  fontSize: "16px",
  boxShadow: theme.shadows[2],
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));
