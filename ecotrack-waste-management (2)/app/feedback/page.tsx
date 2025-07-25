"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowLeft, CheckCircle, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { io, Socket } from "socket.io-client"

let socket: Socket;

export default function FeedbackPage() {
  const { token } = useAuth();
  const [rating, setRating] = useState(0)
  const [category, setCategory] = useState("")
  const [feedback, setFeedback] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [recentFeedback, setRecentFeedback] = useState<any[]>([])

  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000");
      socket.on("newFeedback", (data) => {
        setRecentFeedback((prev) => [data, ...prev]);
      });
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Fetch recent feedback on mount
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/feedback`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setRecentFeedback(data))
        .catch(() => setRecentFeedback([]));
    }
  }, [token]);

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating,
          category,
          feedback,
          email,
          submittedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      setIsSubmitted(true)
    } catch (error: any) {
      alert('Error submitting feedback: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your feedback has been submitted successfully. We appreciate your input and will use it to improve our
              services.
            </p>
            <div className="space-y-2">
              <Link href="/">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">Return to Dashboard</Button>
              </Link>
              <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                Submit More Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Service Feedback
          </h1>
          <p className="text-gray-600">Help us improve waste management services in your community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Experience</CardTitle>
              <CardDescription>Your feedback helps us provide better waste management services</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Overall Rating</Label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className={`p-1 transition-colors ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                      >
                        <Star className="w-8 h-8 fill-current" />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-gray-600">
                      {rating === 1 && "Poor - Needs significant improvement"}
                      {rating === 2 && "Fair - Some issues need addressing"}
                      {rating === 3 && "Good - Generally satisfactory"}
                      {rating === 4 && "Very Good - Mostly excellent service"}
                      {rating === 5 && "Excellent - Outstanding service"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Feedback Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="collection">Waste Collection</SelectItem>
                      <SelectItem value="bins">Bin Maintenance</SelectItem>
                      <SelectItem value="recycling">Recycling Services</SelectItem>
                      <SelectItem value="app">Mobile App</SelectItem>
                      <SelectItem value="staff">Staff Service</SelectItem>
                      <SelectItem value="response">Response Time</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Your Feedback</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Please share your experience, suggestions, or concerns..."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                  <p className="text-sm text-gray-500">
                    Provide your email if you'd like us to follow up on your feedback
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  disabled={isSubmitting || !rating || !category || !feedback}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Community Feedback</CardTitle>
                <CardDescription>See what other community members are saying</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentFeedback.map((item, index) => (
                  <div key={index} className="border-l-4 border-l-green-500 pl-4 py-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        ))}
                        {[...Array(5 - item.rating)].map((_, i) => (
                          <Star key={i + item.rating} className="w-4 h-4 text-gray-300" />
                        ))}
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{item.feedback}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(item.submittedAt).toLocaleString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
