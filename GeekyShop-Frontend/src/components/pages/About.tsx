import { Component } from "react";
import { Box, Typography, Grid, Card } from "@mui/material";
import UndrawEmptyCart from "../../assets/undrawEmptyCart.png";
import UndrawGroceries from "../../assets/undrawGroceries.png";
import UndrawShoppingApp from "../../assets/undrawShoppingApp.png";
import UndrawShoppingBags from "../../assets/undrawShoppingBags.png";
import Logo1 from "../../assets/logo1.png";

class About extends Component {
    render() {
        return (
            <Box sx={{ padding: 4, backgroundColor: "#f4f7fc", borderRadius: 2, boxShadow: 3 }}>
                {/* Title Section */}
                <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#6a1b9a" }}>
                    Geeky-Shop
                </Typography>

                {/* Description Section */}
                <Typography variant="h5" align="center" paragraph sx={{ fontSize: "1.1rem", color: "#4a4a4a", maxWidth: "900px", margin: "0 auto" }}>
                    Geeky-Shop is a powerful e-commerce platform that allows users to efficiently manage product records, including product ID, title, description, price, brand, and image. This application demonstrates CRUD (Create, Read, Update, Delete) operations seamlessly and more flexible features after login/signup.
                </Typography>

                {/* Logo Section */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <img
                        src={Logo1}
                        alt="Geeky-Shop Logo"
                        style={{
                            border: "15px solid black",
                            borderRadius: "8px",
                            padding: "10px",
                            maxWidth: "200px",
                            height: "auto",
                            transition: "transform 0.3s ease-in-out",
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                </Box>

                <Typography variant="h6" align="center" paragraph sx={{
                    color: "#4a4a4a",
                    maxWidth: "800px",
                    margin: "0 auto",
                    mt: 4,
                }}>
                    Our platform simplifies product management with an intuitive interface that enables users to add new products, edit existing ones, remove outdated items, and view a complete list of available products.
                </Typography>

                {/* Visual Section */}
                <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
                    {[
                        { src: UndrawEmptyCart, alt: "Empty Cart", title: "Manage Inventory", bgColor: "#f7d35e" },
                        { src: UndrawGroceries, alt: "Groceries", title: "Product Catalog", bgColor: "#66bb6a" },
                        { src: UndrawShoppingApp, alt: "Shopping App", title: "Easy Interface", bgColor: "#42a5f5" },
                        { src: UndrawShoppingBags, alt: "Shopping Bags", title: "Order Management", bgColor: "#ff7043" }
                    ].map((item, index) => (
                        <Grid sx={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", maxWidth: "300px", margin: "0 auto" }} key={index}>
                            <Card
                                sx={{
                                    padding: 3,
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    '&:hover': {
                                        transform: "scale(1.05)",
                                        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)"
                                    },
                                    backgroundColor: item.bgColor, // Background color changes based on the item
                                    marginBottom: 4, // Added bottom margin for balance between cards
                                }}
                            >
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    style={{
                                        maxWidth: "100%",
                                        height: "auto",
                                        objectFit: "contain",
                                        borderRadius: "8px",
                                        marginBottom: "16px", // Space between image and title
                                    }}
                                />
                                <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: "bold", fontSize: "1.1rem" }}>
                                    {item.title}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Key Features Section */}
                <Typography variant="h5" paragraph sx={{ mt: 4, fontWeight: "bold", color: "#6a1b9a", textAlign: 'center' }}>
                    Key Features of Geeky-Shop:
                </Typography>
                {[
                    { feature: "Create", description: "Users can add new products by providing details such as title, description, price, and brand." },
                    { feature: "Read", description: "View a complete list of all products with detailed information." },
                    { feature: "Update", description: "Modify existing product information to keep data up to date." },
                    { feature: "Delete", description: "Remove outdated or unnecessary products from the system." }
                ].map((item, index) => (
                    <Typography variant="body1" paragraph key={index} sx={{ fontSize: "1rem", color: "#5f6368", lineHeight: 1.6, textAlign: 'center' }}>
                        - <strong>{item.feature}:</strong> {item.description}
                    </Typography>
                ))}

                {/* Efficiency Section */}
                <Typography variant="h5" paragraph sx={{ mt: 4, fontWeight: "bold", color: "#6a1b9a", textAlign: 'center' }}>
                    Designed for Efficiency
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: "#4a4a4a", maxWidth: "900px", textAlign: 'center', margin: "0 auto" }}>
                    Geeky-Shop is designed to make product management simple and intuitive. With a user-friendly interface and seamless backend interactions, users can efficiently organize their inventory with minimal effort.
                </Typography>

                {/* Designer Section */}
                <Typography variant="h5" paragraph sx={{ mt: 4, fontWeight: "bold", color: "#6a1b9a", textAlign: 'center' }}>
                    Design & Development
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: "#4a4a4a", maxWidth: "900px", textAlign: 'center', margin: "0 auto" }}>
                    <strong>Geeky-Shop</strong> is designed with <strong>❤️</strong> and developed by <strong>Deepanshu Bajaj</strong>.
                </Typography>


            </Box>
        );
    }
}

export default About;
