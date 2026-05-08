const Owner = require('../models/Owner');
const Project = require('../models/Project');
const Enquiry = require('../models/Enquiry');

// ==================== GET LOGIN PAGE ====================
const getLoginPage = async (req, res) => {
  try {
    console.log('📄 Rendering login page...');
    res.render('owner/login', {
      title: 'Owner Login - Rainbow Developers & Agro Farms'
    });
  } catch (error) {
    console.error('❌ Error rendering login page:', error.message);
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'Failed to load login page'
    });
  }
};

// ==================== LOGIN OWNER ====================
const loginOwner = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(`🔐 Login attempt for username: ${username}`);

    // Basic validation
    if (!username || !password) {
      console.warn('⚠️  Missing username or password');
      req.flash('error', 'Username and password are required');
      return res.redirect('/owner/login');
    }

    // Find owner by username and explicitly select password field (has select: false)
    const owner = await Owner.findOne({ username }).select('+password');

    // Check if owner exists
    if (!owner) {
      console.warn(`⚠️  Owner not found: ${username}`);
      req.flash('error', 'Invalid username or password');
      return res.redirect('/owner/login');
    }

    // Compare password using owner method
    const isPasswordValid = await owner.comparePassword(password);

    if (!isPasswordValid) {
      console.warn(`⚠️  Invalid password for user: ${username}`);
      req.flash('error', 'Invalid username or password');
      return res.redirect('/owner/login');
    }

    // Password is valid - set session
    console.log(`✅ Owner logged in successfully: ${owner.fullName}`);
    
    req.session.isOwner = true;
    req.session.ownerName = owner.fullName;
    req.session.ownerId = owner._id.toString();

    req.flash('success', `Welcome back, ${owner.fullName}!`);
    res.redirect('/owner/dashboard');
  } catch (error) {
    console.error('❌ Error during login:', error.message);
    req.flash('error', 'An error occurred during login. Please try again.');
    res.redirect('/owner/login');
  }
};

// ==================== LOGOUT OWNER ====================
const logoutOwner = async (req, res) => {
  try {
    console.log('🚪 Owner logging out...');

    const ownerName = req.session?.ownerName || 'Owner';

    // ✅ SET FLASH BEFORE DESTROY
    req.flash('success', 'You have been logged out successfully');

    req.session.destroy((err) => {
      if (err) {
        console.error('❌ Error destroying session:', err.message);
        return res.redirect('/owner/dashboard');
      }

      console.log(`✅ Owner logged out: ${ownerName}`);

      res.redirect('/');
    });

  } catch (error) {
    console.error('❌ Error during logout:', error.message);
    res.redirect('/owner/dashboard');
  }
};

// ==================== GET DASHBOARD ====================
const getDashboard = async (req, res) => {
  try {
    console.log('📊 Rendering dashboard...');

    // Fetch total projects count
    const totalProjects = await Project.countDocuments();

    // Fetch completed projects count
    const completedProjects = await Project.countDocuments({ category: 'Completed' });

    // Fetch ongoing projects count
    const ongoingProjects = await Project.countDocuments({ category: 'Ongoing' });

    // Fetch total enquiries count
    const totalEnquiries = await Enquiry.countDocuments();

    // Fetch recent 5 projects
    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name slug category statusText createdAt');

    // Fetch recent 5 enquiries
    const recentEnquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email phone projectName status createdAt');

    console.log(`✅ Dashboard data loaded successfully`);
    console.log(`   Total Projects: ${totalProjects}`);
    console.log(`   Completed: ${completedProjects}, Ongoing: ${ongoingProjects}`);
    console.log(`   Total Enquiries: ${totalEnquiries}`);

    res.render('owner/dashboard', {
      title: 'Dashboard - Owner',
      stats: {
        totalProjects,
        completedProjects,
        ongoingProjects,
        totalEnquiries
      },
      recentProjects,
      recentEnquiries
    });
  } catch (error) {
    console.error('❌ Error rendering dashboard:', error.message);
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'Failed to load dashboard'
    });
  }
};

// ==================== EXPORT CONTROLLERS ====================
module.exports = {
  getLoginPage,
  loginOwner,
  logoutOwner,
  getDashboard
};