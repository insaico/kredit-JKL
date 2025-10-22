import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'jkl-secret-key-2024';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  
  const client = await MongoClient.connect(process.env.MONGO_URL);
  cachedClient = client;
  return client;
}

// Middleware untuk verify JWT token
function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

// POST /api/auth/register
async function handleRegister(request) {
  try {
    const body = await request.json();
    const { username, password, name, email, role } = body;
    
    if (!username || !password || !name || !email || !role) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }
    
    const validRoles = ['konsumen', 'marketing', 'atasan_marketing', 'admin_backoffice'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Role tidak valid' },
        { status: 400 }
      );
    }
    
    const client = await connectToDatabase();
    const db = client.db('jkl_kredit');
    const usersCollection = db.collection('users');
    
    // Check if username already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username sudah terdaftar' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      _id: uuidv4(),
      username,
      password: hashedPassword,
      name,
      email,
      role,
      createdAt: new Date()
    };
    
    await usersCollection.insertOne(user);
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return NextResponse.json({
      message: 'Registrasi berhasil',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}

// POST /api/auth/login
async function handleLogin(request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password harus diisi' },
        { status: 400 }
      );
    }
    
    const client = await connectToDatabase();
    const db = client.db('jkl_kredit');
    const usersCollection = db.collection('users');
    
    // Find user
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      );
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return NextResponse.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}

// GET /api/profile
async function handleGetProfile(request) {
  try {
    const userData = verifyToken(request);
    if (!userData) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      );
    }
    
    const client = await connectToDatabase();
    const db = client.db('jkl_kredit');
    const usersCollection = db.collection('users');
    
    const user = await usersCollection.findOne(
      { _id: userData.userId },
      { projection: { password: 0 } }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}

// POST /api/applications
async function handleCreateApplication(request) {
  try {
    const userData = verifyToken(request);
    if (!userData) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      );
    }
    
    // Only konsumen can create applications
    if (userData.role !== 'konsumen') {
      return NextResponse.json(
        { error: 'Hanya konsumen yang dapat mengajukan aplikasi' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const {
      // Data Konsumen
      nama,
      nik,
      tanggalLahir,
      statusPerkawinan,
      dataPasangan,
      // Data Kendaraan
      dealer,
      merkKendaraan,
      modelKendaraan,
      tipeKendaraan,
      warnaKendaraan,
      hargaKendaraan,
      // Data Pinjaman
      asuransi,
      downPayment,
      lamaKredit,
      angsuranPerBulan,
      // Documents (base64 atau URL)
      documents
    } = body;
    
    // Validation
    if (!nama || !nik || !tanggalLahir || !statusPerkawinan) {
      return NextResponse.json(
        { error: 'Data konsumen tidak lengkap' },
        { status: 400 }
      );
    }
    
    if (!dealer || !merkKendaraan || !modelKendaraan || !hargaKendaraan) {
      return NextResponse.json(
        { error: 'Data kendaraan tidak lengkap' },
        { status: 400 }
      );
    }
    
    if (!downPayment || !lamaKredit || !angsuranPerBulan) {
      return NextResponse.json(
        { error: 'Data pinjaman tidak lengkap' },
        { status: 400 }
      );
    }
    
    const client = await connectToDatabase();
    const db = client.db('jkl_kredit');
    const applicationsCollection = db.collection('applications');
    
    const application = {
      _id: uuidv4(),
      userId: userData.userId,
      // Data Konsumen
      nama,
      nik,
      tanggalLahir,
      statusPerkawinan,
      dataPasangan: dataPasangan || '',
      // Data Kendaraan
      dealer,
      merkKendaraan,
      modelKendaraan,
      tipeKendaraan: tipeKendaraan || '',
      warnaKendaraan: warnaKendaraan || '',
      hargaKendaraan: parseFloat(hargaKendaraan),
      // Data Pinjaman
      asuransi: asuransi || '',
      downPayment: parseFloat(downPayment),
      lamaKredit: parseInt(lamaKredit),
      angsuranPerBulan: parseFloat(angsuranPerBulan),
      // Documents
      documents: documents || {},
      // Status & Approval
      status: 'pending',
      reviewedBy: null,
      approvedBy: null,
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await applicationsCollection.insertOne(application);
    
    return NextResponse.json({
      message: 'Pengajuan berhasil dibuat',
      application
    });
  } catch (error) {
    console.error('Create application error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat pengajuan' },
      { status: 500 }
    );
  }
}

// GET /api/applications
async function handleGetApplications(request) {
  try {
    const userData = verifyToken(request);
    if (!userData) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      );
    }
    
    const client = await connectToDatabase();
    const db = client.db('jkl_kredit');
    const applicationsCollection = db.collection('applications');
    const usersCollection = db.collection('users');
    
    let query = {};
    
    // Role-based filtering
    if (userData.role === 'konsumen') {
      query.userId = userData.userId;
    }
    // marketing, atasan_marketing, and admin_backoffice can see all
    
    const applications = await applicationsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    // Populate user data
    const applicationsWithUser = await Promise.all(
      applications.map(async (app) => {
        const user = await usersCollection.findOne(
          { _id: app.userId },
          { projection: { password: 0 } }
        );
        return {
          ...app,
          user: user ? { name: user.name, email: user.email } : null
        };
      })
    );
    
    return NextResponse.json({
      applications: applicationsWithUser
    });
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data' },
      { status: 500 }
    );
  }
}

