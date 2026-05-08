const Enquiry = require('../models/Enquiry');

// ==================== LIST ENQUIRIES ====================
const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .populate('projectId', 'name slug');

    res.render('owner/enquiries', {
      title: 'Enquiries - Owner',
      enquiries
    });
  } catch (error) {
    console.error('❌ Error listing enquiries:', error.message);
    req.flash('error', 'Failed to load enquiries');
    res.redirect('/owner/dashboard');
  }
};

// ==================== UPDATE ENQUIRY STATUS ====================
const updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['New', 'Contacted', 'Interested', 'Not Interested'];
    if (!allowed.includes(status)) {
      req.flash('error', 'Invalid status');
      return res.redirect('/owner/enquiries');
    }

    await Enquiry.findByIdAndUpdate(id, { status });
    req.flash('success', `Enquiry status updated to \"${status}\"`);
    res.redirect('/owner/enquiries');
  } catch (error) {
    console.error('❌ Error updating enquiry:', error.message);
    req.flash('error', 'Failed to update enquiry');
    res.redirect('/owner/enquiries');
  }
};

// ==================== DELETE ENQUIRY ====================
const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await Enquiry.findByIdAndDelete(id);
    req.flash('success', 'Enquiry deleted successfully');
    res.redirect('/owner/enquiries');
  } catch (error) {
    console.error('❌ Error deleting enquiry:', error.message);
    req.flash('error', 'Failed to delete enquiry');
    res.redirect('/owner/enquiries');
  }
};

module.exports = {
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry
};
