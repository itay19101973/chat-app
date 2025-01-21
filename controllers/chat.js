



exports.getChatPage =(req,res)=>{
   if(req.session.loggedIn){
       res.render('chat', {title: 'Chat'});
   }
   else{
       res.redirect('/login');
   }
}