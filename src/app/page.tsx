"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowRight, Heart, Brain, BookOpen, Clock, MessageCircle, Sparkles, Users, Shield, Activity } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "AI Life Guidance",
      description: "Get personalized advice from Bhagavad Gita wisdom for life's challenges",
      href: "/dashboard",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Breathing Exercises",
      description: "Calm your mind with guided breathing techniques and meditation",
      href: "/breathing",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Journaling",
      description: "Reflect and grow with guided journaling prompts and exercises",
      href: "/journaling",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Meditation Timer",
      description: "Build a consistent meditation practice with customizable timers",
      href: "/meditation",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Mood Tracker",
      description: "Track your daily moods and discover patterns in your emotional well-being",
      href: "/mood-tracker",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    }
  ];

  const benefits = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Mental Clarity",
      description: "Find peace and clarity through ancient wisdom and modern techniques"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Emotional Resilience",
      description: "Build strength to navigate life's challenges with grace"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Personal Growth",
      description: "Discover your true potential through self-reflection and guidance"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Support",
      description: "Join a community dedicated to mental wellness and growth"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Mental Wellness
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Journey to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Inner Peace</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover ancient wisdom from the Bhagavad Gita combined with modern mental health practices. 
            Find guidance, practice mindfulness, and cultivate emotional resilience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/dashboard">
                Ask AI for Guidance
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link href="/breathing">
                Start Breathing Exercise
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Mental Wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive toolkit combines ancient wisdom with modern mental health practices
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <Button variant="ghost" className="p-0 h-auto font-medium" asChild>
                    <Link href={feature.href}>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Saarthi?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the transformative power of combining ancient wisdom with modern mental health practices
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your path to mental wellness today with personalized guidance and proven techniques
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link href="/dashboard">
                Ask Your First Question
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link href="/profile">
                Create Your Profile
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Saarthi</h3>
          <p className="text-gray-400 mb-6">
            Your companion on the journey to mental wellness and spiritual growth
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>© 2025 Saarthi. All rights reserved.</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
