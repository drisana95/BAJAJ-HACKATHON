
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WebhookRequest, WebhookResponse, ProcessingStatus } from '@/types/api';
import { generateWebhook, processData, submitToWebhook } from '@/services/api';
import Header from '@/components/Header';
import StatusIndicator from '@/components/StatusIndicator';
import JsonDisplay from '@/components/JsonDisplay';
import UserForm from '@/components/UserForm';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  // Form state
  const [name, setName] = useState('John Doe');
  const [regNo, setRegNo] = useState('REG12347');
  const [email, setEmail] = useState('john@example.com');
  
  // Processing state
  const [status, setStatus] = useState<ProcessingStatus>({ 
    step: 'init', 
    message: 'Ready to process' 
  });
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null);
  const [processedResult, setProcessedResult] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('form');
  const [autoStart, setAutoStart] = useState(false);
  
  const isProcessing = status.step === 'fetching' || 
                      status.step === 'processing' || 
                      status.step === 'submitting';

  // Process the challenge flow
  const handleSubmit = async () => {
    try {
      setActiveTab('process');
      
      // Step 1: Generate webhook
      const request: WebhookRequest = { name, regNo, email };
      const response = await generateWebhook(request, setStatus);
      setWebhookResponse(response);
      
      // Step 2: Process the data
      const result = await processData(response, regNo, setStatus);
      setProcessedResult(result);
      
      // Step 3: Submit to webhook
      await submitToWebhook(
        response.webhook,
        response.accessToken,
        result,
        setStatus
      );
      
      setActiveTab('results');
    } catch (error) {
      console.error("Error in challenge flow:", error);
      toast.error("An error occurred in the process. Please try again.");
    }
  };

  // Auto-start on first load
  useEffect(() => {
    if (!autoStart) {
      setAutoStart(true);
      handleSubmit();
    }
  }, []);

  const getQuestionType = () => {
    if (!webhookResponse) return null;
    return webhookResponse.question || 
           ('n' in (webhookResponse.data as any).users ? 2 : 1);
  };
  
  const questionType = getQuestionType();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Health-Rx Solver" 
        description="BajajFinserv Health Programming Challenge" 
      />
      
      <main className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>Enter your details to start processing</CardDescription>
              </CardHeader>
              <CardContent>
                <UserForm 
                  name={name}
                  setName={setName}
                  regNo={regNo}
                  setRegNo={setRegNo}
                  email={email}
                  setEmail={setEmail}
                  onSubmit={handleSubmit}
                  isLoading={isProcessing}
                />
              </CardContent>
            </Card>
            
            <Card className="mt-6 bg-health-50">
              <CardHeader>
                <CardTitle>Processing Status</CardTitle>
                <CardDescription>Current state of the API flow</CardDescription>
              </CardHeader>
              <CardContent>
                <StatusIndicator status={status} />
                
                {questionType && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Question Type:</span>
                      <Badge variant="outline" className="bg-health-100 text-health-800">
                        {questionType === 1 ? 'Mutual Followers' : 'Nth-Level Followers'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {questionType === 1 
                        ? 'Find mutual follow pairs where users follow each other'
                        : 'Find user IDs exactly N levels away in the follows list'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-8">
            <Tabs 
              defaultValue="form" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="form">Setup</TabsTrigger>
                <TabsTrigger value="process">Process</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="form" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Challenge Instructions</CardTitle>
                    <CardDescription>How the Health-Rx Solver works</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>The application will automatically make a request to the Health-Rx API on startup.</li>
                      <li>Based on your registration number, you'll receive either Question 1 (odd last digit) or Question 2 (even last digit).</li>
                      <li>The application will process the data according to the question type.</li>
                      <li>Results will be submitted to the provided webhook with JWT authentication.</li>
                      <li>If submission fails, the application will retry up to 4 times.</li>
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="process" className="mt-4 space-y-4">
                {webhookResponse && (
                  <JsonDisplay 
                    title="API Response"
                    data={webhookResponse}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="results" className="mt-4 space-y-4">
                {processedResult && (
                  <JsonDisplay 
                    title="Processed Result"
                    data={processedResult}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
