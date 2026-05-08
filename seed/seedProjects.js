require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project');
const connectDB = require('../config/database');



// ==================== COMMON AMENITIES ====================
const commonAmenities = [
  'Wide internal roads',
  'Avenue plantation',
  'Clear plot demarcation',
  'Peaceful surroundings',
  'Good connectivity',
  'Investment potential'
];

// ==================== COMMON HIGHLIGHTS ====================
const commonHighlights = [
  'Planned layout',
  'Transparent documentation',
  'Developed by Rainbow Developers & Agro Farms',
  'Suitable for long-term investment'
];

// ==================== PROJECTS DATA ====================
const projectsData = [
  {
    name: 'Sree Mallikarjuna Nagar',
    category: 'Completed',
    location: 'Jala Village, Rajapet Mandal, Yadadri Bhuvanagiri District, Telangana',
    district: 'Yadadri Bhuvanagiri',
    totalArea: '57 Acres',
    plotArea: '187519 Sq. Yds',
    statusText: 'Completed 2019-2020',
    completedYear: '2019-2020',
    approvalType: 'Grama Panchayat Layout',
    shortDescription: 'A premium residential layout perfectly suited for families seeking a peaceful lifestyle with excellent connectivity and investment opportunities in a well-developed community.',
    fullDescription: 'Sree Mallikarjuna Nagar is a successful 57-acre residential development completed in 2019-2020, offering a harmonious blend of greenery and modern living. Located in Jala Village with clear plot demarcation and wide internal roads, this project provides an ideal environment for families and investors. The layout features peaceful surroundings with excellent road connectivity and is developed with transparent documentation and planned infrastructure.',
    heroImage: {
      url: '/images/placeholder.jpg',
      filename: 'placeholder'
    },
    isFeatured: true,
    amenities: commonAmenities,
    highlights: commonHighlights,
    phases: [],
    photos: [],
    videos: []
  },
  {
    name: 'Sree Lakshmi Nagar',
    category: 'Completed',
    location: 'Chebarthi Village, Jagdevpur Mandal, Siddipet District, Telangana',
    district: 'Siddipet',
    totalArea: '25 Acres',
    plotArea: '77388 Sq. Yds',
    statusText: 'Completed 2020-2021',
    completedYear: '2020-2021',
    approvalType: 'DTCP',
    shortDescription: 'A well-planned multi-phase residential project offering diverse plot options with transparent documentation and excellent ROI potential for smart investors.',
    fullDescription: 'Sree Lakshmi Nagar is a premium 25-acre DTCP-approved residential layout completed in 2020-2021, developed across five well-organized phases. Each phase offers distinct plot sizes and flexibility, making it ideal for diverse buyer preferences. With clear plot demarcation, avenue plantations, and strategic connectivity to nearby towns, this project represents a reliable investment opportunity with strong appreciation potential.',
    heroImage: {
      url: '/images/placeholder.jpg',
      filename: 'placeholder'
    },
    isFeatured: true,
    amenities: commonAmenities,
    highlights: commonHighlights,
    phases: [
      {
        phaseName: 'Phase I',
        area: '5 Acres',
        sqYards: '18340 Sq. Yds',
        tlpNo: '102/2017/HRO/H1'
      },
      {
        phaseName: 'Phase II',
        area: '5 Acres',
        sqYards: '14140 Sq. Yds',
        tlpNo: '106/2017/HRO/H1'
      },
      {
        phaseName: 'Phase III',
        area: '5 Acres',
        sqYards: '16670 Sq. Yds',
        tlpNo: '144/2017/HRO/H1'
      },
      {
        phaseName: 'Phase IV',
        area: '5 Acres',
        sqYards: '13879 Sq. Yds',
        tlpNo: '149/2017/HRO/H1'
      },
      {
        phaseName: 'Phase V',
        area: '5 Acres',
        sqYards: '14359 Sq. Yds',
        tlpNo: '165/2017/HRO/H1'
      }
    ],
    photos: [],
    videos: []
  },
  {
    name: 'Sree Ganesh Nagar',
    category: 'Completed',
    location: 'Khanapur, Thirumalapur Village, Rajapur Mandal, Mahabubnagar District, Telangana',
    district: 'Mahabubnagar',
    totalArea: '75 Acres',
    plotArea: '236641 Sq. Yds',
    statusText: 'Completed 2021-2022',
    completedYear: '2021-2022',
    approvalType: 'DTCP',
    shortDescription: 'A large-scale, DTCP-approved residential development offering exceptional value with strategic location and proven track record of successful completions.',
    fullDescription: 'Sree Ganesh Nagar stands as a testament to our expertise in large-scale residential development, spanning 75 acres across three phases completed in 2021-2022. Strategically located in Khanapur with proximity to major connectivity routes, this DTCP-approved project features wide internal roads, extensive avenue plantations, and clear plot demarcations. The project offers excellent investment returns with transparent documentation and demonstrates our commitment to quality development.',
    heroImage: {
      url: '/images/placeholder.jpg',
      filename: 'placeholder'
    },
    isFeatured: true,
    amenities: commonAmenities,
    highlights: commonHighlights,
    phases: [
      {
        phaseName: 'Phase I',
        area: '22 Acres',
        sqYards: '88821 Sq. Yds',
        tlpNo: '116/2018/H'
      },
      {
        phaseName: 'Phase II',
        area: '19 Acres',
        sqYards: '57741 Sq. Yds',
        tlpNo: '84/2019/H'
      },
      {
        phaseName: 'Phase III',
        area: '34 Acres',
        sqYards: '100279 Sq. Yds',
        tlpNo: '163/2019/H'
      }
    ],
    photos: [],
    videos: []
  },
  {
    name: 'Sree Balaji Nagar',
    category: 'Completed',
    location: 'Renikunta Village, Rajapet Mandal, Yadadri Bhuvanagiri District, Telangana',
    district: 'Yadadri Bhuvanagiri',
    totalArea: '58 Acres',
    plotArea: '127965 Sq. Yds',
    statusText: 'Completed 2019-2020',
    completedYear: '2019-2020',
    approvalType: 'Grama Panchayat Layout',
    shortDescription: 'A successful 58-acre residential layout with Grama Panchayat approval, offering peaceful living in a well-connected location with strong appreciation history.',
    fullDescription: 'Sree Balaji Nagar is a completed 58-acre residential development in Renikunta Village, representing one of our successful Grama Panchayat-approved layouts. The project features wide internal roads, clear plot demarcation, and avenue plantations creating a green, peaceful environment. With good connectivity to nearby areas and consistent appreciation since 2019-2020 completion, it remains a popular choice for investors and families seeking long-term value.',
    heroImage: {
      url: '/images/placeholder.jpg',
      filename: 'placeholder'
    },
    isFeatured: false,
    amenities: commonAmenities,
    highlights: commonHighlights,
    phases: [],
    photos: [],
    videos: []
  },
  {
    name: 'Sree Sai Balaji Nagar',
    category: 'Ongoing',
    location: 'Bondugula Village, Rajapeta Mandal, Yadadri Bhuvanagiri District, Telangana',
    district: 'Yadadri Bhuvanagiri',
    totalArea: '62 Acres',
    plotArea: '196134 Sq. Yds',
    statusText: 'Phase I and Phase II Completed in 2022, Phase III and IV Running',
    completedYear: '2022',
    approvalType: 'DTCP',
    shortDescription: 'A premium ongoing DTCP-approved project with phases already completed and infrastructure development underway, offering immediate possession and future growth potential.',
    fullDescription: 'Sree Sai Balaji Nagar is a large 62-acre DTCP-approved residential project currently under development across four phases. Phase I and II were successfully completed in 2022, and Phase III and IV are actively running with construction progressing on schedule. The project offers a unique opportunity for buyers seeking immediate possession in completed phases while benefiting from future appreciation as newer phases complete.',
    heroImage: {
      url: '/images/placeholder.jpg',
      filename: 'placeholder'
    },
    isFeatured: false,
    amenities: commonAmenities,
    highlights: commonHighlights,
    phases: [
      {
        phaseName: 'Phase I',
        area: '33 Acres',
        sqYards: '103890 Sq. Yds',
        tlpNo: '32/2019/H'
      },
      {
        phaseName: 'Phase II',
        area: '22 Acres',
        sqYards: '69768 Sq. Yds',
        tlpNo: '92/2019/H'
      },
      {
        phaseName: 'Phase III',
        area: '5 Acres',
        sqYards: '15725 Sq. Yds',
        tlpNo: '114/2021/HRO/H1'
      },
      {
        phaseName: 'Phase IV',
        area: '2 Acres',
        sqYards: '6751 Sq. Yds',
        tlpNo: '39/2021/DTCPO/YDRB'
      }
    ],
    photos: [],
    videos: []
  },
  {
    name: 'Sree Ganesh Nagar-IV',
    category: 'Completed',
    location: 'Tirumalapur Village, Rajapur Mandal, Mahabubnagar District, Telangana',
    district: 'Mahabubnagar',
    totalArea: '10 Acres',
    plotArea: '31266 Sq. Yds',
    statusText: 'Phase IV Completed 2022',
    completedYear: '2022',
    approvalType: 'DTCP',
    shortDescription: 'A specialized phase of the popular Sree Ganesh Nagar series, completed in 2022 with DTCP approval and excellent connectivity to major routes.',
    fullDescription: 'Sree Ganesh Nagar-IV represents Phase IV of our successful Sree Ganesh Nagar series, completed in 2022 across 10 acres. This DTCP-approved phase maintains the high standards of development established in previous phases, featuring wide roads, clear plot boundaries, and excellent infrastructure. Located in Tirumalapur with good connectivity, it offers investors the advantage of joining an already-established community with proven appreciation.',
    heroImage: {
      url: '/images/placeholder.jpg',
      filename: 'placeholder'
    },
    isFeatured: false,
    amenities: commonAmenities,
    highlights: commonHighlights,
    phases: [
      {
        phaseName: 'Phase IV',
        area: '10 Acres',
        sqYards: '31266 Sq. Yds',
        tlpNo: '229/2019/H'
      }
    ],
    photos: [],
    videos: []
  },
  {
    name: 'Sree Maruthi Nagar',
    category: 'Ongoing',
    location: 'Khanapur, Thirumalapur Village, Rajapur Mandal, Mahabubnagar District, Telangana',
    district: 'Mahabubnagar',
    totalArea: '66 Acres',
    plotArea: '204407 Sq. Yds',
    statusText: 'Running',
    completedYear: null,
    approvalType: 'DTCP',
    shortDescription: 'A large-scale ongoing DTCP project offering diverse plot options across two phases, representing a timely investment opportunity with active development.',
    fullDescription: 'Sree Maruthi Nagar is our current flagship ongoing project, spanning 66 acres of DTCP-approved land in Khanapur. Developed across two phases, the project is actively under construction with modern infrastructure development. Buyers investing now can benefit from growth potential and appreciation as the project progresses toward completion. The location offers excellent connectivity and strategic positioning for long-term investment.',
    heroImage: {
      url: '/images/placeholder.jpg',
      filename: 'placeholder'
    },
    isFeatured: false,
    amenities: commonAmenities,
    highlights: commonHighlights,
    phases: [
      {
        phaseName: 'Phase I',
        area: '32 Acres',
        sqYards: '100613 Sq. Yds',
        tlpNo: '73/2021/H'
      },
      {
        phaseName: 'Phase II',
        area: '34 Acres',
        sqYards: '103793 Sq. Yds',
        tlpNo: '38/2022/H'
      }
    ],
    photos: [],
    videos: []
  },
  {
    name: 'Rainbow Developers & Agro Farms',
    category: 'Ongoing',
    location: 'Rajapet Village, Rajapet Mandal, Yadadri Bhuvanagiri District, Telangana',
    district: 'Yadadri Bhuvanagiri',
    totalArea: '8.11 Acres',
    plotArea: '17941 Sq. Yds',
    statusText: 'Running',
    completedYear: null,
    approvalType: 'DTCP',
    shortDescription: 'A compact, well-planned ongoing project showcasing our commitment to quality development in premium locations with excellent roadside visibility and connectivity.',
    fullDescription: 'Rainbow Developers & Agro Farms is a specialized 8.11-acre DTCP-approved residential project in Rajapet Village, developed across two phases. This project demonstrates our versatility in handling premium, compact developments while maintaining our quality standards. Located in a strategically important location with excellent connectivity, it offers an ideal option for investors seeking smaller plot sizes or developers looking for land parcels.',
    heroImage: {
      url: '/images/placeholder.jpg',
      filename: 'placeholder'
    },
    isFeatured: false,
    amenities: commonAmenities,
    highlights: commonHighlights,
    phases: [
      {
        phaseName: 'Phase I',
        area: '5 Acres',
        sqYards: '10741 Sq. Yds',
        tlpNo: '177/2017/HRO/H1'
      },
      {
        phaseName: 'Phase II',
        area: '3.11 Acres',
        sqYards: '7200 Sq. Yds',
        tlpNo: '228/2017/HRO/H1'
      }
    ],
    photos: [],
    videos: []
  }
];

// ==================== SEED FUNCTION ====================
const seedProjects = async () => {
  try {
    console.log("🌱 Starting project data seeding...");

    // Connect database first
    await connectDB();

    // Delete existing projects
    const deleteResult = await Project.deleteMany({});
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing projects`);

    // Create projects one by one so pre-save slug middleware works
    const insertedProjects = [];

    for (const projectData of projectsData) {
      const project = await Project.create(projectData);
      insertedProjects.push(project);
    }

    console.log(`✅ Successfully inserted ${insertedProjects.length} projects into database`);

    // Log featured projects
    const featuredProjects = insertedProjects.filter((p) => p.isFeatured);
    console.log(`⭐ Featured projects: ${featuredProjects.length}`);

    featuredProjects.forEach((p) => {
      console.log(`   - ${p.name} (${p.slug})`);
    });

    // Log project summary by category
    const completed = insertedProjects.filter((p) => p.category === "Completed").length;
    const ongoing = insertedProjects.filter((p) => p.category === "Ongoing").length;

    console.log("\n📊 Project Summary:");
    console.log(`   Completed: ${completed}`);
    console.log(`   Ongoing: ${ongoing}`);

    // Log project districts
    const districts = [...new Set(insertedProjects.map((p) => p.district))];

    console.log(`\n📍 Coverage Districts: ${districts.length}`);
    districts.forEach((district) => {
      console.log(`   - ${district}`);
    });

    console.log("\n✨ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

// ==================== RUN SEEDING ====================
seedProjects();