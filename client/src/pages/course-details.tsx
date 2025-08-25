import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Course } from "@shared/schema";

export default function CourseDetails() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const courseId = params?.id;

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const course = courses?.find(c => c.id === courseId);

  const handleEnroll = () => {
    const currentStudent = localStorage.getItem("currentStudent");
    if (!currentStudent) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يرجى تسجيل الدخول أولاً للتسجيل في الدورة",
        variant: "destructive",
      });
      return;
    }

    // Open WhatsApp with enrollment message
    const message = `مرحباً، أريد التسجيل في دورة: ${course?.title}`;
    const whatsappUrl = `https://chat.whatsapp.com/FJnj4j3bMhJ15d7XhUBmgl?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    
    toast({
      title: "تم توجيهك لواتساب",
      description: "سيتم التواصل معك قريباً لإتمام التسجيل",
    });
  };

  const getIconClass = (icon: string) => {
    const iconMap: Record<string, string> = {
      "graduation-cap": "fas fa-graduation-cap",
      "student": "fas fa-user-graduate",
      "chalkboard-teacher": "fas fa-chalkboard-teacher",
      "heart": "fas fa-heart",
      "video": "fas fa-video",
      "robot": "fas fa-robot",
      "code": "fas fa-code",
      "palette": "fas fa-palette",
      "book": "fas fa-book",
      "users": "fas fa-users",
    };
    return iconMap[icon] || "fas fa-graduation-cap";
  };

  const getIconColor = (icon: string) => {
    const colorMap: Record<string, string> = {
      "graduation-cap": "text-primary",
      "student": "text-secondary",
      "chalkboard-teacher": "text-yellow-500",
      "heart": "text-pink-500",
      "video": "text-red-500",
      "robot": "text-purple-500",
      "code": "text-green-500",
      "palette": "text-indigo-500",
      "book": "text-blue-500",
      "users": "text-orange-500",
    };
    return colorMap[icon] || "text-primary";
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
            <h2 className="text-xl font-bold mb-2">الدورة غير موجودة</h2>
            <p className="text-gray-600 mb-4">لم يتم العثور على الدورة المطلوبة</p>
            <Button onClick={() => setLocation("/")} data-testid="button-back-home">
              العودة للصفحة الرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/")}
              data-testid="button-back"
            >
              <i className="fas fa-arrow-right ml-2"></i>
              العودة
            </Button>
            <h1 className="text-2xl font-bold text-primary">تفاصيل الدورة</h1>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <div className="mb-4">
              <i className={`${getIconClass(course.icon)} text-6xl ${getIconColor(course.icon)} mb-4`}></i>
            </div>
            <CardTitle className="text-3xl mb-2" data-testid="text-course-title">
              {course.title}
            </CardTitle>
            <div className="flex justify-center items-center gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                <i className="fas fa-clock"></i>
                {course.duration}
              </span>
              <span className="flex items-center gap-2">
                <i className="fas fa-tag"></i>
                {course.category === "ai-skills" ? "مهارات الذكاء الاصطناعي" : 
                 course.category === "academic" ? "دورات أكاديمية" : "دورات تخصصية"}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Short Description */}
            <div>
              <h3 className="text-xl font-semibold mb-3">نظرة عامة</h3>
              <p className="text-gray-700 leading-relaxed" data-testid="text-course-description">
                {course.description}
              </p>
            </div>

            {/* Detailed Description */}
            {course.detailedDescription && (
              <div>
                <h3 className="text-xl font-semibold mb-3">تفاصيل الدورة</h3>
                <div className="prose prose-right max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line" data-testid="text-course-detailed-description">
                    {course.detailedDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Enrollment Section */}
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-4">سجل الآن في هذه الدورة</h3>
              <p className="text-gray-600 mb-4">
                انضم إلى مجتمع الطلاب وابدأ رحلتك التعليمية
              </p>
              <Button
                onClick={handleEnroll}
                size="lg"
                className="bg-primary text-white hover:bg-blue-800 transition-colors"
                data-testid="button-enroll-course"
              >
                <i className="fab fa-whatsapp ml-2"></i>
                التسجيل عبر واتساب
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}