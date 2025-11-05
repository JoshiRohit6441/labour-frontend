import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { contractorProfileApi } from "@/lib/api/contractor";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import AddressAutocomplete from "@/components/ui/AddressAutocomplete";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const profileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  businessAddress: z.string().min(1, "Business address is required"),
  businessCity: z.string().min(1, "City is required"),
  businessState: z.string().min(1, "State is required"),
  businessPincode: z.string().min(1, "Pincode is required"),
  businessLatitude: z.number(),
  businessLongitude: z.number(),
  coverageRadius: z.string().min(1, "Coverage radius is required"),
  bankAccountNumber: z.string().optional(),
  bankIfscCode: z.string().optional(),
  bankAccountName: z.string().optional(),
});

const ContractorProfile = () => {
  const { toast } = useToast();
  const [isExisting, setIsExisting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLatLng, setShowLatLng] = useState(false);
  const { latitude, longitude, error: geolocationError } = useGeolocation();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      gstNumber: "",
      panNumber: "",
      businessAddress: "",
      businessCity: "",
      businessState: "",
      businessPincode: "",
      businessLatitude: 0,
      businessLongitude: 0,
      coverageRadius: "20",
      bankAccountNumber: "",
      bankIfscCode: "",
      bankAccountName: "",
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await contractorProfileApi.get();
        const p = res?.contractor;
        if (p) {
          form.reset(p);
          setIsExisting(true);
          if (p.businessAddress) {
            setShowLatLng(true);
          }
        }
      } catch {
        setIsExisting(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [form]);

  const useLiveLocation = () => {
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
  };

  useEffect(() => {
    if (!isExisting && !form.getValues("businessAddress")) {
      useLiveLocation();
    }
  }, [isExisting, form, useLiveLocation]);

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
    form.setValue("businessAddress", place.formatted_address || "");
    form.setValue("businessCity", city);
    form.setValue("businessState", state);
    form.setValue("businessPincode", pincode);
    form.setValue("businessLatitude", place.geometry?.location?.lat() || 0);
    form.setValue("businessLongitude", place.geometry?.location?.lng() || 0);
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      const payload = {
        ...values,
        coverageRadius: Number(values.coverageRadius),
      };
      if (isExisting) {
        await contractorProfileApi.update(payload as any);
        toast({ title: "Profile updated successfully" });
      } else {
        await contractorProfileApi.create(payload as any);
        toast({ title: "Profile created successfully" });
        setIsExisting(true);
      }
    } catch (e: any) {
      toast({
        title: "Failed to save",
        description: e?.response?.data?.message || e.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Card className="max-w-3xl mx-auto border-0 shadow-md">
            <CardHeader>
              <CardTitle>
                {isExisting ? "Edit Business Profile" : "Create Business Profile"}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Type</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gstNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="panNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAN Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Business Address</Label>
                      {isExisting && form.getValues("businessAddress") && (
                        <Button type="button" variant="link" onClick={useLiveLocation}>Use Live Location</Button>
                      )}
                    </div>
                    <AddressAutocomplete onPlaceSelect={handlePlaceSelect} initialValue={form.getValues("businessAddress")} />
                  </div>

                  {showLatLng && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="businessLatitude"
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
                        name="businessLongitude"
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
                      name="businessCity"
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
                      name="businessState"
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
                    name="businessPincode"
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
                    name="coverageRadius"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coverage Radius (km)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bankAccountName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Account Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bankAccountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Account Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bankIfscCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IFSC Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 text-center">
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContractorProfile;