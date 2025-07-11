"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


export default function SetupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<"merchant" | "customer" | "">("");
  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // ✅ Fetch authenticated user and profile
  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserEmail(user.email);
      } else {
        router.push("/auth/login");
      }
    }
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!userId || !userEmail) throw new Error("User not authenticated.");
      if (!role) throw new Error("Please select a role.");

      if (role === "merchant") {
        if (!storeName || !storeSlug) {
          throw new Error("Please fill in all merchant fields.");
        }

        // Insert into merchants table
        const { data: merchantData, error: merchantError } = await supabase
          .from("merchants")
          .insert({
            name: storeName,
            store_slug: storeSlug,
            created_by: userId,
            subdomain: storeSlug,
          })
          .select("id")
          .single();

        if (merchantError) throw merchantError;

        const merchantId = merchantData.id;

        // Update profile with role, merchantId, and tenant_slug
        const { error: profileUpdateError } = await supabase
          .from("profiles")
          .update({
            role: "merchant",
            tenant_slug: storeSlug,
            merchant_id: merchantId,
          })
          .eq("id", userId);

        if (profileUpdateError) throw profileUpdateError;
      } else if (role === "customer") {
        // Update profile with role only
        const { error: profileUpdateError } = await supabase
          .from("profiles")
          .update({ role: "customer" })
          .eq("id", userId);

        if (profileUpdateError) throw profileUpdateError;
      }

      // Redirect to login after setup
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Complete your setup</CardTitle>
          <CardDescription>Select your role to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="mb-2 block">I am a...</Label>
              <RadioGroup value={role} onValueChange={setRole}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="r1" />
                  <Label htmlFor="r1">Customer</Label>
                </div>
                <div className="ml-4 text-muted-foreground text-sm mb-2">
                  View and browse products on our marketplace.
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="merchant" id="r2" />
                  <Label htmlFor="r2">Merchant</Label>
                </div>
                <div className="ml-4 text-muted-foreground text-sm">
                  Own an online market and sell your products here.
                </div>
              </RadioGroup>
            </div>

            {role === "merchant" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="store-slug">Store Slug (Subdomain)</Label>
                  <Input
                    id="store-slug"
                    value={storeSlug}
                    onChange={(e) => setStoreSlug(e.target.value)}
                    placeholder="e.g. quickmart"
                    required
                  />
                </div>
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Setting up..." : "Finish Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
