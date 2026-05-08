const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const compression = require('compression');

require('dotenv').config();

const app = express();

// ================= DATABASE =================
const connectDB = require('./config/database');
connectDB();

// ================= MODELS =================
const SiteSettings = require('./models/SiteSettings');

// ================= VIEW ENGINE =================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ================= MIDDLEWARE =================

// Compression
app.use(compression());

// Static files
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '7d'
}));

app.use('/uploads', express.static(
  path.join(__dirname, 'public/uploads'),
  {
    maxAge: '7d'
  }
));

// Body parser
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

app.use(express.json({
  limit: '10mb'
}));

// Method override
app.use(methodOverride('_method'));

// Trust proxy
app.set('trust proxy', 1);

// ================= SESSION =================
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',

  resave: false,
  saveUninitialized: false,

  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// ================= FLASH =================
app.use(flash());

// ================= GLOBAL LOCALS =================
app.use((req, res, next) => {

  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');

  res.locals.isOwner = req.session?.isOwner || false;
  res.locals.ownerName = req.session?.ownerName || null;

  // Important
  res.locals.req = req;

  next();

});

// ================= GLOBAL SITE SETTINGS =================

let cachedSettings = null;
let lastFetchTime = 0;

app.use(async (req, res, next) => {

  try {

    const now = Date.now();

    // refresh cache every 5 minutes
    if (
      !cachedSettings ||
      now - lastFetchTime > 5 * 60 * 1000
    ) {

      cachedSettings = await SiteSettings.findOne();

      lastFetchTime = now;
    }

    // THIS IS THE IMPORTANT FIX
    res.locals.settings = cachedSettings;

  } catch (error) {

    console.error('Settings middleware error:', error.message);

    res.locals.settings = null;
  }

  next();

});

// ================= ROUTES =================
const publicRoutes = require('./routes/publicRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const projectRoutes = require('./routes/projectRoutes');

app.use('/', publicRoutes);
app.use('/owner', ownerRoutes);
app.use('/owner/projects', projectRoutes);

// ================= 404 =================
app.use((req, res) => {

  res.status(404).render('404', {
    title: 'Page Not Found'
  });

});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {

  console.error(err.stack);

  res.status(500).render('error', {
    title: 'Server Error',
    message: err.message
  });

});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {

  console.log(`🚀 Server running on http://${HOST}:${PORT}`);

});

module.exports = app;