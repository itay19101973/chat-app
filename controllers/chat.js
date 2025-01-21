



exports.getChatPage =(req,res)=>{
   if(req.session.loggedIn){
       res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
       res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
       res.setHeader('Expires', '0');
       res.render('chat', {title: 'Chat' , userName:req.session.userName});
   }
   else{
       res.redirect('/login');
   }
}