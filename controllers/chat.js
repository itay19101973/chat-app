



exports.getChatPage =(req,res)=>{
   if(req.session.loggedIn){
       res.render('chat', {title: 'Chat' , username:req.session.username});
   }
   else{
       res.redirect('/login');
   }
}