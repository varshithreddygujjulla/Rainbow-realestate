const Project = require('../models/Project');
const { deleteUploadedFile } = require('../utils/upload');
const { extractYouTubeId } = require('../utils/helpers');

// ================= SAFE FILE DELETE =================
const safeDeleteFile = (url) => {
  try {
    if (url) deleteUploadedFile(url);
  } catch (err) {
    console.error('File delete error:', err.message);
  }
};

// ================= HELPER: PARSE LIST =================
const parseList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((s) => String(s).trim()).filter(Boolean);
  return String(value)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
};

// ================= HELPER: PARSE PHASES =================
const parsePhases = (body) => {
  const names = body['phaseName'];
  const areas = body['phaseArea'];
  const sqYards = body['phaseSqYards'];
  const tlpNos = body['phaseTlpNo'];

  if (!names) return [];

  const arrName = Array.isArray(names) ? names : [names];
  const arrArea = Array.isArray(areas) ? areas : [areas];
  const arrSq = Array.isArray(sqYards) ? sqYards : [sqYards];
  const arrTlp = Array.isArray(tlpNos) ? tlpNos : [tlpNos];

  const phases = [];

  for (let i = 0; i < arrName.length; i++) {
    if (arrName[i] && arrName[i].trim()) {
      phases.push({
        phaseName: (arrName[i] || '').trim(),
        area: (arrArea[i] || '').trim(),
        sqYards: (arrSq[i] || '').trim(),
        tlpNo: (arrTlp[i] || '').trim()
      });
    }
  }

  return phases;
};

// ================= GET PROJECTS LIST =================
const getProjectsList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('name slug location category statusText totalArea isFeatured photos videos createdAt');

    res.render('owner/projects-list', {
      title: 'All Projects - Owner',
      projects,
      currentPage: page
    });
  } catch (error) {
    console.error('❌ Error fetching projects:', error.message);
    req.flash('error', 'Failed to fetch projects');
    res.redirect('/owner/dashboard');
  }
};

// ================= ADD PROJECT PAGE =================
const getAddProjectPage = async (req, res) => {
  res.render('owner/add-project', {
    title: 'Add New Project - Owner'
  });
};

// ================= CREATE PROJECT =================
const createProject = async (req, res) => {
  try {
    const {
      name, location, district, category,
      totalArea, plotArea, approvalType, statusText,
      completedYear, shortDescription, description,
      amenities, highlights, isFeatured
    } = req.body;

    if (!name?.trim() || !location?.trim() || !category?.trim()) {
      req.flash('error', 'Required fields missing');
      return res.redirect('/owner/projects/add');
    }

    // 🔥 Prevent duplicates
    const existing = await Project.findOne({ name: name.trim() });
    if (existing) {
      req.flash('error', 'Project already exists');
      return res.redirect('/owner/projects/add');
    }

    const projectData = {
      name: name.trim(),
      location: location.trim(),
      district: district || '',
      category,
      totalArea: totalArea || '',
      plotArea: plotArea || '',
      approvalType: approvalType || '',
      statusText: statusText || '',
      completedYear: completedYear && !isNaN(completedYear) ? Number(completedYear) : null,
      shortDescription: shortDescription || '',
      fullDescription: description || '',
      amenities: parseList(amenities),
      highlights: parseList(highlights),
      phases: parsePhases(req.body),
      isFeatured: isFeatured === 'on' || isFeatured === 'true'
    };

    // ✅ HERO IMAGE - USE CLOUDINARY PATH
    if (req.files?.heroImage?.length > 0) {
      const f = req.files.heroImage[0];
      projectData.heroImage = {
        url: f.path,
        filename: f.filename
      };
    }

    // ✅ PHOTOS - USE CLOUDINARY PATHS
    if (req.files?.photos?.length > 0) {
      projectData.photos = req.files.photos.map((f) => ({
        url: f.path,
        filename: f.filename
      }));
    }

    const project = new Project(projectData);
    await project.save();

    req.flash('success', `Project "${name}" created`);
    res.redirect(`/owner/projects/edit/${project._id}`);

  } catch (error) {
    console.error('❌ Error creating project:', error.message);
    req.flash('error', error.message);
    res.redirect('/owner/projects/add');
  }
};

// ================= EDIT PAGE =================
const getEditProjectPage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      req.flash('error', 'Project not found');
      return res.redirect('/owner/projects');
    }

    res.render('owner/edit-project', {
      title: `Edit ${project.name}`,
      project
    });

  } catch (error) {
    console.error('❌ Error fetching project:', error.message);
    req.flash('error', 'Failed to load project');
    res.redirect('/owner/projects');
  }
};

