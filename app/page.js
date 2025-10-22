'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye,
  LogOut,
  User,
  TrendingUp,
  AlertCircle,
  Car,
  DollarSign
} from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [authTab, setAuthTab] = useState('login');
  const { toast } = useToast();
  
  // Form states
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'konsumen'
  });
  
  // Application form state
  const [applicationForm, setApplicationForm] = useState({
    nama: '',
    nik: '',
    tanggalLahir: '',
    statusPerkawinan: 'belum_menikah',
    dataPasangan: '',
    dealer: '',
    merkKendaraan: '',
    modelKendaraan: '',
    tipeKendaraan: '',
    warnaKendaraan: '',
    hargaKendaraan: '',
    asuransi: '',
    downPayment: '',
    lamaKredit: '',
    angsuranPerBulan: ''
  });
  
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, underReview: 0, approved: 0, rejected: 0 });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
      fetchApplications(token);
      fetchStats(token);
    }
  }, []);
  
  const fetchApplications = async (token) => {
    try {
      const response = await fetch('/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };
  
  const fetchStats = async (token) => {
    try {
      const response = await fetch('/api/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginForm)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoggedIn(true);
        setUser(data.user);
        
        toast({
          title: 'Login berhasil!',
          description: `Selamat datang, ${data.user.name}`,
        });
        
        fetchApplications(data.token);
        fetchStats(data.token);
      } else {
        toast({
          title: 'Login gagal',
          description: data.error || 'Terjadi kesalahan',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Tidak dapat terhubung ke server',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerForm)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoggedIn(true);
        setUser(data.user);
        
        toast({
          title: 'Registrasi berhasil!',
          description: `Selamat datang, ${data.user.name}`,
        });
        
        fetchApplications(data.token);
        fetchStats(data.token);
      } else {
        toast({
          title: 'Registrasi gagal',
          description: data.error || 'Terjadi kesalahan',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Tidak dapat terhubung ke server',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setApplications([]);
    setStats({ total: 0, pending: 0, underReview: 0, approved: 0, rejected: 0 });
    
    toast({
      title: 'Logout berhasil',
      description: 'Anda telah keluar dari sistem',
    });
  };
  
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(applicationForm)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Pengajuan berhasil!',
          description: 'Pengajuan kredit Anda telah dikirim',
        });
        
        // Reset form
        setApplicationForm({
          nama: '',
          nik: '',
          tanggalLahir: '',
          statusPerkawinan: 'belum_menikah',
          dataPasangan: '',
          dealer: '',
          merkKendaraan: '',
          modelKendaraan: '',
          tipeKendaraan: '',
          warnaKendaraan: '',
          hargaKendaraan: '',
          asuransi: '',
          downPayment: '',
          lamaKredit: '',
          angsuranPerBulan: ''
        });
        
        fetchApplications(token);
        fetchStats(token);
      } else {
        toast({
          title: 'Pengajuan gagal',
          description: data.error || 'Terjadi kesalahan',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Tidak dapat terhubung ke server',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateStatus = async (applicationId, status, notes = '') => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, notes })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Status diperbarui',
          description: `Status berhasil diubah menjadi ${status}`,
        });
        
        fetchApplications(token);
        fetchStats(token);
        setSelectedApplication(null);
      } else {
        toast({
          title: 'Update gagal',
          description: data.error || 'Terjadi kesalahan',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Tidak dapat terhubung ke server',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
      under_review: { label: 'Dalam Review', color: 'bg-blue-500', icon: Eye },
      approved: { label: 'Disetujui', color: 'bg-green-500', icon: CheckCircle2 },
      rejected: { label: 'Ditolak', color: 'bg-red-500', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };
  
  // Auth screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-indigo-600 p-3 rounded-full">
                <Car className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Sistem Kredit Kendaraan</CardTitle>
            <CardDescription className="text-center">PT. JKL - Digital Application System</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={authTab} onValueChange={setAuthTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input
                      placeholder="Masukkan username"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Masukkan password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nama Lengkap</Label>
                    <Input
                      placeholder="Masukkan nama lengkap"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Masukkan email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input
                      placeholder="Masukkan username"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Masukkan password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={registerForm.role}
                      onValueChange={(value) => setRegisterForm({ ...registerForm, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="konsumen">Konsumen</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="atasan_marketing">Atasan Marketing</SelectItem>
                        <SelectItem value="admin_backoffice">Admin Backoffice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Loading...' : 'Register'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    );
  }
  
  // Main application screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PT. JKL</h1>
                <p className="text-sm text-gray-500">Sistem Kredit Kendaraan</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Review</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.underReview}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disetujui</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ditolak</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {user?.role === 'konsumen' ? (
          <Tabs defaultValue="form" className="space-y-4">
            <TabsList>
              <TabsTrigger value="form">Ajukan Kredit</TabsTrigger>
              <TabsTrigger value="list">Pengajuan Saya</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form">
              <Card>
                <CardHeader>
                  <CardTitle>Form Pengajuan Kredit Kendaraan</CardTitle>
                  <CardDescription>Lengkapi semua data untuk mengajukan kredit kendaraan</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitApplication} className="space-y-6">
                    {/* Data Konsumen */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Data Konsumen
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nama Lengkap *</Label>
                          <Input
                            placeholder="Nama lengkap sesuai KTP"
                            value={applicationForm.nama}
                            onChange={(e) => setApplicationForm({ ...applicationForm, nama: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>NIK *</Label>
                          <Input
                            placeholder="Nomor Induk Kependudukan"
                            value={applicationForm.nik}
                            onChange={(e) => setApplicationForm({ ...applicationForm, nik: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tanggal Lahir *</Label>
                          <Input
                            type="date"
                            value={applicationForm.tanggalLahir}
                            onChange={(e) => setApplicationForm({ ...applicationForm, tanggalLahir: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Status Perkawinan *</Label>
                          <Select
                            value={applicationForm.statusPerkawinan}
                            onValueChange={(value) => setApplicationForm({ ...applicationForm, statusPerkawinan: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="belum_menikah">Belum Menikah</SelectItem>
                              <SelectItem value="menikah">Menikah</SelectItem>
                              <SelectItem value="cerai">Cerai</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {applicationForm.statusPerkawinan === 'menikah' && (
                          <div className="space-y-2 md:col-span-2">
                            <Label>Nama Pasangan</Label>
                            <Input
                              placeholder="Nama lengkap pasangan"
                              value={applicationForm.dataPasangan}
                              onChange={(e) => setApplicationForm({ ...applicationForm, dataPasangan: e.target.value })}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Data Kendaraan */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Car className="w-5 h-5 mr-2" />
                        Data Kendaraan
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Dealer *</Label>
                          <Input
                            placeholder="Nama dealer"
                            value={applicationForm.dealer}
                            onChange={(e) => setApplicationForm({ ...applicationForm, dealer: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Merk Kendaraan *</Label>
                          <Input
                            placeholder="Contoh: Toyota, Honda"
                            value={applicationForm.merkKendaraan}
                            onChange={(e) => setApplicationForm({ ...applicationForm, merkKendaraan: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Model Kendaraan *</Label>
                          <Input
                            placeholder="Contoh: Avanza, Brio"
                            value={applicationForm.modelKendaraan}
                            onChange={(e) => setApplicationForm({ ...applicationForm, modelKendaraan: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tipe Kendaraan</Label>
                          <Input
                            placeholder="Contoh: 1.5 G MT"
                            value={applicationForm.tipeKendaraan}
                            onChange={(e) => setApplicationForm({ ...applicationForm, tipeKendaraan: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Warna Kendaraan</Label>
                          <Input
                            placeholder="Contoh: Putih, Hitam"
                            value={applicationForm.warnaKendaraan}
                            onChange={(e) => setApplicationForm({ ...applicationForm, warnaKendaraan: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Harga Kendaraan *</Label>
                          <Input
                            type="number"
                            placeholder="Harga dalam Rupiah"
                            value={applicationForm.hargaKendaraan}
                            onChange={(e) => setApplicationForm({ ...applicationForm, hargaKendaraan: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Data Pinjaman */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Data Pinjaman
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Asuransi</Label>
                          <Input
                            placeholder="Nama asuransi"
                            value={applicationForm.asuransi}
                            onChange={(e) => setApplicationForm({ ...applicationForm, asuransi: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Down Payment (DP) *</Label>
                          <Input
                            type="number"
                            placeholder="Uang muka dalam Rupiah"
                            value={applicationForm.downPayment}
                            onChange={(e) => setApplicationForm({ ...applicationForm, downPayment: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Lama Kredit (Bulan) *</Label>
                          <Input
                            type="number"
                            placeholder="Contoh: 12, 24, 36"
                            value={applicationForm.lamaKredit}
                            onChange={(e) => setApplicationForm({ ...applicationForm, lamaKredit: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Angsuran per Bulan *</Label>
                          <Input
                            type="number"
                            placeholder="Angsuran dalam Rupiah"
                            value={applicationForm.angsuranPerBulan}
                            onChange={(e) => setApplicationForm({ ...applicationForm, angsuranPerBulan: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 bg-blue-50 p-4 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-500" />
                      <p className="text-sm text-blue-700">
                        Catatan: Fitur upload dokumen (KTP, SPK, Bukti Bayar, Kartu Keluarga) akan tersedia di versi selanjutnya.
                      </p>
                    </div>
                    
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? 'Mengirim...' : 'Ajukan Kredit'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>Pengajuan Saya</CardTitle>
                  <CardDescription>Daftar semua pengajuan kredit yang pernah Anda ajukan</CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>Belum ada pengajuan</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div key={app._id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold text-lg">{app.nama}</h4>
                                {getStatusBadge(app.status)}
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <p><span className="font-medium">Kendaraan:</span> {app.merkKendaraan} {app.modelKendaraan}</p>
                                <p><span className="font-medium">Harga:</span> Rp {parseInt(app.hargaKendaraan).toLocaleString('id-ID')}</p>
                                <p><span className="font-medium">DP:</span> Rp {parseInt(app.downPayment).toLocaleString('id-ID')}</p>
                                <p><span className="font-medium">Tenor:</span> {app.lamaKredit} bulan</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                Diajukan: {new Date(app.createdAt).toLocaleDateString('id-ID', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {app.notes && (
                                <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                                  <p className="text-sm text-yellow-800"><span className="font-medium">Catatan:</span> {app.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                {user?.role === 'marketing' && 'Dashboard Marketing'}
                {user?.role === 'atasan_marketing' && 'Dashboard Atasan Marketing'}
                {user?.role === 'admin_backoffice' && 'Dashboard Admin Backoffice'}
              </CardTitle>
              <CardDescription>Kelola pengajuan kredit kendaraan</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Belum ada pengajuan</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app._id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-lg">{app.nama}</h4>
                            {getStatusBadge(app.status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <p><span className="font-medium">NIK:</span> {app.nik}</p>
                            <p><span className="font-medium">Kendaraan:</span> {app.merkKendaraan} {app.modelKendaraan}</p>
                            <p><span className="font-medium">Dealer:</span> {app.dealer}</p>
                            <p><span className="font-medium">Harga:</span> Rp {parseInt(app.hargaKendaraan).toLocaleString('id-ID')}</p>
                            <p><span className="font-medium">DP:</span> Rp {parseInt(app.downPayment).toLocaleString('id-ID')}</p>
                            <p><span className="font-medium">Tenor:</span> {app.lamaKredit} bulan</p>
                            <p><span className="font-medium">Angsuran:</span> Rp {parseInt(app.angsuranPerBulan).toLocaleString('id-ID')}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Diajukan: {new Date(app.createdAt).toLocaleDateString('id-ID', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {app.notes && (
                            <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                              <p className="text-sm text-yellow-800"><span className="font-medium">Catatan:</span> {app.notes}</p>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex flex-col space-y-2">
                          {user?.role === 'marketing' && app.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const notes = prompt('Catatan (optional):');
                                handleUpdateStatus(app._id, 'under_review', notes || '');
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Review
                            </Button>
                          )}
                          {user?.role === 'atasan_marketing' && app.status === 'under_review' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  const notes = prompt('Catatan approval (optional):');
                                  handleUpdateStatus(app._id, 'approved', notes || '');
                                }}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Setujui
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  const notes = prompt('Alasan penolakan:');
                                  if (notes) {
                                    handleUpdateStatus(app._id, 'rejected', notes);
                                  }
                                }}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Tolak
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      <Toaster />
    </div>
  );
}