// GET /api/applications/:id
async function handleGetApplicationById(request, id) {
  try {
    const userData = verifyToken(request);
    if (!userData) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      );
    }
    
    const client = await connectToDatabase();
    const db = client.db('jkl_kredit');
    const applicationsCollection = db.collection('applications');
    const usersCollection = db.collection('users');
    
    const application = await applicationsCollection.findOne({ _id: id });
    
    if (!application) {
      return NextResponse.json(
        { error: 'Pengajuan tidak ditemukan' },
        { status: 404 }
      );
    }
    
    // Check permission
    if (userData.role === 'konsumen' && application.userId !== userData.userId) {
      return NextResponse.json(
        { error: 'Anda tidak memiliki akses ke pengajuan ini' },
        { status: 403 }
      );
    }
    
    // Populate user data
    const user = await usersCollection.findOne(
      { _id: application.userId },
      { projection: { password: 0 } }
    );
    
    return NextResponse.json({
      application: {
        ...application,
        user: user ? { name: user.name, email: user.email } : null
      }
    });
  } catch (error) {
    console.error('Get application error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}

// PUT /api/applications/:id/status
async function handleUpdateApplicationStatus(request, id) {
  try {
    const userData = verifyToken(request);
    if (!userData) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      );
    }
    
    // Only marketing and atasan_marketing can update status
    if (!['marketing', 'atasan_marketing', 'admin_backoffice'].includes(userData.role)) {
      return NextResponse.json(
        { error: 'Anda tidak memiliki akses untuk mengubah status' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { status, notes } = body;
    
    const validStatuses = ['pending', 'under_review', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status tidak valid' },
        { status: 400 }
      );
    }
    
    const client = await connectToDatabase();
    const db = client.db('jkl_kredit');
    const applicationsCollection = db.collection('applications');
    
    const updateData = {
      status,
      notes: notes || '',
      updatedAt: new Date()
    };
    
    // Set reviewedBy for marketing
    if (userData.role === 'marketing' && status === 'under_review') {
      updateData.reviewedBy = userData.userId;
    }
    
    // Set approvedBy for atasan_marketing
    if (userData.role === 'atasan_marketing' && (status === 'approved' || status === 'rejected')) {
      updateData.approvedBy = userData.userId;
    }
    
    const result = await applicationsCollection.updateOne(
      { _id: id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Pengajuan tidak ditemukan' },
        { status: 404 }
      );
    }
    
    const updatedApplication = await applicationsCollection.findOne({ _id: id });
    
    return NextResponse.json({
      message: 'Status berhasil diperbarui',
      application: updatedApplication
    });
  } catch (error) {
    console.error('Update status error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui status' },
      { status: 500 }
    );
  }
}

// GET /api/stats
async function handleGetStats(request) {
  try {
    const userData = verifyToken(request);
    if (!userData) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      );
    }
    
    const client = await connectToDatabase();
    const db = client.db('jkl_kredit');
    const applicationsCollection = db.collection('applications');
    
    let query = {};
    if (userData.role === 'konsumen') {
      query.userId = userData.userId;
    }
    
    const total = await applicationsCollection.countDocuments(query);
    const pending = await applicationsCollection.countDocuments({ ...query, status: 'pending' });
    const underReview = await applicationsCollection.countDocuments({ ...query, status: 'under_review' });
    const approved = await applicationsCollection.countDocuments({ ...query, status: 'approved' });
    const rejected = await applicationsCollection.countDocuments({ ...query, status: 'rejected' });
    
    return NextResponse.json({
      stats: {
        total,
        pending,
        underReview,
        approved,
        rejected
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}

// Main handler
export async function POST(request, { params }) {
  const path = params?.path?.join('/') || '';
  
  if (path === 'auth/register') {
    return handleRegister(request);
  } else if (path === 'auth/login') {
    return handleLogin(request);
  } else if (path === 'applications') {
    return handleCreateApplication(request);
  }
  
  return NextResponse.json({ error: 'Endpoint tidak ditemukan' }, { status: 404 });
}

export async function GET(request, { params }) {
  const path = params?.path?.join('/') || '';
  
  if (path === 'profile') {
    return handleGetProfile(request);
  } else if (path === 'applications') {
    return handleGetApplications(request);
  } else if (path === 'stats') {
    return handleGetStats(request);
  } else if (path.startsWith('applications/')) {
    const id = path.split('/')[1];
    return handleGetApplicationById(request, id);
  }
  
  return NextResponse.json({ error: 'Endpoint tidak ditemukan' }, { status: 404 });
}

export async function PUT(request, { params }) {
  const path = params?.path?.join('/') || '';
  
  if (path.match(/^applications\/[^\/]+\/status$/)) {
    const id = path.split('/')[1];
    return handleUpdateApplicationStatus(request, id);
  }
  
  return NextResponse.json({ error: 'Endpoint tidak ditemukan' }, { status: 404 });
}