// ================= UPDATE PROJECT =================
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body.name?.trim()) {
      req.flash('error', 'Name is required');
      return res.redirect(`/owner/projects/edit/${id}`);
    }

    const project = await Project.findById(id);
    if (!project) {
      req.flash('error', 'Project not found');
      return res.redirect('/owner/projects');
    }

    Object.assign(project, {
      name: req.body.name.trim(),
      location: req.body.location,
      district: req.body.district || '',
      category: req.body.category,
      totalArea: req.body.totalArea || '',
      plotArea: req.body.plotArea || '',
      approvalType: req.body.approvalType || '',
      statusText: req.body.statusText || '',
      completedYear: req.body.completedYear && !isNaN(req.body.completedYear)
        ? Number(req.body.completedYear)
        : null,
      shortDescription: req.body.shortDescription || '',
      fullDescription: req.body.description || '',
      amenities: parseList(req.body.amenities),
      highlights: parseList(req.body.highlights),
      phases: parsePhases(req.body),
      isFeatured: req.body.isFeatured === 'on'
    });

    await project.save();

    req.flash('success', 'Project updated');
    res.redirect('/owner/projects');

  } catch (error) {
    console.error('❌ Error updating:', error.message);
    req.flash('error', error.message);
    res.redirect(`/owner/projects/edit/${req.params.id}`);
  }
};

// ================= DELETE PROJECT =================
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      req.flash('error', 'Project not found');
      return res.redirect('/owner/projects');
    }

    safeDeleteFile(project.heroImage?.url);
    project.photos?.forEach(p => safeDeleteFile(p?.url));

    await Project.findByIdAndDelete(req.params.id);

    req.flash('success', 'Project deleted');
    res.redirect('/owner/projects');

  } catch (error) {
    console.error('❌ Error deleting:', error.message);
    req.flash('error', 'Delete failed');
    res.redirect('/owner/projects');
  }
};

// ================= ADD VIDEO =================
const addVideo = async (req, res) => {
  try {
    const { videoTitle, videoUrl } = req.body;

    if (!videoUrl) {
      req.flash('error', 'Video URL required');
      return res.redirect('back');
    }

    const project = await Project.findById(req.params.id);

    project.videos.push({
      title: videoTitle || 'Video',
      url: videoUrl
    });

    await project.save();

    res.redirect(`/owner/projects/${req.params.id}/edit`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to add video');
    res.redirect('back');
  }
};

// ================= DELETE VIDEO =================
const deleteVideo = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    project.videos.pull(req.params.videoId);
    await project.save();

    req.flash('success', 'Video deleted');
    res.redirect('back');

  } catch (error) {
    console.error('❌ Error:', error.message);
    req.flash('error', 'Failed');
    res.redirect('back');
  }
};

// ================= UPLOAD PHOTOS =================
const uploadPhotos = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    // ✅ USE CLOUDINARY PATHS
    const newPhotos = req.files.map(file => ({
      url: file.path,
      filename: file.filename
    }));

    project.photos.push(...newPhotos);

    await project.save();

    res.redirect(`/owner/projects/${req.params.id}/edit`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Photo upload failed');
    res.redirect('back');
  }
};

// ================= DELETE PHOTO =================
const deletePhoto = async (req, res) => {
  try {
    const { id, photoId } = req.params;

    const project = await Project.findById(id);

    project.photos = project.photos.filter(
      p => p._id.toString() !== photoId
    );

    await project.save();

    res.redirect(`/owner/projects/${id}/edit`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Delete failed');
    res.redirect('back');
  }
};

// ================= HERO IMAGE =================
const uploadHeroImage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project.heroImage?.url) {
      safeDeleteFile(project.heroImage.url);
    }

    // ✅ USE CLOUDINARY PATH
    project.heroImage = {
      url: req.file.path,
      filename: req.file.filename
    };

    await project.save();

    res.redirect(`/owner/projects/${req.params.id}/edit`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Hero upload failed');
    res.redirect('back');
  }
};

module.exports = {
  getProjectsList,
  getAddProjectPage,
  createProject,
  getEditProjectPage,
  updateProject,
  deleteProject,
  uploadHeroImage,
  uploadPhotos,
  deletePhoto,
  addVideo,       
  deleteVideo
};