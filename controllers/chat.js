const chatPageTitle = 'Chat';

/**
 * Renders the Chat page if the user is logged in, otherwise redirects to the login page.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.session - The session object.
 * @param {boolean} req.session.loggedIn - Indicates if the user is logged in.
 * @param {string} req.session.userName - The username of the logged-in user.
 * @param {Object} res - The response object.
 * @returns {void} Renders the 'chat' page with user details or redirects to '/login'.
 */
exports.getChatPage =(req,res)=>{
   if(req.session.loggedIn){
       res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
       res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
       res.setHeader('Expires', '0');
       res.render('chat', {title: chatPageTitle, userName:req.session.userName});
   }
   else{
       res.redirect('/login');
   }
}