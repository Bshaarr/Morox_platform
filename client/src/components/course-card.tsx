import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Course } from "@shared/schema";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const { toast } = useToast();

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
    const message = `مرحباً، أريد التسجيل في دورة: ${course.title}`;
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

  return (
    <Card className="hover:shadow-xl transition-all transform hover:-translate-y-1" data-testid={`card-course-${course.id}`}>
      <CardContent className="p-6">
        <div className="mb-4">
          <i className={`${getIconClass(course.icon)} text-3xl ${getIconColor(course.icon)} mb-3`}></i>
          <h5 className="font-bold text-lg mb-2" data-testid={`text-course-title-${course.id}`}>
            {course.title}
          </h5>
          <p className="text-gray-600 text-sm" data-testid={`text-course-description-${course.id}`}>
            {course.description}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-primary font-semibold" data-testid={`text-course-duration-${course.id}`}>
            {course.duration}
          </span>
          <Button
            onClick={handleEnroll}
            className="bg-primary text-white hover:bg-blue-800 transition-colors"
            data-testid={`button-enroll-${course.id}`}
          >
            التسجيل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
