/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const shortid = require("shortid");  




module.exports = function (app, db) {
  
  const issueBase = db.db("test").collection("issues");    

  app.route('/api/issues/:project')
  
    .get(function (req, res){
    
    const project = req.params.project;
    console.log("project name: "+project);
    const {_id, issue_title, issue_text, created_by, created_on, updated_on, assigned_to, status_text} = req.query;
    let {open} = req.query;
    
    
    // mongo 
    issueBase.findOne({project:project}, (err, data)=>{     
      let proIssues = data.issues;
            
      
      if(_id){
      proIssues = proIssues.filter(d=>d._id==_id);
      console.log("issues filtered with id :"+_id);
      }
      if(issue_title){
      proIssues = proIssues.filter(d=>d.issue_title==issue_title);
      console.log("issues filtered with: issue_title");
      }
       if(issue_text){
      proIssues = proIssues.filter(d=>d.issue_text==issue_text);
      console.log("issues filtered with: issue_text");
      }
       if(created_by){
      proIssues = proIssues.filter(d=>d.created_by==created_by);
      console.log("issues filtered with: created_by");
      }      
      if(created_on){
      proIssues = proIssues.filter(d=>d.created_on==created_on);
      console.log("issues filtered with: created_on");
      }
      
      if(updated_on){
      proIssues = proIssues.filter(d=>d.updated_on==updated_on);
      console.log("issues filtered with: updated_on");
      }
       if(assigned_to){
      proIssues = proIssues.filter(d=>d.assigned_to==assigned_to);
      console.log("issues filtered with: assigned_to");
      }
       if(status_text){
      proIssues = proIssues.filter(d=>d.status_text==status_text);
      console.log("issues filtered with: status_text");
      }
      if(open){
        open = (open==="false")?false:true;
      proIssues = proIssues.filter(d=>d.open== open);
      console.log("issues filtered with: open");
      }
     proIssues.sort((a,b)=>b.created_on - a.created_on);
      res.json(proIssues);
     // console.log("issues produced :"+JSON.stringify(proIssues));     
     
      })
  })
  .post(function(req, res, next){
     var project = req.params.project; 
     const {issue_title, issue_text, created_by, assigned_to, status_text} = req.body;
     const _id = shortid.generate();
     const newIssue = {
      _id:_id,
      issue_title,
      issue_text,
      created_on: new Date(),
      updated_on: new Date(),
      created_by,
      assigned_to,
      status_text,
      open:true
    }; 
    if(!issue_title || !issue_text || !created_by){
      res.json("missing required fields")
    }
  
    issueBase.findOneAndUpdate({project:project}, {$push:{issues:newIssue}}, {upsert:true});
    res.json(newIssue);
    
    
  })
    
    .put(function (req, res, next){
      var project = req.params.project; 
     let {_id, issue_title, issue_text, created_by, assigned_to, status_text, open} = req.body;
    
          
    issueBase.updateOne({"issues._id":_id},
                     {$set:{"issues.$.issue_title":issue_title?issue_title:()=>{"issues.$.issue_title"},
                           "issues.$.issue_text":issue_text?issue_text:()=>{"issues.$.issue_text"},
                            "issues.$.updated_on":new Date(),
                            //"issues.$.created_by":created_by,
                            //"issues.$.created_on": created_on,
                            "issues.$.assigned_to":assigned_to?assigned_to:()=>{"issues.$.assigned_to"},
                            "issues.$.status_text":status_text?status_text:()=>{"issues.$.status_text"},
                            "issues.$.open":open?false:()=>{"issues.$.open"}  
                           }}, (err, doc)=>{
      if(err){        
        console.log("could not update " + _id);
        res.json("could not update "+ _id);
      }else if(doc.modifiedCount==0){
        console.log("could not update "+ _id);
        res.json("could not update "+ _id);
      }else  if(!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open){
      console.log("no updated field sent");
      res.json("no updated field sent");
      }else{        
          console.log("successfully updated");
          res.json("successfully updated");     
      }
    });
  })
    
    .delete(function (req, res){
     //var project = req.params.project;
    const {_id} = req.body;
    issueBase.updateOne({"issues._id":_id}, 
                        {$pull: {issues:{_id:req.body._id}}}, 
                        (err, doc)=>{
      if(err){
        console.log(err);
      }else if(!_id){
        console.log("_id error")
        res.json("_id error")
      }else if(doc.modifiedCount==0){
        console.log("failed: could not delete "+ _id);
        res.json({failed: "could not delete "+ _id});
      }else{
        res.json({success:"deleted "+_id});
      }
    });   
    
  });
};
