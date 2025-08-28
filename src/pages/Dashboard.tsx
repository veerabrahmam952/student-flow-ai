import { Link } from 'react-router-dom';
import { Users, GraduationCap, UserPlus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { useStudents } from '@/hooks/useStudents';

const Dashboard = () => {
  const { getStats, students } = useStudents();
  const stats = getStats();

  const recentStudents = students.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Student Management Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage and track your students' progress and information.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Students"
            value={stats.total}
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Active Students"
            value={stats.active}
            icon={<UserPlus className="h-6 w-6" />}
          />
          <StatsCard
            title="Graduated"
            value={stats.graduated}
            icon={<GraduationCap className="h-6 w-6" />}
          />
          <StatsCard
            title="Average GPA"
            value={stats.avgGpa}
            icon={<TrendingUp className="h-6 w-6" />}
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 card-elevated transition-smooth hover:shadow-elevated">
            <div className="text-center">
              <UserPlus className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Add New Student</h3>
              <p className="text-muted-foreground mb-4">Register a new student in the system</p>
              <Link to="/add-student">
                <Button className="btn-primary">Add Student</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 card-elevated transition-smooth hover:shadow-elevated">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Manage Students</h3>
              <p className="text-muted-foreground mb-4">View, edit, or delete student records</p>
              <Link to="/students">
                <Button variant="outline">View All Students</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 card-elevated transition-smooth hover:shadow-elevated">
            <div className="text-center">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold text-foreground mb-2">AI Assistant</h3>
              <p className="text-muted-foreground mb-4">Get help with student management tasks</p>
              <Link to="/ai">
                <Button variant="secondary">Open AI Assistant</Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent Students */}
        <Card className="card-elevated">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Recent Students</h3>
              <Link to="/students">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </div>
          <div className="p-0">
            {recentStudents.length > 0 ? (
              <div className="divide-y divide-border">
                {recentStudents.map((student) => (
                  <div key={student.id} className="p-4 hover:bg-accent/50 transition-smooth">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{student.course}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          Status: <span className={`capitalize ${
                            student.status === 'active' ? 'text-success' : 
                            student.status === 'graduated' ? 'text-primary' : 'text-muted-foreground'
                          }`}>{student.status}</span>
                        </p>
                        {student.gpa && (
                          <p className="text-sm text-muted-foreground">GPA: {student.gpa}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No students yet. Add your first student!</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;