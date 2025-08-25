import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import StudentLogin from "@/components/student-login";
import AdminDashboard from "@/components/admin-dashboard";
import CourseCard from "@/components/course-card";
import type { Course } from "@shared/schema";

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const aiCourses = courses?.filter((course) => course.category === "ai-skills") || [];
  const academicCourses = courses?.filter((course) => course.category === "academic") || [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <i className="fas fa-robot text-3xl text-primary"></i>
                <div>
                  <h1 className="text-xl font-bold text-primary">موروكس</h1>
                  <p className="text-xs text-gray-600">منصة تدريب الذكاء الاصطناعي</p>
                </div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-gray-700 hover:text-primary transition-colors">
                عن موروكس
              </a>
              <a href="#courses" className="text-gray-700 hover:text-primary transition-colors">
                الدورات
              </a>
              <a href="#certificates" className="text-gray-700 hover:text-primary transition-colors">
                الشهادات
              </a>
              <a
                href="https://chat.whatsapp.com/FJnj4j3bMhJ15d7XhUBmgl?mode=ac_t"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                data-testid="link-whatsapp-group"
              >
                <i className="fab fa-whatsapp"></i>
                انضم للمجموعة
              </a>
            </nav>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setLoginOpen(true)}
                className="bg-primary text-white hover:bg-blue-800"
                data-testid="button-open-login"
              >
                تسجيل الدخول
              </Button>
              <Button
                onClick={() => setAdminOpen(true)}
                variant="ghost"
                size="icon"
                title="لوحة التحكم"
                data-testid="button-open-admin"
              >
                <i className="fas fa-cog text-lg"></i>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Social Media Bar */}
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-6">
            <span className="text-sm text-gray-600">تابعنا على:</span>
            <a
              href="https://www.facebook.com/share/1GmdvSKcuU/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
              data-testid="link-facebook"
            >
              <i className="fab fa-facebook text-lg"></i>
            </a>
            <a
              href="https://www.instagram.com/morox732?igsh=ajBlbW1jdHpweTdu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-800 transition-colors"
              data-testid="link-instagram"
            >
              <i className="fab fa-instagram text-lg"></i>
            </a>
            <a
              href="https://youtube.com/@morox732?si=IXRA6Jv8ut7L5Bvb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-800 transition-colors"
              data-testid="link-youtube"
            >
              <i className="fab fa-youtube text-lg"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                مرحباً بك في عالم
                <span className="text-yellow-400"> الذكاء الاصطناعي</span>
              </h2>
              <p className="text-xl mb-8 text-gray-200 leading-relaxed">
                تعلم مهارات الذكاء الاصطناعي بأسلوب ممتع وبسيط مع موروكس
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setLoginOpen(true)}
                  className="bg-yellow-400 text-gray-900 px-8 py-4 text-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105"
                  data-testid="button-hero-start"
                >
                  ابدأ رحلتك الآن
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all"
                  asChild
                >
                  <a href="#courses" data-testid="button-hero-explore">
                    استكشف الدورات
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="طلاب يتعلمون الذكاء الاصطناعي"
                className="rounded-2xl shadow-2xl w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
                alt="موروكس - مدرب الذكاء الاصطناعي"
                className="w-32 h-32 rounded-full mx-auto mb-6 shadow-lg"
              />
              <h3 className="text-3xl font-bold text-primary mb-4">لمحة عن موروكس</h3>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-lg leading-relaxed">
              <p className="mb-6">
                أنا <strong className="text-primary">موروكس</strong>، مالك منصات موروكس التدريبية، ومدرب مهارات الذكاء الاصطناعي.
              </p>
              <p className="mb-6">
                حلمي أن يوفر الناس جهودهم ويدعون الذكاء الاصطناعي يعمل عنهم ويتعلمون بعض مهاراته.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <i className="fas fa-brain text-3xl text-primary mb-3"></i>
                  <h4 className="font-semibold mb-2">تدريب متخصص</h4>
                  <p className="text-sm text-gray-600">دورات مصممة خصيصاً لكل فئة</p>
                </div>
                <div className="text-center">
                  <i className="fas fa-users text-3xl text-secondary mb-3"></i>
                  <h4 className="font-semibold mb-2">مجتمع تعليمي</h4>
                  <p className="text-sm text-gray-600">تفاعل مع المدربين والطلاب</p>
                </div>
                <div className="text-center">
                  <i className="fas fa-rocket text-3xl text-yellow-500 mb-3"></i>
                  <h4 className="font-semibold mb-2">مستقبل مشرق</h4>
                  <p className="text-sm text-gray-600">استعد لعصر الذكاء الاصطناعي</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-primary mb-4">دوراتنا التدريبية</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              اختر الدورة المناسبة لك واكتسب مهارات الذكاء الاصطناعي التي تحتاجها
            </p>
          </div>
          
          {/* AI Skills Courses */}
          <div className="mb-12">
            <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              دورات مهارات الذكاء الاصطناعي
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
          
          {/* Academic Courses */}
          {academicCourses.length > 0 && (
            <div className="mb-12">
              <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                الدورات الأكاديمية
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {academicCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}
          
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-semibold">
              <i className="fas fa-clock ml-2"></i>
              المزيد من الدورات قريباً
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-primary mb-4">شهادات الحضور المجانية</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              احصل على شهادات معتمدة عند إتمام دوراتك التدريبية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                alt="شهادة إتمام دورة"
                className="w-full rounded-lg shadow-lg mb-4"
              />
              <h4 className="font-bold text-lg mb-2">شهادات معتمدة</h4>
              <p className="text-gray-600">شهادات رسمية معتمدة لجميع الدورات</p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                alt="نظام التحقق الرقمي"
                className="w-full rounded-lg shadow-lg mb-4"
              />
              <h4 className="font-bold text-lg mb-2">تحقق رقمي</h4>
              <p className="text-gray-600">نظام تحقق رقمي للتأكد من صحة الشهادات</p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1517673400267-0251440c45dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
                alt="طلاب يحتفلون بالتخرج"
                className="w-full rounded-lg shadow-lg mb-4"
              />
              <h4 className="font-bold text-lg mb-2">تطوير مهني</h4>
              <p className="text-gray-600">شهادات تساعدك في التطوير المهني والأكاديمي</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button
              onClick={() => setLoginOpen(true)}
              className="bg-secondary text-white px-8 py-4 text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105"
              data-testid="button-certificates-get"
            >
              <i className="fas fa-certificate ml-2"></i>
              احصل على شهادتك الآن
            </Button>
          </div>
        </div>
      </section>

      {/* WhatsApp Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <i className="fab fa-whatsapp text-6xl text-green-500 mb-6"></i>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">انضم إلى مجتمعنا التعليمي</h3>
            <p className="text-lg text-gray-600 mb-8">
              انضم إلى قناة واتساب الخاصة بنا للحصول على آخر التحديثات والتسجيل في الدورات والتفاعل مع المدربين والطلاب
            </p>
            
            <Button
              asChild
              className="bg-green-500 text-white px-8 py-4 text-lg font-semibold hover:bg-green-600 transition-all transform hover:scale-105"
            >
              <a
                href="https://chat.whatsapp.com/FJnj4j3bMhJ15d7XhUBmgl?mode=ac_t"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3"
                data-testid="button-whatsapp-join"
              >
                <i className="fab fa-whatsapp text-2xl"></i>
                انضم لقناة واتساب موروكس
              </a>
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <i className="fas fa-bell text-3xl text-green-500 mb-3"></i>
                <h4 className="font-semibold mb-2">إشعارات فورية</h4>
                <p className="text-sm text-gray-600">احصل على إشعارات فورية بالدورات الجديدة</p>
              </div>
              <div className="text-center">
                <i className="fas fa-users text-3xl text-green-500 mb-3"></i>
                <h4 className="font-semibold mb-2">تفاعل مباشر</h4>
                <p className="text-sm text-gray-600">تفاعل مع المدربين والطلاب الآخرين</p>
              </div>
              <div className="text-center">
                <i className="fas fa-graduation-cap text-3xl text-green-500 mb-3"></i>
                <h4 className="font-semibold mb-2">دعم تعليمي</h4>
                <p className="text-sm text-gray-600">احصل على الدعم والمساعدة في رحلتك التعليمية</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-robot text-2xl text-primary"></i>
                <h4 className="text-xl font-bold">موروكس</h4>
              </div>
              <p className="text-gray-400 mb-4">منصة تدريب مهارات الذكاء الاصطناعي الرائدة في المنطقة</p>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/share/1GmdvSKcuU/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fab fa-facebook text-lg"></i>
                </a>
                <a
                  href="https://www.instagram.com/morox732?igsh=ajBlbW1jdHpweTdu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fab fa-instagram text-lg"></i>
                </a>
                <a
                  href="https://youtube.com/@morox732?si=IXRA6Jv8ut7L5Bvb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fab fa-youtube text-lg"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">روابط سريعة</h5>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">عن موروكس</a></li>
                <li><a href="#courses" className="text-gray-400 hover:text-white transition-colors">الدورات</a></li>
                <li><a href="#certificates" className="text-gray-400 hover:text-white transition-colors">الشهادات</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">الدورات</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">دورات الذكاء الاصطناعي</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">الدورات الأكاديمية</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">دورة إعداد المدربين</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">تواصل معنا</h5>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">
                  <i className="fab fa-whatsapp ml-2"></i>
                  قناة واتساب موروكس
                </p>
                <a
                  href="https://chat.whatsapp.com/FJnj4j3bMhJ15d7XhUBmgl?mode=ac_t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-blue-400 transition-colors block"
                >
                  انضم الآن
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 منصة موروكس التعليمية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      <StudentLogin open={loginOpen} onOpenChange={setLoginOpen} />
      <AdminDashboard open={adminOpen} onOpenChange={setAdminOpen} />
    </div>
  );
}
