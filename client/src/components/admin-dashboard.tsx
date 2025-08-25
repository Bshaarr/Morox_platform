import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Student, Course, Certificate } from "@shared/schema";

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

  const handleAuth = () => {
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة التحكم",
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics" data-testid="tab-analytics">الإحصائيات</TabsTrigger>
            <TabsTrigger value="students" data-testid="tab-students">الطلاب</TabsTrigger>
            <TabsTrigger value="courses" data-testid="tab-courses">الدورات</TabsTrigger>
            <TabsTrigger value="certificates" data-testid="tab-certificates">الشهادات</TabsTrigger>
          </TabsList>

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
                      <div className="text-sm text-gray-500">
                        {new Date(student.createdAt || "").toLocaleDateString("ar-EG")}
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

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الدورات</CardTitle>
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
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{course.duration}</span>
                        <span className="text-primary font-medium">{course.category}</span>
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
                      <div className="text-sm text-gray-500">
                        {new Date(certificate.issueDate || "").toLocaleDateString("ar-EG")}
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
