import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Student, Course, Certificate, InsertCourse, Announcement } from "@shared/schema";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [newCourse, setNewCourse] = useState<InsertCourse>({
    title: "",
    description: "",
    category: "ai-skills",
    duration: "",
    icon: "graduation-cap",
  });
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students, isLoading: studentsLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"],
    enabled: isAuthenticated,
  });

  const { data: courses, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    enabled: isAuthenticated,
  });

  const { data: certificates, isLoading: certificatesLoading } = useQuery<Certificate[]>({
    queryKey: ["/api/certificates"],
    enabled: isAuthenticated,
  });

  interface Statistics {
    totalStudents: number;
    totalCourses: number;
    totalCertificates: number;
    activeCourses: number;
    recentStudents: Student[];
    popularCourses: Course[];
  }

  const { data: statistics } = useQuery<Statistics>({
    queryKey: ["/api/statistics"],
    enabled: isAuthenticated,
  });

  const { data: announcements } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
    enabled: isAuthenticated,
  });

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: InsertCourse) => {
      const response = await apiRequest("POST", "/api/courses", courseData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم إنشاء الدورة بنجاح",
        description: "تم إضافة الدورة الجديدة إلى المنصة",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      setIsAddCourseOpen(false);
      setNewCourse({
        title: "",
        description: "",
        category: "ai-skills",
        duration: "",
        icon: "graduation-cap",
      });
    },
    onError: () => {
      toast({
        title: "خطأ في إنشاء الدورة",
        description: "حدث خطأ أثناء إنشاء الدورة الجديدة",
        variant: "destructive",
      });
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Course> }) => {
      const res = await apiRequest("PATCH", `/api/courses/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "تم تحديث الدورة", description: "تم حفظ التعديلات" });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/courses/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "تم حذف الدورة", description: "تمت إزالة الدورة" });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const res = await apiRequest("POST", "/api/announcements", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "تم إنشاء الإعلان", description: "تمت إضافة إعلان جديد" });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
  });

  const updateAnnouncementMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Announcement> }) => {
      const res = await apiRequest("PATCH", `/api/announcements/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "تم تحديث الإعلان" });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/announcements/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "تم حذف الإعلان" });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
  });

  const deleteCertificateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/certificates/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "تم حذف الشهادة" });
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
    },
  });

  const issueCertificateMutation = useMutation({
    mutationFn: async ({ studentId, courseId }: { studentId: string; courseId: string }) => {
      const response = await apiRequest("POST", "/api/certificates", { studentId, courseId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم إصدار الشهادة بنجاح",
        description: "تم إصدار شهادة جديدة للطالب",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
    },
    onError: () => {
      toast({
        title: "خطأ في إصدار الشهادة",
        description: "حدث خطأ أثناء إصدار الشهادة",
        variant: "destructive",
      });
    },
  });

  const handleAuth = () => {
    if (password === "bbsshhaarr6405") {
      setIsAuthenticated(true);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك Bashar في لوحة التحكم الإدارية",
      });
    } else {
      toast({
        title: "كلمة مرور خاطئة",
        description: "يرجى التأكد من كلمة المرور",
        variant: "destructive",
      });
    }
  };

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.description || !newCourse.duration) {
      toast({
        title: "بيانات مطلوبة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    createCourseMutation.mutate(newCourse);
  };

  const handleIssueCertificate = (studentId: string, courseId: string) => {
    issueCertificateMutation.mutate({ studentId, courseId });
  };

  const getIconOptions = () => [
    { value: "graduation-cap", label: "قبعة تخرج" },
    { value: "student", label: "طالب" },
    { value: "chalkboard-teacher", label: "مدرس" },
    { value: "heart", label: "قلب" },
    { value: "video", label: "فيديو" },
    { value: "robot", label: "روبوت" },
    { value: "code", label: "كود" },
    { value: "palette", label: "لوحة ألوان" },
    { value: "book", label: "كتاب" },
    { value: "users", label: "مستخدمون" },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-primary">
              لوحة التحكم الإدارية
            </CardTitle>
            <p className="text-center text-gray-600">أدخل كلمة المرور للدخول</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="admin-password">كلمة المرور</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة مرور المدير"
                dir="rtl"
                data-testid="input-admin-password"
              />
            </div>
            <Button
              onClick={handleAuth}
              className="w-full"
              data-testid="button-admin-login"
            >
              دخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fas fa-robot text-2xl text-primary"></i>
              <div>
                <h1 className="text-xl font-bold text-primary">لوحة التحكم - موروكس</h1>
                <p className="text-sm text-gray-600">إدارة المنصة التعليمية</p>
              </div>
            </div>
            <Button
              onClick={() => setIsAuthenticated(false)}
              variant="outline"
              data-testid="button-admin-logout"
            >
              <i className="fas fa-sign-out-alt ml-2"></i>
              خروج
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6" dir="rtl">
            <TabsTrigger value="overview" data-testid="tab-overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="students" data-testid="tab-students">الطلاب</TabsTrigger>
            <TabsTrigger value="courses" data-testid="tab-courses">الدورات</TabsTrigger>
            <TabsTrigger value="certificates" data-testid="tab-certificates">الشهادات</TabsTrigger>
            <TabsTrigger value="announcements" data-testid="tab-announcements">الإعلانات</TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">التحليلات</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الطلاب</CardTitle>
                  <i className="fas fa-users text-2xl text-primary"></i>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-overview-students">
                    {statistics?.totalStudents || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">طالب مسجل</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">عدد الدورات</CardTitle>
                  <i className="fas fa-book text-2xl text-secondary"></i>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-overview-courses">
                    {statistics?.totalCourses || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">دورة متاحة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الشهادات الممنوحة</CardTitle>
                  <i className="fas fa-certificate text-2xl text-yellow-500"></i>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-overview-certificates">
                    {statistics?.totalCertificates || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">شهادة مُصدرة</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الدورات النشطة</CardTitle>
                  <i className="fas fa-play-circle text-2xl text-green-500"></i>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-overview-active-courses">
                    {statistics?.activeCourses || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">دورة نشطة</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Students */}
            <Card>
              <CardHeader>
                <CardTitle>الطلاب الجدد</CardTitle>
              </CardHeader>
              <CardContent>
                {statistics?.recentStudents && statistics.recentStudents.length > 0 ? (
                  <div className="space-y-3">
                    {statistics.recentStudents.map((student: Student, index: number) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        data-testid={`recent-student-${index}`}
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.phone}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(student.createdAt || "").toLocaleDateString("ar-EG")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">لا توجد بيانات طلاب جدد</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الطلاب</CardTitle>
              </CardHeader>
              <CardContent>
                {studentsLoading ? (
                  <div className="text-center py-8">
                    <div className="loading-spinner mx-auto"></div>
                    <p className="mt-2 text-gray-600">جارٍ تحميل بيانات الطلاب...</p>
                  </div>
                ) : students && students.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الاسم</TableHead>
                        <TableHead className="text-right">رقم الهاتف</TableHead>
                        <TableHead className="text-right">الدورات المسجلة</TableHead>
                        <TableHead className="text-right">تاريخ التسجيل</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id} data-testid={`row-student-${student.id}`}>
                          <TableCell className="font-medium" data-testid={`text-student-name-${student.id}`}>
                            {student.name}
                          </TableCell>
                          <TableCell data-testid={`text-student-phone-${student.id}`}>
                            {student.phone}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {Array.isArray(student.enrolledCourses) ? student.enrolledCourses.length : 0} دورة
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(student.createdAt || "").toLocaleDateString("ar-EG")}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" data-testid={`button-issue-certificate-${student.id}`}>
                                    إصدار شهادة
                                  </Button>
                                </DialogTrigger>
                                <DialogContent dir="rtl">
                                  <DialogHeader>
                                    <DialogTitle>إصدار شهادة للطالب: {student.name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Label>اختر الدورة:</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="اختر دورة" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {courses?.map((course) => (
                                          <SelectItem key={course.id} value={course.id}>
                                            {course.title}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Button 
                                      className="w-full" 
                                      onClick={() => courses?.[0] && handleIssueCertificate(student.id, courses[0].id)}
                                    >
                                      إصدار الشهادة
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8" data-testid="text-no-students">
                    <i className="fas fa-users text-4xl text-gray-400 mb-4"></i>
                    <p className="text-gray-600">لا توجد بيانات طلاب</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>إدارة الدورات</CardTitle>
                <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-course">
                      <i className="fas fa-plus ml-2"></i>
                      إضافة دورة جديدة
                    </Button>
                  </DialogTrigger>
                  <DialogContent dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة دورة جديدة</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="course-title">عنوان الدورة</Label>
                        <Input
                          id="course-title"
                          value={newCourse.title}
                          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                          placeholder="أدخل عنوان الدورة"
                          dir="rtl"
                          data-testid="input-course-title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="course-description">وصف الدورة</Label>
                        <Textarea
                          id="course-description"
                          value={newCourse.description}
                          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                          placeholder="أدخل وصف الدورة"
                          dir="rtl"
                          data-testid="input-course-description"
                        />
                      </div>
                      <div>
                        <Label htmlFor="course-category">فئة الدورة</Label>
                        <Select
                          value={newCourse.category}
                          onValueChange={(value) => setNewCourse({ ...newCourse, category: value })}
                        >
                          <SelectTrigger data-testid="select-course-category">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ai-skills">مهارات الذكاء الاصطناعي</SelectItem>
                            <SelectItem value="academic">أكاديمية</SelectItem>
                            <SelectItem value="specialty">تخصصية</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="course-duration">مدة الدورة</Label>
                        <Input
                          id="course-duration"
                          value={newCourse.duration}
                          onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                          placeholder="مثال: 4 أسابيع"
                          dir="rtl"
                          data-testid="input-course-duration"
                        />
                      </div>
                      <div>
                        <Label htmlFor="course-icon">أيقونة الدورة</Label>
                        <Select
                          value={newCourse.icon}
                          onValueChange={(value) => setNewCourse({ ...newCourse, icon: value })}
                        >
                          <SelectTrigger data-testid="select-course-icon">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getIconOptions().map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleCreateCourse}
                        className="w-full"
                        disabled={createCourseMutation.isPending}
                        data-testid="button-create-course"
                      >
                        {createCourseMutation.isPending ? "جارٍ الإنشاء..." : "إنشاء الدورة"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {coursesLoading ? (
                  <div className="text-center py-8">
                    <div className="loading-spinner mx-auto"></div>
                    <p className="mt-2 text-gray-600">جارٍ تحميل بيانات الدورات...</p>
                  </div>
                ) : courses && courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <Card key={course.id} data-testid={`card-admin-course-${course.id}`}>
                        <CardContent className="p-6">
                          <div className="mb-4">
                            <div className="flex items-center gap-3 mb-3">
                              <i className={`fas fa-${course.icon} text-2xl text-primary`}></i>
                              <Badge variant={course.category === "ai-skills" ? "default" : "secondary"}>
                                {course.category === "ai-skills" ? "ذكاء اصطناعي" : "أكاديمية"}
                              </Badge>
                            </div>
                            <h4 className="font-bold text-lg mb-2" data-testid={`text-admin-course-title-${course.id}`}>
                              {course.title}
                            </h4>
                            <p className="text-gray-600 text-sm mb-3" data-testid={`text-admin-course-description-${course.id}`}>
                              {course.description}
                            </p>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => updateCourseMutation.mutate({ id: course.id, updates: { isActive: !(course as any).isActive } })}>
                                {course.isActive ? "تعطيل" : "تفعيل"}
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => deleteCourseMutation.mutate(course.id)}>
                                حذف
                              </Button>
                            </div>
                            <span className="text-gray-500">{course.duration}</span>
                            <span className="text-primary font-medium">
                              {course.enrollmentCount || "0"} طالب
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8" data-testid="text-no-courses">
                    <i className="fas fa-book text-4xl text-gray-400 mb-4"></i>
                    <p className="text-gray-600">لا توجد دورات متاحة</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الشهادات</CardTitle>
              </CardHeader>
              <CardContent>
                {certificatesLoading ? (
                  <div className="text-center py-8">
                    <div className="loading-spinner mx-auto"></div>
                    <p className="mt-2 text-gray-600">جارٍ تحميل بيانات الشهادات...</p>
                  </div>
                ) : certificates && certificates.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">كود التحقق</TableHead>
                        <TableHead className="text-right">الطالب</TableHead>
                        <TableHead className="text-right">الدورة</TableHead>
                        <TableHead className="text-right">تاريخ الإصدار</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {certificates.map((certificate) => (
                        <TableRow key={certificate.id} data-testid={`row-certificate-${certificate.id}`}>
                          <TableCell className="font-mono text-sm" data-testid={`text-certificate-code-${certificate.id}`}>
                            {certificate.verificationCode}
                          </TableCell>
                          <TableCell data-testid={`text-certificate-student-${certificate.id}`}>
                            {students?.find(s => s.id === certificate.studentId)?.name || "غير معروف"}
                          </TableCell>
                          <TableCell data-testid={`text-certificate-course-${certificate.id}`}>
                            {courses?.find(c => c.id === certificate.courseId)?.title || "غير معروف"}
                          </TableCell>
                          <TableCell>
                            {new Date(certificate.issueDate || "").toLocaleDateString("ar-EG")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">صالحة</Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="destructive" onClick={() => deleteCertificateMutation.mutate(certificate.id)}>
                              حذف
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8" data-testid="text-no-certificates">
                    <i className="fas fa-certificate text-4xl text-gray-400 mb-4"></i>
                    <p className="text-gray-600">لا توجد شهادات ممنوحة</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

			{/* Announcements Tab */}
			<TabsContent value="announcements" className="space-y-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>إدارة الإعلانات</CardTitle>
						<Dialog>
							<DialogTrigger asChild>
								<Button data-testid="button-add-announcement">
									<i className="fas fa-plus ml-2"></i>
									إضافة إعلان
								</Button>
							</DialogTrigger>
							<DialogContent dir="rtl">
								<DialogHeader>
									<DialogTitle>إضافة إعلان</DialogTitle>
								</DialogHeader>
								<div className="space-y-4">
									<div>
										<Label htmlFor="announcement-title">العنوان</Label>
										<Input id="announcement-title" data-testid="input-announcement-title" onChange={(e) => (window as any)._annTitle = e.target.value} />
									</div>
									<div>
										<Label htmlFor="announcement-content">المحتوى</Label>
										<Textarea id="announcement-content" data-testid="input-announcement-content" onChange={(e) => (window as any)._annContent = e.target.value} />
									</div>
									<Button className="w-full" onClick={() => createAnnouncementMutation.mutate({ title: (window as any)._annTitle || "", content: (window as any)._annContent || "" })}>
										إنشاء
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					</CardHeader>
					<CardContent>
						{announcements && announcements.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="text-right">العنوان</TableHead>
										<TableHead className="text-right">المحتوى</TableHead>
										<TableHead className="text-right">نشط</TableHead>
										<TableHead className="text-right">إجراءات</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{announcements.map((a) => (
										<TableRow key={a.id}>
											<TableCell className="font-medium">{a.title}</TableCell>
											<TableCell className="text-sm text-gray-600">{a.content}</TableCell>
											<TableCell>
												<Switch checked={!!a.isActive} onCheckedChange={(v) => updateAnnouncementMutation.mutate({ id: a.id, updates: { isActive: v } })} />
											</TableCell>
											<TableCell>
												<Button size="sm" variant="destructive" onClick={() => deleteAnnouncementMutation.mutate(a.id)}>حذف</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<div className="text-center py-8">
								<i className="fas fa-bullhorn text-4xl text-gray-400 mb-4"></i>
								<p className="text-gray-600">لا توجد إعلانات</p>
							</div>
						)}
					</CardContent>
				</Card>
			</TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>الدورات الأكثر شعبية</CardTitle>
                </CardHeader>
                <CardContent>
                  {statistics?.popularCourses && statistics.popularCourses.length > 0 ? (
                    <div className="space-y-3">
                      {statistics.popularCourses.map((course: Course, index: number) => (
                        <div
                          key={course.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          data-testid={`popular-course-${index}`}
                        >
                          <div>
                            <p className="font-medium">{course.title}</p>
                            <p className="text-sm text-gray-600">{course.category}</p>
                          </div>
                          <Badge variant="secondary">
                            {course.enrollmentCount || "0"} طالب
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">لا توجد بيانات كافية</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>إحصائيات سريعة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">متوسط الطلاب لكل دورة:</span>
                      <span className="font-medium">
                        {courses && courses.length > 0 
                          ? Math.round((students?.length || 0) / courses.length)
                          : 0
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">معدل إصدار الشهادات:</span>
                      <span className="font-medium">
                        {students && students.length > 0
                          ? Math.round(((certificates?.length || 0) / students.length) * 100)
                          : 0
                        }%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">دورات الذكاء الاصطناعي:</span>
                      <span className="font-medium">
                        {courses?.filter(c => c.category === "ai-skills").length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الدورات الأكاديمية:</span>
                      <span className="font-medium">
                        {courses?.filter(c => c.category === "academic").length || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
