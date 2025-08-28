import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStudents } from '@/hooks/useStudents';
import { useToast } from '@/hooks/use-toast';
import { Student } from '@/types/student';

const ViewStudentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStudent } = useStudents();
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundStudent = getStudent(id);
      if (foundStudent) {
        setStudent(foundStudent);
      } else {
        toast({
          title: "Student Not Found",
          description: "The requested student could not be found.",
          variant: "destructive",
        });
        navigate('/students');
      }
    }
    setLoading(false);
  }, [id, getStudent, navigate, toast]);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      graduated: 'secondary',
      inactive: 'outline',
    };

    const colors = {
      active: 'bg-success/10 text-success border-success/20',
      graduated: 'bg-primary/10 text-primary border-primary/20',
      inactive: 'bg-muted text-muted-foreground border-muted-foreground/20',
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading student information...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  const age = new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {student.firstName} {student.lastName}
              </h1>
              <p className="mt-2 text-muted-foreground">Student Information</p>
            </div>
            <Link to={`/edit-student/${student.id}`}>
              <Button className="btn-primary">
                <Edit className="h-4 w-4 mr-2" />
                Edit Student
              </Button>
            </Link>
          </div>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">First Name</p>
                    <p className="text-lg text-foreground">{student.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                    <p className="text-lg text-foreground">{student.lastName}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg text-foreground">
                      {new Date(student.dateOfBirth).toLocaleDateString()} (Age {age})
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <p className="text-lg text-foreground">{student.address || 'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${student.email}`}
                      className="text-lg text-primary hover:underline"
                    >
                      {student.email}
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`tel:${student.phone}`}
                      className="text-lg text-primary hover:underline"
                    >
                      {student.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Academic Status */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Academic Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(student.status)}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Course</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg text-foreground">{student.course}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Enrollment Date</p>
                  <p className="text-lg text-foreground">
                    {new Date(student.enrollmentDate).toLocaleDateString()}
                  </p>
                </div>

                {student.gpa && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">GPA</p>
                    <div className="mt-1">
                      <span className="text-2xl font-bold text-foreground">{student.gpa.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground ml-1">/ 4.0</span>
                    </div>
                    <div className="mt-2 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-smooth"
                        style={{ width: `${(student.gpa / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to={`/edit-student/${student.id}`}>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Information
                  </Button>
                </Link>
                <a href={`mailto:${student.email}`}>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </a>
                <a href={`tel:${student.phone}`}>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Student
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentPage;