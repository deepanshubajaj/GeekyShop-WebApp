import { Component } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";

// Dummy inventory data (Replace this with real API data)
const dummyInventory = [
  { sno: 1, id: 156724, title: "Laptop", description: "Gaming Laptop", price: 1200, brand: "Dell", image: "https://via.placeholder.com/50", date: "2025-04-02" },
  { sno: 2, id: 265277, title: "Phone", description: "Smartphone", price: 800, brand: "Samsung", image: "https://via.placeholder.com/50", date: "2025-04-02" }
];

interface Props { }

interface State {
  user: {
    name: string;
    email: string;
    dob: string;
  };
  inventory: typeof dummyInventory;
}

class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // Retrieve the 'user' object from localStorage (if it exists)
    const storedUser = localStorage.getItem("userLogin/SignupDetails");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    this.state = {
      user: {
        // If the individual fields are available in localStorage, use them, otherwise use parsed user or fallback to default
        name: (parsedUser ? parsedUser.name : "Guest"),
        email: (parsedUser ? parsedUser.email : "guest@gmail.com"),
        dob: (parsedUser ? parsedUser.dob : "2000-01-31"),
      },
      inventory: dummyInventory,
    };
  }

  componentDidMount() {
    const hasReloaded = localStorage.getItem("hasReloaded") === "true";

    if (!hasReloaded) {
      localStorage.setItem("hasReloaded", "true");

      // After 1 seconds, reload the page
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  handleAddRecord = () => {
    alert("Add new record functionality goes here!");
  };

  handleEdit = (id: number) => {
    alert(`Edit item with ID: ${id}`);
  };

  handleDelete = (id: number) => {
    const updatedInventory = this.state.inventory.filter(item => item.id !== id);
    this.setState({ inventory: updatedInventory });
  };

  render() {
    const { user, inventory } = this.state;

    return (
      <Box sx={{ maxWidth: 1200, margin: "auto", padding: 3 }}>
        {/* User Info Card */}
        <Card sx={{ mb: 3, p: 2, boxShadow: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Welcome, {user.name}! 🎉
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Email: {user.email}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              DOB: {user.dob}
            </Typography>
          </CardContent>
        </Card>

        {/* Header + Add New Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight="bold" color="secondary">
            🛒 Geeky-Shop Inventory
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={this.handleAddRecord}
            sx={{ textTransform: "none", boxShadow: 2, borderRadius: 2 }}
          >
            Add New Record
          </Button>
        </Box>

        {/* Inventory Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976D2" }}>
              <TableRow>
                {["S.No.", "ID", "Title", "Description", "Price ($)", "Brand", "Image", "Date", "Actions"].map((head) => (
                  <TableCell key={head} sx={{ color: "white", fontWeight: "bold" }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" }, "&:hover": { backgroundColor: "#e3f2fd" } }}>
                  <TableCell>{item.sno}</TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>
                    <img src={item.image} alt={item.title} width="50" style={{ borderRadius: "5px" }} />
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="info" startIcon={<Visibility />} onClick={() => alert(`View item ${item.id}`)} sx={{ mr: 1 }}>
                      View
                    </Button>
                    <Button size="small" variant="contained" color="success" startIcon={<Edit />} onClick={() => this.handleEdit(item.id)} sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button size="small" variant="contained" color="error" startIcon={<Delete />} onClick={() => this.handleDelete(item.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
}

export default Home;
