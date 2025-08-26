import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Student, Course, Certificate, Announcement, InsertCourse } from "@shared/schema";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface AdminDashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminDashboard({ open, onOpenChange }: AdminDashboardProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students } = useQuery<Student[]>({
    queryKey: ["/api/students"],
    enabled: isAuthenticated,
  });

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    enabled: isAuthenticated,
  });

  const { data: certificates } = useQuery<Certificate[]>({
    queryKey: ["/api/certificates"],
    enabled: isAuthenticated,
  });

  const { data: announcements } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
    enabled: isAuthenticated,
  });

  // Courses CRUD
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<InsertCourse>({
    title: "",
    description: "",
    category: "ai-skills",
    duration: "",
    icon: "graduation-cap",
  });

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: InsertCourse) => {
      const res = await apiRequest("POST", "/api/courses", courseData);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "تم إنشاء الدورة" });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      setIsAddCourseOpen(false);
      setNewCourse({ title: "", description: "", category: "ai-skills", duration: "", icon: "graduation-cap" });
    },
    onError: () => toast({ title: "فشل إنشاء الدورة", variant: "destructive" }),
  });

  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Course> }) => {
      const res = await apiRequest("PATCH", `/api/courses/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "تم تحديث الدورة" });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/courses/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "تم حذف الدورة" });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
  });

  // Certificates delete
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

  // Student actions
  const deleteStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/students/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "تم حذف الطالب" });
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
    },
  });

  const enrollStudentMutation = useMutation({
    mutationFn: async ({ studentId, courseId }: { studentId: string; courseId: string }) => {
      const res = await apiRequest("POST", `/api/students/${studentId}/enroll/${courseId}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "تم تسجيل الطالب في الدورة" });
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
  });

  // Announcements CRUD
  const createAnnouncementMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const res = await apiRequest("POST", "/api/announcements", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "تم إنشاء الإعلان" });
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

  const handleAuth = () => {
    if (password === "bbsshhaarr6405") {
      setIsAuthenticated(true);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك Bashar في لوحة التحكم",
      });
    } else {
      toast({
        title: "كلمة مرور خاطئة",
        description: "يرجى التأكد من كلمة المرور",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setIsAuthenticated(false);
    setPassword("");
    onOpenChange(false);
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              لوحة التحكم
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="كلمة مرور المدير"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="rtl"
              data-testid="input-admin-password"
            />
            <Button
              onClick={handleAuth}
              className="w-full"
              data-testid="button-admin-login"
            >
              دخول
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">لوحة التحكم - منصة موروكس</DialogTitle>
          <Button
            onClick={handleClose}
            variant="outline"
            className="absolute left-4 top-4"
            data-testid="button-admin-close"
          >
            خروج
          </Button>
        </DialogHeader>

        <Tabs defaultValue="analytics" className="w-full" dir="rtl">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics" data-testid="tab-analytics">الإحصائيات</TabsTrigger>
            <TabsTrigger value="students" data-testid="tab-students">الطلاب</TabsTrigger>
            <TabsTrigger value="courses" data-testid="tab-courses">الدورات</TabsTrigger>
            <TabsTrigger value="certificates" data-testid="tab-certificates">الشهادات</TabsTrigger>
            <TabsTrigger value="announcements" data-testid="tab-announcements">الإعلانات</TabsTrigger>
          </TabsList>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الطلاب</CardTitle>
                  <i className="fas fa-users text-2xl text-primary"></i>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-students">
                    {students?.length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">عدد الدورات</CardTitle>
                  <i className="fas fa-book text-2xl text-secondary"></i>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-courses">
                    {courses?.length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">الشهادات الممنوحة</CardTitle>
                  <i className="fas fa-certificate text-2xl text-yellow-500"></i>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-certificates">
                    {certificates?.length || 0}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students */}
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الطلاب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students?.map((student) => (
                    <div
                      key={student.id}
                      className="flex justify-between items-center p-4 border rounded-lg"
                      data-testid={`row-student-${student.id}`}
                    >
                      <div>
                        <h4 className="font-semibold" data-testid={`text-student-name-${student.id}`}>
                          {student.name}
                        </h4>
                        <p className="text-gray-600" data-testid={`text-student-phone-${student.id}`}>
                          {student.phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant="outline" onClick={() => courses?.[0] && enrollStudentMutation.mutate({ studentId: student.id, courseId: courses[0].id })}>تسجيل بأول دورة</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteStudentMutation.mutate(student.id)}>حذف</Button>
                        <div className="text-sm text-gray-500">
                          {new Date(student.createdAt || "").toLocaleDateString("ar-EG")}
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500" data-testid="text-no-students">
                      لا توجد بيانات طلاب
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses */}
          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>إدارة الدورات</CardTitle>
                <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-course"><i className="fas fa-plus ml-2"></i>إضافة دورة</Button>
                  </DialogTrigger>
                  <DialogContent dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة دورة جديدة</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="course-title">العنوان</Label>
                        <Input id="course-title" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} />
                      </div>
                      <div>
                        <Label htmlFor="course-description">الوصف</Label>
                        <Textarea id="course-description" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} />
                      </div>
                      <div>
                        <Label>الفئة</Label>
                        <Select value={newCourse.category} onValueChange={(v) => setNewCourse({ ...newCourse, category: v as any })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ai-skills">مهارات الذكاء الاصطناعي</SelectItem>
                            <SelectItem value="academic">أكاديمية</SelectItem>
                            <SelectItem value="specialty">تخصصية</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="course-duration">المدة</Label>
                        <Input id="course-duration" value={newCourse.duration} onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} />
                      </div>
                      <div>
                        <Label>الأيقونة</Label>
                        <Select value={newCourse.icon} onValueChange={(v) => setNewCourse({ ...newCourse, icon: v as any })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["graduation-cap","student","chalkboard-teacher","heart","video","robot","code","palette","book","users"].map(i => (
                              <SelectItem key={i} value={i}>{i}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full" onClick={() => createCourseMutation.mutate(newCourse)} disabled={createCourseMutation.isPending}>
                        {createCourseMutation.isPending ? "جارٍ الإنشاء..." : "إنشاء"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses?.map((course) => (
                    <div
                      key={course.id}
                      className="border rounded-lg p-4"
                      data-testid={`card-admin-course-${course.id}`}
                    >
                      <h4 className="font-semibold mb-2" data-testid={`text-admin-course-title-${course.id}`}>
                        {course.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3" data-testid={`text-admin-course-description-${course.id}`}>
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-gray-500">{course.duration}</span>
                        <span className="text-primary font-medium">{course.category}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => updateCourseMutation.mutate({ id: course.id, updates: { isActive: !course.isActive } })}>
                          {course.isActive ? "تعطيل" : "تفعيل"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteCourseMutation.mutate(course.id)}>حذف</Button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500 col-span-2" data-testid="text-no-courses">
                      لا توجد دورات متاحة
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates */}
          <TabsContent value="certificates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الشهادات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certificates?.map((certificate) => (
                    <div
                      key={certificate.id}
                      className="flex justify-between items-center p-4 border rounded-lg"
                      data-testid={`row-certificate-${certificate.id}`}
                    >
                      <div>
                        <h4 className="font-semibold" data-testid={`text-certificate-code-${certificate.id}`}>
                          كود التحقق: {certificate.verificationCode}
                        </h4>
                        <p className="text-gray-600" data-testid={`text-certificate-student-${certificate.id}`}>
                          الطالب: {certificate.studentId}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-500">
                          {new Date(certificate.issueDate || "").toLocaleDateString("ar-EG")}
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => deleteCertificateMutation.mutate(certificate.id)}>حذف</Button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500" data-testid="text-no-certificates">
                      لا توجد شهادات ممنوحة
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements */}
          <TabsContent value="announcements" className="space-y-4">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>إدارة الإعلانات</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-announcement"><i className="fas fa-plus ml-2"></i>إضافة إعلان</Button>
                  </DialogTrigger>
                  <DialogContent dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة إعلان</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="announcement-title">العنوان</Label>
                        <Input id="announcement-title" onChange={(e) => (window as any)._annTitle = e.target.value} />
                      </div>
                      <div>
                        <Label htmlFor="announcement-content">المحتوى</Label>
                        <Textarea id="announcement-content" onChange={(e) => (window as any)._annContent = e.target.value} />
                      </div>
                      <Button className="w-full" onClick={() => createAnnouncementMutation.mutate({ title: (window as any)._annTitle || "", content: (window as any)._annContent || "" })}>
                        إنشاء
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements?.map((a) => (
                    <div key={a.id} className="p-4 border rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{a.title}</h4>
                        <p className="text-gray-600 text-sm">{a.content}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">نشط</span>
                          <Switch checked={!!a.isActive} onCheckedChange={(v) => updateAnnouncementMutation.mutate({ id: a.id, updates: { isActive: v } })} />
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => deleteAnnouncementMutation.mutate(a.id)}>حذف</Button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">لا توجد إعلانات</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
