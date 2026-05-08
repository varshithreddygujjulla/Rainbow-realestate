const Project = require('../models/Project');
const Enquiry = require('../models/Enquiry');

// ================= HOME =================
const getHomePage = async (req, res) => {
  try {
    const featuredProjects = await Project.find({ isFeatured: true })
      .select('name slug location heroImage')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    const ongoingProjects = await Project.find({ category: 'Ongoing' })
      .select('name slug location heroImage')
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();

    res.render('public/home', {
      title: 'Home - Rainbow Developers & Agro Farms',
      featuredProjects,
      ongoingProjects
    });

  } catch (error) {
    console.error('Home error:', error.message);
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'Failed to load home page'
    });
  }
};

// ================= ABOUT =================
const getAboutPage = async (req, res) => {
  res.render('public/about', {
    title: 'About Us'
  });
};

// ================= COMPLETED =================
const getCompletedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ category: 'Completed' })
  .select(`
    name
    slug
    location
    heroImage
    totalArea
    plotArea
    approvalType
    statusText
    shortDescription
  `)
  .sort({ createdAt: -1 })
  .lean();

    res.render('public/completedProjects', {
      title: 'Completed Projects',
      projects
    });

  } catch (error) {
    console.error('Completed error:', error.message);
    res.status(500).render('error', { title: 'Error' });
  }
};

// ================= ONGOING =================
const getOngoingProjects = async (req, res) => {
  try {
    const projects = await Project.find({ category: 'Ongoing' })
  .select(`
    name
    slug
    location
    heroImage
    totalArea
    plotArea
    approvalType
    statusText
    shortDescription
  `)
  .sort({ createdAt: -1 })
  .lean();

    res.render('public/ongoingProjects', {
      title: 'Ongoing Projects',
      projects
    });

  } catch (error) {
    console.error('Ongoing error:', error.message);
    res.status(500).render('error', { title: 'Error' });
  }
};

// ================= PROJECT DETAILS =================
const getProjectDetails = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug }).lean();

    if (!project) {
      return res.status(404).render('404', {
        title: 'Not Found'
      });
    }

    res.render('public/projectDetails', {
      title: project.name,
      project
    });

  } catch (error) {
    console.error('Details error:', error.message);
    res.status(500).render('error', { title: 'Error' });
  }
};

// ================= TESTIMONIALS =================
const getTestimonialsPage = (req, res) => {
  res.render('public/testimonials', {
    title: 'Testimonials'
  });
};

// ================= CONTACT =================
const getContactPage = (req, res) => {
  res.render('public/contact', {
    title: 'Contact Us'
  });
};

// ================= ENQUIRY =================
const submitEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message, projectId, projectName } = req.body;

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      req.flash('error', 'All fields are required');
      return res.redirect('/contact');
    }

    // basic validation
    if (!email.includes('@') || phone.length < 8) {
      req.flash('error', 'Invalid email or phone');
      return res.redirect('/contact');
    }

    await Enquiry.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message || '',
      projectId: projectId || null,
      projectName: projectName || null,
      status: 'New'
    });

    req.flash('success', 'Enquiry submitted successfully');
    res.redirect(req.get('referer') || '/contact');

  } catch (error) {
    console.error('Enquiry error:', error.message);
    req.flash('error', 'Something went wrong');
    res.redirect('/contact');
  }
};

module.exports = {
  getHomePage,
  getAboutPage,
  getCompletedProjects,
  getOngoingProjects,
  getProjectDetails,
  getTestimonialsPage,
  getContactPage,
  submitEnquiry
};