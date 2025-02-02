const AboutPageTitle = 'About Page';

/**
 * Renders the About page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} Sends the rendered 'about' page with the provided title.
 */
exports.getAboutModal = (req, res) => {
    res.render('about', { title: AboutPageTitle });
}