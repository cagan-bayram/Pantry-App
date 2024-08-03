'use client';
import { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { Typography, Modal, Box, Stack, TextField, Button, Card, CardContent, CardActions } from "@mui/material";
import { collection, query, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: '', quantity: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false); // New state to track if we are editing


  const handleAddUpdateItem = async () => {
    try {
      if (currentItem.id.trim() === '') return;
      if (currentItem.quantity < 0) { // Added validation
        alert("Quantity cannot be less than zero.");
        return;
      }
      const docRef = doc(firestore, 'inventory', currentItem.id);
      await setDoc(docRef, { quantity: currentItem.quantity });
      updateInventory();
      setCurrentItem({ id: '', quantity: 1 });
      setOpen(false);
      setIsEditing(false); // Reset the editing state
    } catch (error) {
      console.error("Error adding/updating item: ", error);
    }
  };

  
  const updateInventory = async () => {
    try {
      const q = query(collection(firestore, 'inventory'));
      const docs = await getDocs(q);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({ id: doc.id, ...doc.data() });
      });
      setInventory(inventoryList);
      setFilteredInventory(inventoryList);
    } catch (error) {
      console.error("Error fetching inventory: ", error);
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      const docRef = doc(firestore, 'inventory', item.id);
      await deleteDoc(docRef);
      updateInventory();
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  const handleEditItem = (item) => {
    setCurrentItem(item);
    setOpen(true);
    setIsEditing(true); // Set editing state to true when editing an item
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(
        inventory.filter(item =>
          item.id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, inventory]);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" p={3}>
      <Box width="100%" maxWidth="600px" mb={3}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search Items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <Button variant="contained" onClick={() => { setOpen(true); setIsEditing(false); setCurrentItem({ id: '', quantity: 1 }); }} sx={{ mb: 3 }}>
        Add Item
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="background.paper"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6">{isEditing ? 'Edit Item' : 'Add Item'}</Typography>
          <Stack width="100%" direction="column" spacing={2} mt={2}>
            <TextField
              label="Item Name"
              variant="outlined"
              fullWidth
              value={currentItem.id}
              onChange={(e) => setCurrentItem({ ...currentItem, id: e.target.value })}
              disabled={isEditing} // Disable only if editing
            />
            <TextField
              label="Quantity"
              type="number"
              variant="outlined"
              fullWidth
              value={currentItem.quantity}
              onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value, 10) })}
            />
            <Button variant="contained" onClick={handleAddUpdateItem}>
              {isEditing ? 'Update Item' : 'Add Item'}
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Typography variant="h4" gutterBottom>Pantry Inventory</Typography>
      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
        {filteredInventory.map(item => (
          <Card key={item.id} sx={{ width: 300 }}>
            <CardContent>
              <Typography variant="h6">{item.id}</Typography>
              <Typography color="textSecondary">Quantity: {item.quantity}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={() => handleEditItem(item)}>Edit</Button>
              <Button size="small" color="secondary" onClick={() => handleDeleteItem(item)}>Delete</Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
