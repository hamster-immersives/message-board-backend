const mongoose = require('mongoose');
const Post = require('../model/Post');
const cloudinary = require('cloudinary');
// const moment = require('moment');
const formidable = require('formidable');

const dbErrorHelper = require('../../helpers/dbErrorMessage');

async function cloudinaryUpload(url) {

    cloudinary.config({
        cloud_name: 'dpdy5oem8',
        api_key: '396281338124736',
        api_secret: '1UGKsF3o1MOd78GXZkJQDgQijEM' 
    });

   let result = await cloudinary.uploader.upload(url, function(error, result) {
        if (error) {
            return error;
        } else {
            return result
        }
    });
    return result;
}

module.exports = {
    createPost: async (req, res) => {

        let userID = req.user._id; 
        let form = new formidable.IncomingForm();
        form.keepExtensions = true; 

        form.parse(req, async (err, fields, files) => {
            // console.log(fields);

            // console.log(files.photo.path)
            try {

                if (files.photo) {
                    let { secure_url } = await cloudinaryUpload(files.photo.path);
                    
                let newPostObj = {
                    text: fields.text,
                    photo: secure_url, 
                    postedBy: userID
                }

                let createdPost = await new Post(newPostObj)
                let savedCreatedPost = await createdPost.save();

                let aggregatedPost = await savedCreatedPost
                                               .populate('postedBy', '_id username')
                                               .execPopulate()
                                        
                // let aggregatedPost = await Post.findById(savedCreatedPost._id)
                //                                 .populate('postedBy', '_id username')
                //                                 .exec()

                res.json(aggregatedPost)
                } else {

                    let newPostObj = {
                        text: fields.text,
                        postedBy: userID
                    }
    
                    let createdPost = await new Post(newPostObj)
                    let savedCreatedPost = await createdPost.save();
    
                    let aggregatedPost = await savedCreatedPost
                                                   .populate('postedBy', '_id username')
                                                   .execPopulate()
                     res.json(aggregatedPost)
                }
 

            } catch (e) {
                console.log(e)
                res.status(500).json(dbErrorHelper(e));
            }
        });
    },
    getAllPosts: async (req, res) => {
        try {
            let allPosts = await Post.find({})
                                    .populate('postedBy', '_id username')
                                    .populate('comments.postedBy', '_id username')
                                    .sort('-created')
                                    .exec();

            res.json(allPosts);
        } catch (e) {
            res.status(500).json(dbErrorHelper(e));
        }
    },
    deletePostByID: async (req, res) => {
        const id = req.params.id;
        try {
            let deletedPost = await Post.findByIdAndDelete({_id: id});
            res.json(deletedPost)
        } catch (e) {
            res.status(500).json(dbErrorHelper(e));
        }

    },
    addCommentToPostByID: async (req, res) => {

        let postID = req.body.postID;
        console.log(postID)
        let comment = {
            text: req.body.comment, 
            postedBy: req.user._id
        }   

        try {      

            let success = await Post.findByIdAndUpdate(postID, {$push: {comments: comment}}, {new: true})
                                    .populate('postedBy', '_id username')
                                    .populate('comments.postedBy', '_id username')
                                    .exec();
            //console.log(success)
            res.json(success);
        } catch (e) {
        
            res.status(500).json(dbErrorHelper(e));
        }

    },
    deleteCommentByID: async (req, res) => {

        try {

            let postID = req.params.postID;
            let commentID = req.params.commentID;

            let success = await Post.findByIdAndUpdate(postID, {$pull: { comments: { _id: commentID} }}, {upsert: true, new: true})
                                    .populate('comments.postedBy', '_id name')
                                    .populate('postedBy', '_id name')
                                    .exec();
            
            res.json(success)

        } catch (e) {
            res.status(500).json(dbErrorHelper(e));
        }

    }
}