const mongoose = require('mongoose');
const { generateSlug } = require('../utils/helpers');

// ================= PROJECT SCHEMA =================
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    category: {
      type: String,
      enum: ['Completed', 'Ongoing', 'Upcoming'],
      required: [true, 'Category is required']
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },

    district: {
      type: String,
      trim: true,
      default: ''
    },

    totalArea: {
      type: String,
      trim: true,
      default: ''
    },

    plotArea: {
      type: String,
      trim: true,
      default: ''
    },

    approvalType: {
      type: String,
      trim: true,
      default: ''
    },

    statusText: {
      type: String,
      trim: true,
      default: ''
    },

    // ✅ FIXED: NUMBER instead of string
    completedYear: {
      type: Number,
      default: null
    },

    shortDescription: {
      type: String,
      trim: true,
      default: ''
    },

    fullDescription: {
      type: String,
      trim: true,
      default: ''
    },

    heroImage: {
      url: {
        type: String,
        default: '/images/placeholder.jpg'
      },
      filename: {
        type: String,
        default: 'placeholder'
      }
    },

    photos: {
      type: [
        {
          url: String,
          filename: String
        }
      ],
      default: []
    },

    videos: {
      type: [
        {
          title: {
            type: String,
            trim: true
          },
          url: {
            type: String,
            trim: true
          }
        }
      ],
      default: []
    },

    amenities: {
      type: [String],
      default: []
    },

    highlights: {
      type: [String],
      default: []
    },

    phases: {
      type: [
        {
          phaseName: String,
          area: String,
          sqYards: String,
          tlpNo: String
        }
      ],
      default: []
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// ================= INDEXES =================
projectSchema.index({ createdAt: -1 });

// ================= SLUG GENERATION =================
projectSchema.pre("save", async function () {
  if (!this.isModified("name") && this.slug) return;

  let baseSlug = generateSlug(this.name);
  let finalSlug = baseSlug;
  let counter = 1;

  while (
    await mongoose.models.Project.findOne({
      slug: finalSlug,
      _id: { $ne: this._id }
    })
  ) {
    counter++;
    finalSlug = `${baseSlug}-${counter}`;
  }

  this.slug = finalSlug;
});

// ================= EXPORT =================
module.exports = mongoose.model('Project', projectSchema);