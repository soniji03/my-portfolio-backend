// controllers/postController.js
const Post = require('../models/Post');

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const post = new Post({ ...req.body, author: req.userId });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      req.body,
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });
    res.json(post);
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.userId });
    if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};