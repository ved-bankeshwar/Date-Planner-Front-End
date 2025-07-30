  "use client"
  // Quippy line state
 
  import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/useAuth"
import { Button } from "@/app/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card"
import { Badge } from "@/app/ui/badge"
import { Heart, MapPin, Clock, DollarSign, MessageCircle, Shirt, Car, Star, Calendar } from "lucide-react"
import Link from "next/link"
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";


export default function ResultsPage() {
  useAuth(); // Redirects to /auth if not logged in
  const [chatMessages, setChatMessages] = useState<Array<{ type: "user" | "ai"; message: string }>>([])
  const [chatInput, setChatInput] = useState("")
  const [showChat, setShowChat] = useState(false)

  // State for fetched date idea
  const [dateIdea, setDateIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Quippy line state and fetch function (moved inside ResultsPage)
  const [quippyLine, setQuippyLine] = useState<string>("");
  const [quippyLoading, setQuippyLoading] = useState(false);
  const [quippyError, setQuippyError] = useState("");
  const fetchQuippyLine = async () => {
    setQuippyLoading(true);
    setQuippyError("");
    setQuippyLine("");
    let mood = null;
    let status = null;
    if (typeof window !== "undefined") {
      mood = localStorage.getItem("mood");
      status = localStorage.getItem("status");
    }
    mood = mood || "Romantic";
    status = status || "Anniversary";
    try {
      const auth = getAuth();
      const user = auth.currentUser;  
      const idToken = user && (await user.getIdToken());
      const res = await fetch("http://localhost:8000/api/quippyLineLogic", {
        method: "POST",
        headers: { "Content-Type": "application/json",...(idToken && { Authorization: `Bearer ${idToken}` }) },
        credentials: "include",
        body: JSON.stringify({ mood, occasion: status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch one-liner");
      setQuippyLine(data.quip || data.message || "Here's a fun line for your date!");
    } catch (err: any) {
      setQuippyError(err.message || "Failed to fetch one-liner");
    } finally {
      setQuippyLoading(false);
    }
  };

  // Timeline state
  const [timeline, setTimeline] = useState<any[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineError, setTimelineError] = useState("");

  // Selection state
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<any>(null);

  // Fetch place suggestion on mount, using coordinates from localStorage
  useEffect(() => {
    const fetchPlace = async () => {
      if (typeof window === "undefined") return;
      setLoading(true);
      setFetchError("");
      try {
        // Get coordinates and form data from localStorage (set in form page)
        let latitude = localStorage.getItem("latitude") || "19.076";
        let longitude = localStorage.getItem("longitude") || "72.8777";
        let mood = localStorage.getItem("mood") || "Romantic";
        let budget = localStorage.getItem("budget") || "1000";
        let status = localStorage.getItem("status") || "Anniversary";
        let locationType = localStorage.getItem("locationType");
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          router.push("/auth"); // Redirect to auth page if not logged in
          return;
        }
        const idToken = user && (await user.getIdToken());
        const res = await fetch("http://localhost:8000/api/promptLogic", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(idToken && { Authorization: `Bearer ${idToken}` }) },
          credentials: "include",
          body: JSON.stringify({
            mood,
            budget,
            occasion: status,
            locationType: locationType,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch place");
        // Use the new response format from promptLogic
        const place = data.place || data; // fallback if backend sends directly
        setDateIdea({
          title: place.name || "Date Adventure",
          description: `A special date at ${place.name || "a great place"}.`,
          location: place.address || "",
          latitude: place.latitude,
          longitude: place.longitude,
          category: place.category,
          duration: "3-5 hours",
          budget: budget,
          time: "Evening",
          activities: [
            { time: "Start", activity: `Arrive at ${place.name || "the venue"}`, icon: MapPin },
            { time: "Enjoy", activity: "Enjoy your time together!", icon: Heart },
          ],
        });
      } catch (err: any) {
        setFetchError(err.message || "Failed to fetch place");
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, []);

  // Fetch outfit suggestions from backend
  const [outfitSuggestions, setOutfitSuggestions] = useState<any[]>([]);
  const [outfitLoading, setOutfitLoading] = useState(true);
  const [outfitError, setOutfitError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Get coordinates and form data from localStorage (set in form page)
    if (typeof window === "undefined") return;
    let lat = localStorage.getItem("latitude") || "19.076";
    let lng = localStorage.getItem("longitude") || "72.8777";
    let mood = localStorage.getItem("mood") || "Romantic";
    let status = localStorage.getItem("status") || "Anniversary";
    const fetchOutfits = async () => {
      setOutfitLoading(true);
      setOutfitError("");
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          router.push("/auth"); // Redirect to auth page if not logged in
          return;
        }
        const idToken = user && (await user.getIdToken());
        const res = await fetch("http://localhost:8000/api/outfitSuggester", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(idToken && { Authorization: `Bearer ${idToken}` }) },
          credentials: "include",
          body: JSON.stringify({
            mood,
            occasion: status
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch outfit suggestions");
        setOutfitSuggestions(data.images || []);
      } catch (err: any) {
        setOutfitError(err.message || "Failed to fetch outfit suggestions");
      } finally {
        setOutfitLoading(false);
      }
    };
    fetchOutfits();
  }, []);


  // Fetch actual flower vendors from backend
  const [flowerVendors, setFlowerVendors] = useState<any[]>([]);
  const [flowerLoading, setFlowerLoading] = useState(true);
  const [flowerError, setFlowerError] = useState("");

  useEffect(() => {
    // Get coordinates from localStorage (set in form page)
    if (typeof window === "undefined") return;
    let lat = localStorage.getItem("latitude") || "19.076";
    let lng = localStorage.getItem("longitude") || "72.8777";
    const fetchFlowers = async () => {
      setFlowerLoading(true);
      setFlowerError("");
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const idToken = user && (await user.getIdToken());
        const res = await fetch("http://localhost:8000/api/flowerVendor", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(idToken && { Authorization: `Bearer ${idToken}` }) },
          credentials: "include",
          body: JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch flower shops");
        setFlowerVendors(data.results || []);
      } catch (err: any) {
        setFlowerError(err.message || "Failed to fetch flower shops");
      } finally {
        setFlowerLoading(false);
      }
    };
    fetchFlowers();
  }, []);

  const handleChatSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!chatInput.trim()) return;

  setChatMessages((prev) => [...prev, { type: "user", message: chatInput }]);

  try {
    const auth = getAuth();
    const user = auth.currentUser;
    const idToken = user && (await user.getIdToken());

    let mood = localStorage.getItem("mood") || "Romantic";
    let budget = localStorage.getItem("budget") || "1000";
    let occasion = localStorage.getItem("status") || "Anniversary";
    let locationType = localStorage.getItem("locationType") || "cafe";
    let latitude = localStorage.getItem("latitude") || "19.076";
    let longitude = localStorage.getItem("longitude") || "72.8777";

    let selectedPlace = null;
    try {
      selectedPlace = JSON.parse(localStorage.getItem("selectedPlace") || "null");
    } catch (_) {
      selectedPlace = null;
    }

    if (!selectedPlace) {
      setChatMessages((prev) => [
        ...prev,
        {
          type: "ai",
          message: "Please confirm a place before refining your date!",
        },
      ]);
      return;
    }

    const res = await fetch("http://localhost:8000/api/chatLogic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
      credentials: "include",
      body: JSON.stringify({
        isSatisfied: false, // You can toggle this based on user intent
        selectedPlace,
        mood,
        budget,
        occasion,
        locationType,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Chat failed");

    setChatMessages((prev) => [
      ...prev,
      { type: "ai", message: data.message || "Here's something to consider!" },
    ]);

    // You could update morePlaces here, e.g.
    if (data.morePlaces) {
      // update your place list if you show new options
    }

  } catch (err: any) {
    setChatMessages((prev) => [
      ...prev,
      {
        type: "ai",
        message:
          err.message || "Hmm, something went wrong while refining the plan!",
      },
    ]);
  }

  setChatInput("");
};


  // Automatically generate timeline when both selectedPlace and selectedOutfit are set
  
   useEffect(() => {
    const generateTimeline = async () => {
      if (!selectedPlace || !selectedOutfit) return;
      setTimelineLoading(true);
      setTimelineError("");
      let mood = null, budget = null, occasion = null;
      if (typeof window !== "undefined") {
        mood = localStorage.getItem("mood");
        budget = localStorage.getItem("budget");
        occasion = localStorage.getItem("status");
      }
      mood = mood || "Romantic";
      budget = budget || "1000";
      occasion = occasion || "Anniversary";
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const idToken = user && (await user.getIdToken());
        const res = await fetch("http://localhost:8000/api/createTimeline", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(idToken && { Authorization: `Bearer ${idToken}` }) },
          credentials: "include",
          body: JSON.stringify({
            selectedPlace,
            selectedOutfit,
            mood,
            budget,
            occasion,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to generate timeline");
        setTimeline(data.timeline || []);
      } catch (err: any) {
        setTimelineError(err.message || "Failed to generate timeline");
      } finally {
        setTimelineLoading(false);
      }
    };
    generateTimeline();
  }, [selectedPlace, selectedOutfit]);

  return (
    <div className="min-h-screen bg-[url('/result_bg.svg')] p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Your Perfect Date Plan </h1>
          <p className="text-gray-600">Crafted specially for you by our AI cupid</p>
        </div>

        {/* Main Date Idea */}
        {loading ? (
          <div className="text-center text-lg text-gray-500">Loading your date plan...</div>
        ) : fetchError ? (
          <div className="text-center text-red-500">{fetchError}</div>
        ) : dateIdea ? (
          <>
            <Card className="bg-white/60 border-2 border-pink-300 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-gray-800 flex items-center justify-center gap-2">
                  <Heart className="text-pink-500" size={28} />
                  {dateIdea.title}
                </CardTitle>
                <p className="text-center text-gray-600 mt-2">{dateIdea.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Info */}
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg">
                    <MapPin className="text-pink-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-800">{dateIdea.location}</p>
                      {dateIdea.latitude && dateIdea.longitude && (
                        <a
                          href={`https://www.google.com/maps?q=${dateIdea.latitude},${dateIdea.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-xs mt-1 block"
                        >
                          View on Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                    <Clock className="text-purple-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-800">{dateIdea.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-rose-50 rounded-lg">
                    <p>₹</p>
                    <div>
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="font-semibold text-gray-800">{dateIdea.budget}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                    <Calendar className="text-yellow-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-semibold text-gray-800">{dateIdea.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Star className="text-blue-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-semibold text-gray-800">{dateIdea.category}</p>
                    </div>
                  </div>
                </div>

                {/* Quippy Line Section */}
                <div className="flex flex-col items-center mt-4">
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg mb-2"
                    onClick={fetchQuippyLine}
                    disabled={quippyLoading}
                  >
                    {quippyLoading ? "Getting a one-liner..." : "Get a Fun One-Liner"}
                  </Button>
                  {quippyLine && (
                    <div className="text-center text-pink-700 font-semibold mt-2">{quippyLine}</div>
                  )}
                  {quippyError && (
                    <div className="text-center text-red-500 mt-2">{quippyError}</div>
                  )}
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock className="text-pink-500" size={24} />
                    Your Date Timeline
                  </h3>
                  <div className="space-y-4">
                    {dateIdea.activities.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-white/50 rounded-lg">
                        <Badge variant="outline" className="border-pink-300 text-pink-600">
                          {activity.time}
                        </Badge>
                        <activity.icon className="text-gray-500" size={20} />
                        <span className="text-gray-700">{activity.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}

        {/* Additional Suggestions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Outfit Suggestions */}
          <Card className="bg-white/60 border-2 border-pink-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Shirt className="text-pink-500" size={24} />
                Outfit Ideas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {outfitLoading ? (
                <div className="text-gray-500">Loading outfit suggestions...</div>
              ) : outfitError ? (
                <div className="text-red-500">{outfitError}</div>
              ) : outfitSuggestions.length === 0 ? (
                <div className="text-gray-500">No outfit suggestions found.</div>
              ) : (
                outfitSuggestions.map((outfit, index) => (
                  <div
                    key={index}
                    className={`p-3 bg-pink-50 rounded-lg cursor-pointer border ${selectedOutfit === outfit ? 'border-pink-500 ring-2 ring-pink-300' : 'border-transparent'}`}
                    onClick={() => setSelectedOutfit(outfit)}
                  >
                    <h4 className="font-semibold text-gray-800">{outfit.type || outfit.name}</h4>
                    <p className="text-sm text-gray-600">{outfit.description}</p>
                    {selectedOutfit === outfit && <span className="text-pink-500 text-xs font-bold">Selected</span>}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Nearby Flower Vendors */}
          <Card className="bg-white/60 border-2 border-pink-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Star className="text-pink-500" size={24} />
                Nearby Flower Vendors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {flowerLoading ? (
                <div className="text-gray-500">Loading flower shops...</div>
              ) : flowerError ? (
                <div className="text-red-500">{flowerError}</div>
              ) : flowerVendors.length === 0 ? (
                <div className="text-gray-500">No flower vendors found nearby.</div>
              ) : (
                flowerVendors.map((vendor, index) => (
                  <div
                    key={index}
                    className={`p-3 bg-purple-50 rounded-lg cursor-pointer border ${selectedPlace === vendor ? 'border-pink-500 ring-2 ring-pink-300' : 'border-transparent'}`}
                    onClick={() => setSelectedPlace(vendor)}
                  >
                    <h4 className="font-semibold text-gray-800">{vendor.name}</h4>
                    <p className="text-sm text-gray-600">{vendor.address}</p>
                    <p className="text-sm text-gray-600">Distance: {vendor.distance ? `${vendor.distance}m` : "-"}</p>
                    {selectedPlace === vendor && <span className="text-pink-500 text-xs font-bold">Selected</span>}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        {/* Timeline Section */}
        <div className="my-8">
          {timelineLoading && (
            <div className="text-center text-lg text-gray-500">Generating Timeline...</div>
          )}
          {timelineError && <div className="text-red-500 mt-2">{timelineError}</div>}
          {timeline && timeline.length > 0 && (
            <div className="mt-6 bg-white/50 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-pink-600">Your Personalized Date Timeline</h3>
              <ol className="space-y-4 list-decimal list-inside">
                {timeline.map((step: any, idx: number) => (
                  <li key={idx} className="text-gray-800">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

 
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() => setShowChat(!showChat)}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white transition-transform duration-200 hover:-translate-y-1"
          >
            <MessageCircle size={20} className="mr-2" />
            Chat to Refine
          </Button>
          <Button
            variant="outline"
            className="border-pink-300 text-pink-600 hover:bg-pink-50 bg-transparent transition-transform duration-200 hover:-translate-y-1"
            onClick={() => window.open("https://www.zomato.com/dine-out", "_blank")}
          >
            <MapPin size={20} className="mr-2" />
            Book Restaurant
          </Button>
          <Button
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-50 bg-transparent transition-transform duration-200 hover:-translate-y-1"
            onClick={() => window.open("https://www.uber.com/in/en/", "_blank")}
          >
            <Car size={20} className="mr-2" />
            Book Transportation
          </Button>
          <Button
            variant="outline"
            className="border-rose-300 text-rose-600 hover:bg-rose-50 bg-transparent transition-transform duration-200 hover:-translate-y-1"
            onClick={async () => {
              // Gather required data
              if (!selectedPlace) {
                alert("Please select a place before completing the date.");
                return;
              }
              let mood = localStorage.getItem("mood") || "Romantic";
              let budget = localStorage.getItem("budget") || "1000";
              let location = localStorage.getItem("locationType") || "";
              try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) {
                  router.push("/auth");
                  return;
                }
                const idToken = user && (await user.getIdToken());
                const res = await fetch("http://localhost:8000/api/confirmAndStoreData", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", ...(idToken && { Authorization: `Bearer ${idToken}` }) },
                  credentials: "include",
                  body: JSON.stringify({
                    selectedPlace,
                    mood,
                    budget,
                    location,
                  }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Failed to save user preference");
                // Redirect to feedback page on success
                router.push("/feedback");
              } catch (err: any) {
                alert(err.message || "Failed to save user preference");
              }
            }}
          >
            <Star size={20} className="mr-2" />
            Complete Date
          </Button>
        </div>

        {/* Chat Interface */}
        {showChat && (
          <Card className="bg-white/60 border-2 border-pink-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <MessageCircle className="text-pink-500" size={24} />
                Chat with AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                {chatMessages.length === 0 ? (
                  <p className="text-gray-500 text-center">Ask me anything about your date plan!</p>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg max-w-xs ${
                        msg.type === "user" ? "bg-pink-500 text-white ml-auto" : "bg-white text-gray-800 border"
                      }`}
                    >
                      {msg.message}
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about changes to your date..."
                  className="flex-1 p-2 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400"
                />
                <Button type="submit" size="sm" className="bg-pink-500 hover:bg-pink-600 text-white">
                  Send
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
