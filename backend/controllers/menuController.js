import MenuItem from "../models/MenuItem.js";

export const getMenu = async (req, res) => {
  const items = await MenuItem.find({ active: true });
  res.json(items);
};

export const addItem = async (req, res) => {
  const { name, price } = req.body;
  const item = new MenuItem({ name, price });
  await item.save();
  res.json(item);
};

export const updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const updated = await MenuItem.findByIdAndUpdate(id, { name, price }, { new: true });
  res.json(updated);
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;
  await MenuItem.findByIdAndDelete(id);
  res.json({ message: "Item deleted from DB" });
};

