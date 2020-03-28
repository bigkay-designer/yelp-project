let log = console.log

let mongoose = require('mongoose')
let campground = require('./models/campground')
let comment = require('./models/comments')

let data = [
    {
        name: 'cloud so high',
        image: 'https://cdn.pixabay.com/photo/2016/11/14/04/43/boy-1822631__340.jpg',
        desc: 'balh blah blah'
    },
    {
        name: 'nature',
        image: 'https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677__340.jpg',
        desc: 'balh blah blah'
    },
    {
        name: 'high school',
        image: 'https://cdn.pixabay.com/photo/2016/11/08/05/03/adventure-1807495__340.jpg',
        desc: 'balh blah blah'
    }
]
function seedDB() {
    campground.deleteMany({}, (err) => {
        if (err) {
            log(err)
        }
        log('removed campgrounds')

        // comment.deleteMany({}, (err)=> {
        //     if (err) {
        //         log(err)
        //     }
        //     log('removed comment')
        // })

        // //add data
        // data.forEach((seed) =>{
        //     campground.create(seed, (err, campground) => {
        //         if (err) {
        //             log(err)
        //         } else {
        //             log('camps added')
        //             // create a comment
        //             comment.create(
        //                 {
        //                     text: 'i dont like this camp',
        //                     author: 'bigkay'
        //                 }, (err, comment) => {
        //                     if(err) {
        //                         log(err)
        //                     }else{
        //                         // log(campground)
        //                         campground.comments.push(comment)
        //                         campground.save()
        //                         log('comment added')
        //                     }
        //                 }
        //             )
        //         }
        //     })
        // })
    })
}

module.exports = seedDB

