import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { userJobsApi } from '@/lib/api/user';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddressAutocomplete from '@/components/ui/AddressAutocomplete';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const CreateJob = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobType, setJobType] = useState<'IMMEDIATE' | 'SCHEDULED' | 'BIDDING'>('IMMEDIATE');
  const [showLatLng, setShowLatLng] = useState(false);
  const { latitude, longitude, error: geolocationError } = useGeolocation();

  const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: jobType === 'BIDDING' ? z.string().min(1, "Description is required") : z.string().optional(),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(1, "Pincode is required"),
    latitude: z.number(),
    longitude: z.number(),
    numberOfWorkers: z.string().min(1, "Number of workers is required"),
    skillsCsv: jobType === 'BIDDING' ? z.string().min(1, "Skills are required") : z.string().optional(),
    budget: z.string().optional(),
    scheduledDate: jobType === 'SCHEDULED' ? z.string().optional() : z.string().optional(),
    scheduledTime: jobType === 'SCHEDULED' ? z.string().optional() : z.string().optional(),
    estimatedDuration: z.string().optional(),
    detailedDescription: jobType === 'BIDDING' ? z.string().min(1, "Detailed description is required") : z.string().optional(),
    startDate: jobType === 'BIDDING' ? z.string().optional() : z.string().optional(),
    siteVisitDeadline: jobType === 'BIDDING' ? z.string().optional() : z.string().optional(),
    quoteSubmissionDeadline: jobType === 'BIDDING' ? z.string().min(1, "Quote submission deadline is required") : z.string().optional(),
    materialsProvidedBy: jobType === 'BIDDING' ? z.string().optional() : z.string().optional(),
    expectedDays: jobType === 'BIDDING' ? z.string().optional() : z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      latitude: 0,
      longitude: 0,
      numberOfWorkers: "1",
      skillsCsv: "",
      budget: "",
    },
  });

  useEffect(() => {
    if (geolocationError) {
      toast({ title: "Geolocation Error", description: geolocationError, variant: "destructive" });
    }
    if (latitude && longitude) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const place = results[0];
          updateAddressFields(place);
        }
      });
    }
  }, [location, geolocationError, toast]);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    updateAddressFields(place);
    setShowLatLng(true);
  };

  const updateAddressFields = (place: google.maps.places.PlaceResult) => {
    let city = "";
    let state = "";
    let pincode = "";

    for (const component of place.address_components || []) {
      const componentType = component.types[0];
      switch (componentType) {
        case "locality":
          city = component.long_name;
          break;
        case "administrative_area_level_1":
          state = component.long_name;
          break;
        case "postal_code":
          pincode = component.long_name;
          break;
      }
    }
    form.setValue("address", place.formatted_address || "");
    form.setValue("city", city);
    form.setValue("state", state);
    form.setValue("pincode", pincode);
    form.setValue("latitude", place.geometry?.location?.lat() || 0);
    form.setValue("longitude", place.geometry?.location?.lng() || 0);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        ...values,
        jobType,
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
        numberOfWorkers: Number(values.numberOfWorkers || "1"),
        requiredSkills: values.skillsCsv?.split(",").map((s) => s.trim()).filter(Boolean),
        budget: values.budget ? Number(values.budget) : undefined,
      };
      await userJobsApi.createJob(payload as any);
      toast({ title: "Job created" });
      navigate("/user/jobs");
    } catch (err: any) {
      toast({ title: "Failed to create job", description: err?.response?.data?.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Card className="max-w-2xl mx-auto border-0 shadow-md">
            <CardHeader>
              <CardTitle>Create Job</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={jobType} onValueChange={(value) => setJobType(value as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="IMMEDIATE">Immediate</TabsTrigger>
                  <TabsTrigger value="SCHEDULED">Scheduled</TabsTrigger>
                  <TabsTrigger value="BIDDING">Bidding</TabsTrigger>
                </TabsList>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description {jobType !== 'BIDDING' && "(Optional)"}</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <AddressAutocomplete onPlaceSelect={handlePlaceSelect} country="in" initialValue={field.value} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {showLatLng && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="latitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Latitude</FormLabel>
                              <FormControl>
                                <Input {...field} readOnly />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="longitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Longitude</FormLabel>
                              <FormControl>
                                <Input {...field} readOnly />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="numberOfWorkers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Workers</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} max={20} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="skillsCsv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Required Skills {jobType !== 'BIDDING' && "(Optional)"}</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. plumbing, electrical" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget (INR)</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <TabsContent value="SCHEDULED">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="scheduledDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Scheduled Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="scheduledTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Scheduled Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="BIDDING">
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="detailedDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Detailed Description</FormLabel>
                              <FormControl>
                                <Textarea rows={4} placeholder="Provide detailed project requirements, scope of work, etc." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Desired Start Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="expectedDays"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expected Duration (days)</FormLabel>
                                <FormControl>
                                  <Input type="number" min={1} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="siteVisitDeadline"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Site Visit Deadline</FormLabel>
                                <FormControl>
                                  <Input type="datetime-local" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="quoteSubmissionDeadline"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quote Submission Deadline</FormLabel>
                                <FormControl>
                                  <Input type="datetime-local" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="materialsProvidedBy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Materials Provided By</FormLabel>
                              <FormControl>
                                <select className="border rounded h-10 px-3" {...field}>
                                  <option value="">Select...</option>
                                  <option value="USER">User (Client)</option>
                                  <option value="CONTRACTOR">Contractor</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                      <Button type="submit">Create</Button>
                    </div>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateJob;