const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint
// find all categories
router.get("/", async (req, res) => {
  try {
    // variable to gather all categories and products associated with them
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });

    // variable to gather categories and products with no metadata
    const serializedCategories = categoryData.map((category) =>
      category.get({ plain: true })
    );

    res.status(200).json(serializedCategories);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// The `/api/categories/:id` endpoint
// find one category by its `id` value
router.get("/:id", async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!categoryData)
      return res.status(404).json({ message: "No category found." });

    const serializedCategory = categoryData.get({ plain: true });

    res.status(200).json(serializedCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// The `/api/categories/` endpoint
// create a new category
router.post("/", async (req, res) => {
  try {
    const newCategory = await Category.create({
      category_name: req.body.category_name,
    });
    res.status(201).json(newCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json(error); // 500 - Internal Server Error
  }
});

// The `/api/categories/:id` endpoint
// update a new category by id
router.put("/:id", async (req, res) => {
  try {
    // pass in req.body to only update what's sent over by the client
    const updatedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // if no category was updated, let client know the category was not found
    if (!updatedCategory[0])
      return res
        .status(404)
        .json({ message: "No category found with that id." }); // 404 - Not Found

    res.status(202).json(updatedCategory); // 202 - Accepted
  } catch (error) {
    console.log(error);
    res.status(500).json(error); // 500 - Internal Server Error
  }
});

// The `/api/categories/:id` endpoint
// delete a category by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const deleteCategory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    // if no category was deleted, let client know the category was not found
    if (!deleteCategory)
      return res
        .status(404)
        .json({ message: "No category found with that id." }); // 404 - Not Found

    res.status(202).json(deleteCategory); // 202 - Accepted
  } catch (error) {
    console.log(error);
    res.status(500).json(error); // 500 - Internal Server Error
  }
});

module.exports = router;
