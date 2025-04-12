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
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Input,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import placeholderImage from '../../assets/placeholderImage.png'

interface Props { }

interface State {
  user: { name: string; email: string; dob: string };
  inventory: any[];
  openDialog: boolean;
  openViewDialog: boolean;
  openEditDialog: boolean;
  newRecord: {
    title: string;
    description: string;
    price: number;
    brand: string;
    image: string;
    date: string;
  };
  selectedImage: File | null;
  isLoading: boolean;
  selectedItem: any | null;
}

class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const storedUser = localStorage.getItem("userLogin/SignupDetails");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    this.state = {
      user: {
        name: parsedUser ? parsedUser.name : "Guest",
        email: parsedUser ? parsedUser.email : "guest@gmail.com",
        dob: parsedUser ? parsedUser.dob : "2000-01-31",
      },
      inventory: [],
      openDialog: false,
      openViewDialog: false,
      openEditDialog: false,
      newRecord: {
        title: "",
        description: "",
        price: 0,
        brand: "",
        image: placeholderImage,
        date: "", // Initialize date as an empty string
      },
      selectedImage: null,
      isLoading: false,
      selectedItem: null,
    };
  }

  componentDidMount() {
    this.fetchInventory();
    const hasReloaded = localStorage.getItem("hasReloaded") === "true";

    if (!hasReloaded) {
      localStorage.setItem("hasReloaded", "true");

      // After 1 seconds, reload the page
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  fetchInventory = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/get-products");
      const data = await response.json();

      if (data.status === "SUCCESS") {
        const baseUrl = "http://localhost:3000/uploads/"; // Base URL for images

        const inventory = data.data.map((item: any, index: number) => ({
          sno: index + 1,
          fullId: item._id,
          id: item._id.substring(0, 5),
          title: item.title,
          description: item.description,
          price: item.price,
          brand: item.brand,
          image: item.image ? baseUrl + item.image : placeholderImage, // Prepend the base URL to the image filename
          date: new Date(item.date).toLocaleDateString(),
        }));
        this.setState({ inventory });
      } else {
        alert("Failed to fetch inventory: " + data.message);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      alert("An error occurred while fetching the inventory.");
    }
  };

  handleAddRecord = () => {
    this.setState({ openDialog: true });
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  handleSaveRecord = async () => {
    this.setState({ isLoading: true });

    const { newRecord, selectedImage } = this.state;

    const formData = new FormData();
    formData.append("title", newRecord.title);
    formData.append("description", newRecord.description);
    formData.append("price", newRecord.price.toString());
    formData.append("brand", newRecord.brand);
    formData.append("date", newRecord.date);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await fetch("http://localhost:3000/user/save-product", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        this.setState((prevState) => ({
          inventory: [
            ...prevState.inventory,
            {
              sno: prevState.inventory.length + 1,
              id: data.data._id,
              title: newRecord.title,
              description: newRecord.description,
              price: newRecord.price,
              brand: newRecord.brand,
              image: data.data.image,
              date: newRecord.date,
            },
          ],
          openDialog: false,
          newRecord: {
            title: "",
            description: "",
            price: 0,
            brand: "",
            image: placeholderImage,
            date: "", // Reset date to empty string
          },
          selectedImage: null,
          isLoading: false,
        }));

        alert("Product added Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } else {
        alert("Failed to add product: " + data.message);
        this.setState({ isLoading: false });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("An error occurred while saving the product.");
      this.setState({ isLoading: false });
    }
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newRecord: { ...prevState.newRecord, [name]: value },
    }));
  };

  handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      this.setState({ selectedImage: file });
    }
  };

  handleViewRecord = (item: any) => {
    this.setState({ openViewDialog: true, selectedItem: item });
  };

  handleCloseViewDialog = () => {
    this.setState({ openViewDialog: false, selectedItem: null });
  };

  handleEditRecord = (item: any) => {
    this.setState({
      openEditDialog: true,
      selectedItem: item,
      newRecord: {
        title: item.title,
        description: item.description,
        price: item.price,
        brand: item.brand,
        image: item.image, // Keep this for reference
        date: item.date,
      },
      selectedImage: null, // Reset selectedImage to null
    });
  };

  handleCloseEditDialog = () => {
    this.setState({ openEditDialog: false, selectedItem: null });
  };

  handleSaveEditRecord = async () => {
    const { newRecord, selectedItem } = this.state;

    // Create a FormData object to send the updated data
    const formData = new FormData();
    formData.append("title", newRecord.title);
    formData.append("description", newRecord.description);
    formData.append("price", newRecord.price.toString());
    formData.append("brand", newRecord.brand);
    formData.append("date", newRecord.date);

    const product_Id = selectedItem.fullId; // contains the product Id
    formData.append("productId", product_Id);

    console.log("image", selectedItem.image);

    // If a new image is selected, append it to the FormData
    if (this.state.selectedImage) {
      formData.append("image", this.state.selectedImage);
    } else {
      // If no new image is selected, send the existing image filename
      const imageFileName = selectedItem.image ? selectedItem.image.split('/').pop() : placeholderImage;
      console.log("imageFileName", imageFileName); // Log the extracted image file name
      formData.append("image", imageFileName); // Send just the image file name
    }

    try {
      const response = await fetch(`http://localhost:3000/user/update-product`, {
        method: "PATCH",  // Use PATCH for updating
        body: formData,
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        alert("Product Details updated Successfully");
        // Reload the page after a successful update
        window.location.reload();
      } else {
        alert("Failed to update product: " + data.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product.");
    }
  };

  handleDeleteRecord = async (fullId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const response = await fetch("http://localhost:3000/user/delete-product", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: fullId }),
      });

      const data = await response.json();

      if (data.status === "SUCCESS") {
        alert("Product deleted successfully!");
        // Refresh the inventory after deletion
        this.fetchInventory();
      } else {
        alert("Failed to delete product: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    }
  };

  render() {
    const { user, inventory, openDialog, newRecord, selectedImage, isLoading, openViewDialog, selectedItem } = this.state;

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

        {/* Add Record Button */}
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
                {["S.No.", "ID", "Title", "Description", "Price($)", "Brand", "Image", "Date", "Actions"].map((head) => (
                  <TableCell key={head} sx={{ color: "white", fontWeight: "bold" }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                    "&:hover": { backgroundColor: "#e3f2fd" },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>
                    <img
                      src={item.image}
                      alt={item.title}
                      width="50"
                      style={{ borderRadius: "5px" }}
                    />
                  </TableCell>
                  <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="info" startIcon={<Visibility />} onClick={() => this.handleViewRecord(item)} sx={{ mr: 1 }}>
                      View
                    </Button>
                    <Button size="small" variant="contained" color="success" startIcon={<Edit />} onClick={() => this.handleEditRecord(item)} sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button size="small" variant="contained" color="error" startIcon={<Delete />} onClick={() => this.handleDeleteRecord(item.fullId)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* View Item Dialog */}
        <Dialog
          open={openViewDialog}
          onClose={this.handleCloseViewDialog}
          sx={{
            borderRadius: "20px",
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #9C27B0, #6A1B9A)",
              color: "white",
              padding: "20px 30px",
              textAlign: "center",
              fontWeight: "bold",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px",
            }}
          >
            <Typography variant="h4">Unbox the Magic!</Typography>
          </DialogTitle>
          <DialogContent sx={{ padding: 3 }}>
            {selectedItem && (
              <>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    width="200"
                    style={{ borderRadius: "12px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
                  />
                </Box>

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                  sx={{ textAlign: "center" }}
                >
                  {selectedItem.title}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{ lineHeight: 1.6 }}
                >
                  <strong>Description:</strong> {selectedItem.description}
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  Price:
                  <span style={{ color: "#1976D2", fontWeight: "bold" }}>${selectedItem.price}</span>
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  gutterBottom
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>Brand:</strong> {selectedItem.brand}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  gutterBottom
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>Date:</strong> {new Date(selectedItem.date).toLocaleDateString()}
                </Typography>
              </>
            )}
          </DialogContent>

          <DialogActions sx={{ padding: "20px 30px", justifyContent: "center" }}>
            <Button
              onClick={this.handleCloseViewDialog}
              color="primary"
              variant="contained"
              sx={{
                width: 150,
                backgroundColor: "#9C27B0",
                "&:hover": {
                  backgroundColor: "#7B1FA2",
                },
                borderRadius: "25px",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "10px 20px",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add New Item Dialog */}
        <Dialog open={openDialog} onClose={this.handleCloseDialog} sx={{
          borderRadius: "16px",
        }}>
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #9C27B0, #6A1B9A)",
              color: "white",
              padding: "20px 30px",
              textAlign: "center",
              fontWeight: "bold",
              borderTopLeftRadius: "5px",
              borderTopRightRadius: "5px",
            }}
          >
            Want to expand More? Then do it. 😉
          </DialogTitle>

          <DialogContent sx={{ padding: 3 }}>
            <TextField
              label="Title"
              fullWidth
              margin="normal"
              name="title"
              value={newRecord.title}
              onChange={this.handleInputChange}
              variant="outlined"
              sx={{
                marginBottom: 2,
                borderRadius: "12px",
              }}
            />
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              name="description"
              value={newRecord.description}
              onChange={this.handleInputChange}
              variant="outlined"
              sx={{
                marginBottom: 2,
                borderRadius: "12px",
              }}
            />
            <TextField
              label="Price ($)"
              fullWidth
              margin="normal"
              name="price"
              type="number"
              value={newRecord.price}
              onChange={this.handleInputChange}
              variant="outlined"
              sx={{
                marginBottom: 2,
                borderRadius: "12px",
              }}
            />
            <TextField
              label="Brand"
              fullWidth
              margin="normal"
              name="brand"
              value={newRecord.brand}
              onChange={this.handleInputChange}
              variant="outlined"
              sx={{
                marginBottom: 2,
                borderRadius: "12px",
              }}
            />
            <TextField
              label="Date of Purchase"
              fullWidth
              margin="normal"
              name="date"
              type="date"
              value={newRecord.date || ''} // Set to empty string initially
              onChange={this.handleInputChange}
              variant="outlined"
              sx={{
                marginBottom: 2,
                borderRadius: "12px",
              }}
              InputProps={{
                startAdornment: (
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    {newRecord.date ? new Date(newRecord.date).toLocaleDateString('en-US') : '00/00/0000'}
                  </Typography>
                ),
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              Format: mm/dd/yyyy
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={2}>
              Upload your Product image
            </Typography>
            <Input
              type="file"
              onChange={this.handleImageChange}
              fullWidth
              margin="dense"
              inputProps={{ accept: "image/*" }}
              sx={{
                marginBottom: 2,
                borderRadius: "12px",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            />
            {selectedImage && (
              <Box mt={2} sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Selected Image:
                </Typography>
                <img src={URL.createObjectURL(selectedImage)} alt="Preview" width="100" style={{ borderRadius: "8px" }} />
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {selectedImage.name}
                </Typography>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ padding: "20px 30px", justifyContent: "center" }}>
            <Button
              onClick={this.handleCloseDialog}
              color="error"
              variant="outlined"
              sx={{
                width: 150,
                borderRadius: "25px",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#FF1744",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={this.handleSaveRecord}
              color="primary"
              variant="contained"
              sx={{
                width: 150,
                backgroundColor: "#9C27B0",
                borderRadius: "25px",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#7B1FA2",
                },
              }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Item Dialog */}
        <Dialog open={this.state.openEditDialog} onClose={this.handleCloseEditDialog} sx={{ borderRadius: "16px" }}>
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #9C27B0, #6A1B9A)",
              color: "white",
              padding: "20px 30px",
              textAlign: "center",
              fontWeight: "bold",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            Modify Your Product Details!
          </DialogTitle>

          <DialogContent sx={{ padding: 3 }}>
            <TextField
              label="Title"
              fullWidth
              margin="normal"
              name="title"
              value={this.state.newRecord.title}
              onChange={this.handleInputChange}
              variant="outlined"
              sx={{
                marginBottom: 2,
                borderRadius: "12px",
                backgroundColor: "#f5f5f5",
              }}
            />

            <TextField
              label="Description"
              fullWidth
              margin="normal"
              name="description"
              value={this.state.newRecord.description}
              onChange={this.handleInputChange}
              variant="outlined"
              sx={{
                marginBottom: 2,
                borderRadius: "12px",
                backgroundColor: "#f5f5f5",
              }}
            />

            <TextField
              label="Price ($)"
              fullWidth
              margin="normal"
              name="price"
              type="number"
              value={this.state.newRecord.price}
              onChange={this.handleInputChange}
              variant="outlined"
              sx={{
                marginBottom: 2,
                borderRadius: "12px",
                backgroundColor: "#f5f5f5",
              }}
            />

            <TextField
              label="Brand"
              fullWidth
              margin="normal"
              name="brand"
              value={this.state.newRecord.brand}
              onChange={this.handleInputChange}
              variant="outlined"
              sx={{
                marginBottom: 2,
                borderRadius: "12px",
                backgroundColor: "#f5f5f5",
              }}
            />

            <TextField
              label="Date of Purchase"
              fullWidth
              margin="normal"
              name="date"
              type="date"
              value={this.state.newRecord.date}  // Ensure the date is in the format yyyy-mm-dd
              onChange={this.handleInputChange}
              variant="outlined"
              sx={{
                marginBottom: 2,
                borderRadius: "12px",
              }}
              InputProps={{
                startAdornment: (
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    {this.state.newRecord.date ?
                      // Format the date to dd/mm/yyyy
                      new Date(this.state.newRecord.date).toLocaleDateString("en-GB") :
                      "00/00/0000"}
                  </Typography>
                ),
              }}
            />

            <Typography variant="body1" color="text.secondary" mt={2}>
              Upload your Product image
            </Typography>
            <Input
              type="file"
              onChange={this.handleImageChange}
              fullWidth
              margin="dense"
              inputProps={{ accept: "image/*" }}
              sx={{
                marginBottom: 2,
                borderRadius: "12px",
                border: "1px solid #ccc",
                padding: "10px",
                backgroundColor: "#f5f5f5",
              }}
            />
            {this.state.selectedImage ? (
              <Box mt={2} sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Selected Image:
                </Typography>
                <img
                  src={URL.createObjectURL(this.state.selectedImage)}
                  alt="Preview"
                  width="100"
                  style={{ borderRadius: "8px" }}
                />
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {this.state.selectedImage.name}
                </Typography>
              </Box>
            ) : (
              <Box mt={2} sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Existing Image:
                </Typography>
                <img
                  src={this.state.newRecord.image} // Use the existing image
                  alt="Existing"
                  width="100"
                  style={{ borderRadius: "8px" }}
                />
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {this.state.newRecord.image.split('/').pop()} {/* Display the image name */}
                </Typography>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ padding: "20px 30px", justifyContent: "center" }}>
            <Button
              onClick={this.handleCloseEditDialog}
              color="error"
              variant="outlined"
              sx={{
                width: 150,
                borderRadius: "25px",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#FF1744",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={this.handleSaveEditRecord}
              color="primary"
              variant="contained"
              sx={{
                width: 150,
                backgroundColor: "#9C27B0",
                borderRadius: "25px",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#7B1FA2",
                },
              }}
              disabled={this.state.isLoading}
            >
              {this.state.isLoading ? <CircularProgress size={24} color="inherit" /> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
}

export default Home;