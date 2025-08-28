import { useState } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant for student management. I can help you with tasks like analyzing student data, generating reports, or answering questions about your students. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock AI response - In real implementation, this would call OpenAI API
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Mock responses based on keywords
    const message = userMessage.toLowerCase();
    
    if (message.includes('student') && message.includes('report')) {
      return 'I can help you generate student reports! Based on your current data, I can create performance summaries, enrollment statistics, or individual student profiles. What type of report would you like me to prepare?';
    }
    
    if (message.includes('gpa') || message.includes('grade')) {
      return 'I can analyze GPA data and academic performance. I notice you have students with varying GPAs. Would you like me to identify students who might need academic support or generate a performance analysis?';
    }
    
    if (message.includes('search') || message.includes('find')) {
      return 'I can help you search and filter student records efficiently. You can ask me to find students by course, status, enrollment date, or any other criteria. What would you like to search for?';
    }
    
    if (message.includes('hello') || message.includes('hi')) {
      return 'Hello! I\'m here to help you manage your students more effectively. I can assist with data analysis, generating insights, creating reports, and answering questions about your student database.';
    }
    
    // Default response
    return `I understand you're asking about "${userMessage}". While I'm still learning about your specific needs, I can help with various student management tasks including data analysis, report generation, and administrative insights. Could you provide more details about what you'd like to accomplish?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQueries = [
    "Generate a student performance report",
    "Show me students with low GPA",
    "Create enrollment statistics",
    "Find students in Computer Science",
    "Analyze graduation trends"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">AI Assistant</h1>
          <p className="mt-2 text-muted-foreground">
            Get intelligent insights and assistance for your student management tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="card-elevated h-[600px] flex flex-col">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span>AI Chat</span>
                  <Badge variant="secondary">Beta</Badge>
                </CardTitle>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.sender === 'user' ? 'justify-end' : ''
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 opacity-70`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>

                    {message.sender === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Loader className="h-4 w-4 text-primary animate-spin" />
                    </div>
                    <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                      <p className="text-sm">AI is thinking...</p>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask me anything about your students..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="btn-primary"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Suggestions Panel */}
          <div className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Suggested Queries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full text-left justify-start h-auto p-3 text-sm"
                    onClick={() => setInputMessage(query)}
                  >
                    {query}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>AI Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Data Analysis</h4>
                  <p className="text-xs text-muted-foreground">
                    Analyze student performance, enrollment trends, and academic patterns.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Report Generation</h4>
                  <p className="text-xs text-muted-foreground">
                    Create detailed reports and summaries of student data.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Smart Search</h4>
                  <p className="text-xs text-muted-foreground">
                    Find students based on complex criteria and natural language queries.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="pt-6">
                <div className="text-center text-xs text-muted-foreground">
                  <p className="mb-2">💡 <strong>Note:</strong></p>
                  <p>This is a demo AI interface. In a production environment, this would connect to OpenAI's API for real AI-powered assistance.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPage;