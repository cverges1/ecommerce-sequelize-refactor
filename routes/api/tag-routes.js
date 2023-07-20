const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    // variable to gather all tags and products associated with them
    const tagData = await Tag.findAll({
      include: [ { model: Product }
      ],
    });

    // variable to gather tags and products associated with no metadata
    const serializedTags = tagData.map((tag) =>
      tag.get({ plain: true })
    );

    res.status(200).json(serializedTags);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    // variable to gather all tags and products associated with them
    const tagData = await Tag.findByPk(req.params.id, {
      include: [ { model: Product }
      ],
    });

    if (!tagData)
      return res
        .status(404)
        .json({ message: "No tag found with that id." });

    // variable to gather tags and products associated with no metadata
    const serializedTags = tagData.get({ plain: true });

    res.status(200).json(serializedTags);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
    /* req.body should look like this...
    {
      "tag_name": "Silver"
    }
  */
  try {
    const newTag = await Tag.create({
      tag_name: req.body.tag_name,
    });
    res.status(201).json(newTag);
  } catch (error) {
    console.log(error);
    res.status(500).json(error); // 500 - Internal Server Error
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    // pass in req.body to only update what's sent over by the client
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // if no category was updated, let client know the category was not found
    if (!updatedTag[0])
      return res
        .status(404)
        .json({ message: "No tag found with that id." }); // 404 - Not Found

    res.status(202).json(updatedTag); // 202 - Accepted
  } catch (error) {
    console.log(error);
    res.status(500).json(error); // 500 - Internal Server Error
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deleteTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    // if no category was deleted, let client know the category was not found
    if (!deleteTag)
      return res
        .status(404)
        .json({ message: "No category found with that id." }); // 404 - Not Found

    res.status(202).json(deleteTag); // 202 - Accepted
  } catch (error) {
    console.log(error);
    res.status(500).json(error); // 500 - Internal Server Error
  }
});

module.exports = router;
