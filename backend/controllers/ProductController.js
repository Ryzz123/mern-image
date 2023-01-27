import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";

export const getProduct = async (req, res) => {
  try {
    const response = await Product.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const response = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const saveProduct = async (req, res) => {
  if (req.files === null) return res.status(400).json({ message: "No file Uploader" });
  const name = req.body.title;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowType = [".png", ".jpg", "jpeg"];

  if (!allowType.includes(ext.toLowerCase())) return res.status(422).json({ message: "Invalid Images" });
  if (fileSize > 5000000) return res.status(422).json({ message: "Image must be less then 5 MB" });

  file.mv(`./public/images/${fileName}`, async (error) => {
    if (error) return res.status(500).json({ message: error.message });
    try {
      await Product.create({
        name: name,
        image: fileName,
        url: url,
      });
      res.status(201).json({ message: "Product Created Succesfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

export const updateProduct = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ message: "No data found" });
  let fileName = "";
  if (req.files === null) {
    fileName = product.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowType = [".png", ".jpg", "jpeg"];

    if (!allowType.includes(ext.toLowerCase())) return res.status(422).json({ message: "Invalid Images" });
    if (fileSize > 5000000) return res.status(422).json({ message: "Image must be less then 5 MB" });

    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (error) => {
        if (error) return res.status(500).json({ message: error.message });
      });
  }
  const name = req.body.title;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  try {
    await Product.update({name: name, image: fileName, url: url},{
        where: {
            id: req.params.id
        }
    });
    res.status(200).json({message: "Product Updated successfuly"});
  } catch (error) {
    res.status(404).json({message: error.message});
  }
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!product) return res.status(404).json({ message: "No data found" });
  try {
    const filepath = `./public/images/${product.image}`;
    fs.unlinkSync(filepath);
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
