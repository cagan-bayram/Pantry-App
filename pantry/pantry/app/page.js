'use client';
import { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { Typography, Modal, Box, Stack, TextField, Button } from "@mui/material";
import { collection, query, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: '', quantity: 1 });
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleAddUpdateItem = async () => {
    try {
      if (currentItem.id.trim() === '') return;
      const docRef = doc(firestore, 'inventory', currentItem.id);
      await setDoc(docRef, { quantity: currentItem.quantity });
      updateInventory();
      setCurrentItem({ id: '', quantity: 1 });
      setOpen(false);
    } catch (error) {
      console.error("Error adding/updating item: ", error);
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
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search Items"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2, maxWidth: '400px' }}
      />
      <Button variant="contained" onClick={() => setOpen(true)}>Add Item</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box position="absolute" top="50%" left="50%" width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} sx={{ transform: "translate(-50%,-50%)" }}>
          <Typography variant="h6">{currentItem.id ? 'Edit Item' : 'Add Item'}</Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField
              label="Item Name"
              variant="outlined"
              fullWidth
              value={currentItem.id}
              onChange={(e) => setCurrentItem({ ...currentItem, id: e.target.value })}
              disabled={Boolean(currentItem.id)}
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
              {currentItem.id ? 'Update Item' : 'Add Item'}
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box border="1px solid black" width="800px">
        <Box height="100px" display="flex" bgcolor="#ADD8E6" alignItems="center" justifyContent="center">
          <Typography variant="h2" color="#333">Pantry Inventory</Typography>
        </Box>
      </Box>
      <Box>
        {filteredInventory.map(item => (
          <Box key={item.id} display="flex" justifyContent="space-between" alignItems="center" width="400px" p={1} borderBottom="1px solid #ccc">
            <Typography>{item.id}: {item.quantity}</Typography>
            <Box display="flex" gap={1}>
              <Button variant="contained" color="primary" onClick={() => handleEditItem(item)}>Edit</Button>
              <Button variant="contained" color="secondary" onClick={() => handleDeleteItem(item)}>Delete</Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
