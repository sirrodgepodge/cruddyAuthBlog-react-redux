const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({

    // this property will hold blog post's title
    title: {
        type: String,
        default: 'Title'
    },

    // this property will hold blog post's body
    body: {
        type: String,
        default: 'Body'
    },

    // this property will hold the date the blog post was created
    createdDate: {
        type: Date,
        default: new Date()
    },

    // these property will hold the author's info
    email: String, // author's name
    photo: String, // author's photo (if provided)
    google_link: String, // link to author's google profile (if provided)
    facebook_link: String // link to author's facebook profile (if provided)
});

mongoose.model('Post', PostSchema);
