const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Document = mongoose.model('Document')
const requireLogin = require('../requireLogin')

router.get("/documents",requireLogin,(req,res) =>{
    Document.find({users:req.user._id})
    .then(documents => res.json({documents}))
})

router.put("/documentIds",requireLogin,(req,res) =>{
    const {docId} = req.body
    Document.findById(docId).then(resp => {
        if(resp){
            console.log(true)
            return res.json(true);
        }
        else{
            console.log(false)
            return res.json(false);
        }
    })
})

router.put("/api/joinDoc",requireLogin,(req, res) =>{
    const {docId} = req.body
    User.findByIdAndUpdate(req.user._id,{$push:{documents:docId}},{new:true},(err,result)=>{
        if(err){
            return res.status(422).json({error:err})            
        }
        Document.findByIdAndUpdate(docId,{$push:{users:req.user._id}},{new:true},(err,result)=>{
            if(err){
                return res.status(422).json({error:err})  
            }
            console.log(result)
        })
    })
})

module.exports = router