"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowRight, BarChart2, CheckCircle, ChevronRight, Globe, Lock, MessageSquare, PieChart, Users } from "lucide-react"
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"

export default function Home() {
  // Check if user is already logged in and redirect to dashboard
  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("Home page: User already logged in, redirecting to dashboard");
          window.location.href = "/dashboard";
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAndRedirect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#f2f8e6] font-mono text-black">
      {/* Header */}
      <header className="py-4 px-8 flex justify-between items-center">
        <div className="text-xl font-bold">PulseCheck </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex space-x-4 text-sm">
            <Link href="#" className="text-black">Dashboard</Link>
            <Link href="#" className="text-black">Team Stats</Link>
            <Link href="#" className="text-black">About Us</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-8 pt-12 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-center">
              <div className="order-2 md:order-1">
                <h1 className="text-4xl md:text-5xl font-bold uppercase leading-tight mb-6">
                  Transform <span className="bg-black text-white px-2">Team</span> Collaboration
                </h1>
                <p className="text-sm mb-8 max-w-md">
                  Use real-time analytics to amplify team productivity, track performance, 
                  and improve team health across distributed workforces.
                </p>
                <div className="flex gap-4">
                  <Link href="/login">
                    <Button className="rounded-full bg-black text-white text-sm py-2 h-10 px-6 flex items-center gap-2">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="outline" className="rounded-full border-2 border-black bg-white text-black text-sm py-2 h-10 px-6">
                      Sign Up
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 mt-8">
                  <div className="flex -space-x-2">
                    {[
                      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300",
                      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300",
                      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300",
                      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300"
                    ].map((imgSrc, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                        <Image 
                          src={imgSrc}
                          alt={`Team member ${i+1}`}
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs">Join <span className="font-bold">2,000+</span> All Managed By Pranav Nair </p>
                </div>
              </div>
              <div className="order-1 md:order-2 relative">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#9ff561] rounded-full flex items-center justify-center z-10">
                  <PieChart className="h-8 w-8" />
                </div>
                <div className="rounded-xl overflow-hidden aspect-[4/3] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <Image 
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80" 
                    alt="Team collaboration dashboard"
                    width={800}
                    height={600}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -left-6 bottom-8 bg-white p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <div>
                    <div className="text-xs font-bold">Collaboration Score</div>
                    <div className="text-sm font-bold">92%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-center uppercase mb-12">How PulseCheck Transforms Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-black mb-4 flex items-center justify-center">
                  <BarChart2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold mb-2 text-sm">Real-time Analytics</h3>
                <p className="text-xs">
                  Get instant insights into team performance and collaboration patterns to make data-driven decisions.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-black mb-4 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold mb-2 text-sm">Team Wellbeing</h3>
                <p className="text-xs">
                  Identify signs of burnout or disengagement before they impact your team's productivity and health.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-black mb-4 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold mb-2 text-sm">Privacy-First</h3>
                <p className="text-xs">
                  Comprehensive analytics without compromising your team's privacy or personal data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Visualization Section */}
        <section className="px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="absolute -left-6 -top-6">
                  <Globe className="h-6 w-6" />
                </div>
                <div className="rounded-xl overflow-hidden aspect-[4/3]">
                  <Image 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                    alt="Data visualization dashboard"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-2xl font-bold uppercase leading-tight mb-4">
                  Visualize Your Team's Collaboration Trends Effortlessly
                </h2>
                <p className="text-xs mb-6">
                  With PulseCheck, you can track your team collaboration patterns over time, 
                  identify trends, and make data-driven decisions to optimize team workflow.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-xs">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Interactive dashboards that update in real-time</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Customizable views for different team roles</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Export options for reports and presentations</span>
                  </li>
                </ul>
                <div className="flex items-center gap-1 text-xs">
                  <span>Learn More</span>
                  <span className="text-xs">01 / 03</span>
                </div>
              </div>
            </div>
          </div>
        </section>

    

        {/* Integration Section */}
        <section className="px-8 py-12">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-xl font-bold text-center uppercase mb-8">Works With Your Existing Tools</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-8 items-center justify-items-center">
              {[
                { name: "Slack", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png" },
                { name: "Microsoft Teams", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg/1200px-Microsoft_Office_Teams_%282018%E2%80%93present%29.svg.png" },
                { name: "Jira", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Jira_%28Software%29_logo.svg/2000px-Jira_%28Software%29_logo.svg.png" },
                { name: "GitHub", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/2048px-Octicons-mark-github.svg.png" },
               
              ].map((integration, i) => (
                <div key={i} className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm hover:shadow-md transition-shadow">
                  <Image 
                    src={integration.logo}
                    alt={`${integration.name} logo`}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
            <p className="text-center text-xs mt-6">
              PulseCheck seamlessly integrates with your favorite productivity and collaboration tools.
            </p>
          </div>
        </section>

     

        {/* Pricing Section */}
        <section className="px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-center uppercase mb-2">Simple, Transparent Pricing</h2>
            <p className="text-center text-xs mb-8">Choose the plan that's right for your team</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Starter",
                  price: "$9",
                  period: "per user / month",
                  description: "Perfect for small teams just getting started",
                  features: [
                    "Basic team analytics",
                    "14-day data history",
                    "5 team members",
                    "Email support"
                  ]
                },
                {
                  name: "Professional",
                  price: "$19",
                  period: "per user / month",
                  description: "Ideal for growing teams who need more insights",
                  features: [
                    "Advanced team analytics",
                    "30-day data history",
                    "Unlimited team members",
                    "Priority support",
                    "Custom reports"
                  ],
                  highlighted: true
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "contact for pricing",
                  description: "For organizations with specific compliance needs",
                  features: [
                    "Everything in Professional",
                    "Unlimited data history",
                    "Dedicated account manager",
                    "Custom integrations",
                    "On-premise deployment option"
                  ]
                }
              ].map((plan, i) => (
                <div key={i} className={`rounded-lg p-6 flex flex-col ${plan.highlighted ? 'bg-[#ebf5dc] border-2 border-black' : 'bg-white border border-black/20'}`}>
                  <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-xs">{plan.period}</span>
                  </div>
                  <p className="text-xs mb-4">{plan.description}</p>
                  <ul className="space-y-2 mb-6 flex-grow">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs">
                        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant={plan.highlighted ? "default" : "outline"} className={`rounded-full text-xs py-1 h-8 px-4 w-full ${plan.highlighted ? 'bg-black text-white' : 'border-black text-black'}`}>
                          Choose Plan
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Coming soon</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
       
        {/* Stats Section */}
        <section className="px-8 py-12 bg-black text-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "93%", label: "of teams report improved collaboration" },
                { value: "4.8x", label: "increase in team productivity" },
                { value: "78%", label: "reduction in miscommunications" },
                { value: "2.5hrs", label: "saved per employee each week" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <p className="text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      

        {/* Team Section */}
        <section className="px-8 py-12 bg-[#f2f8e6]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center uppercase mb-4 text-black">Our Team</h2>
            <p className="text-center mb-12 text-black text-sm">Meet the people who collaborated to build PulseCheck.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-8">
              {[
                {
                  name: "Maya Johnson",
                  role: "Design Lead & Co-Founder",
                  social: ["twitter", "linkedin", "github"],
                  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80"
                },
                {
                  name: "Jamie Smith",
                  role: "Lead Developer",
                  social: ["twitter", "linkedin", "github"],
                  image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
                },
                {
                  name: "Emily Brown",
                  role: "Product Manager",
                  social: ["twitter", "linkedin"],
                  image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
                },
                {
                  name: "Brian Lee",
                  role: "Data Scientist",
                  social: ["linkedin", "github"],
                  image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
                },
                {
                  name: "Rebecca Miller",
                  role: "Marketing Director",
                  social: ["twitter", "linkedin"],
                  image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                },
                {
                  name: "Sophia Wang",
                  role: "UX Researcher",
                  social: ["twitter", "linkedin"],
                  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80"
                },
                {
                  name: "Olivia Harris",
                  role: "Customer Success",
                  social: ["linkedin"],
                  image: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                },
                {
                  name: "James Young",
                  role: "Systems Architect",
                  social: ["linkedin", "github"],
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
                }
              ].map((member, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full mb-3 relative overflow-hidden">
                    <Image
                      src={member.image}
                      alt={`Photo of ${member.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-black text-sm">{member.name}</h3>
                  <p className="text-xs text-black mb-2">{member.role}</p>
                  <div className="flex gap-1">
                    {member.social.map((platform, i) => (
                      <div key={i} className="w-4 h-4 bg-black rounded-full"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
          {/* FAQ Section */}
          <section className="px-8 py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-center uppercase mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  question: "How does PulseCheck collect team data?",
                  answer: "PulseCheck integrates with your existing tools through secure APIs, collecting only the data needed to generate insights while respecting privacy boundaries."
                },
                {
                  question: "Is my team's data secure?",
                  answer: "Absolutely. We use industry-leading encryption and never store sensitive content from your communications. All data is anonymized in reports."
                },
                {
                  question: "How quickly can we see results?",
                  answer: "Most teams start seeing valuable insights within the first week. The longer you use PulseCheck, the more personalized and accurate the insights become."
                },
                {
                  question: "Can we customize what data is tracked?",
                  answer: "Yes, you can configure exactly what metrics matter most to your team and customize privacy settings to align with your organization's policies."
                },
                {
                  question: "Do you offer onboarding support?",
                  answer: "All plans include guided onboarding. Enterprise plans include dedicated implementation specialists to ensure smooth adoption."
                }
              ].map((item, i) => (
                <div key={i} className="border border-black/20 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm">{item.question}</h3>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <p className="text-xs mt-2">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="px-8 py-12 bg-[#ebf5dc]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl font-bold uppercase mb-2">Stay Updated</h2>
            <p className="text-xs mb-6">Subscribe to our newsletter for the latest product updates and team collaboration insights.</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="rounded-full px-4 py-2 text-xs border border-black flex-grow"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="rounded-full bg-black text-white text-xs py-1 h-8 px-4">
                      Subscribe
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming soon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </section>

        {/* CTA Section */}
       
      </main>

      <footer className="bg-[#f2f8e6] pt-16 pb-8 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Logo and description */}
            <div className="md:col-span-2">
              <div className="text-xl font-bold mb-4">PulseCheck</div>
              <p className="text-base mb-6 max-w-xs text-black/70">
                Transform team collaboration with real-time analytics and insights that drive productivity.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'linkedin', 'github', 'instagram'].map((social, i) => (
                  <Link 
                    href="#" 
                    key={i} 
                    className="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:bg-[#9ff561] hover:text-black transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    {social === 'twitter' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>}
                    {social === 'linkedin' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>}
                    {social === 'github' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>}
                    {social === 'instagram' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Link columns */}
            <div>
              <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Product</h3>
              <ul className="space-y-3">
                {["Features", "Pricing", "Security", "Roadmap"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-sm text-black/70 hover:text-black transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Company</h3>
              <ul className="space-y-3">
                {["About Us", "Careers", "Blog", "Press"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-sm text-black/70 hover:text-black transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Resources</h3>
              <ul className="space-y-3">
                {["Documentation", "Help Center", "API", "Community"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-sm text-black/70 hover:text-black transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="border-t border-black/10 pt-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="font-bold text-sm mb-2 uppercase tracking-wider">Subscribe to our newsletter</h3>
                <p className="text-sm text-black/70 max-w-md">Stay up to date with the latest features and product updates</p>
              </div>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="rounded-l-full px-4 py-2 text-sm border-y border-l border-black/20 focus:outline-none focus:border-black focus:ring-1 focus:ring-black w-full max-w-xs"
                />
                <Button className="rounded-r-full bg-black text-white text-sm py-2 h-10 px-4 hover:bg-[#9ff561] hover:text-black transition-colors">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          {/* Bottom footer */}
          <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row md:items-center justify-between">
            <p className="text-sm text-black/70 mb-4 md:mb-0">© 2025 PulseCheck. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="#" className="text-sm text-black/70 hover:text-black transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-sm text-black/70 hover:text-black transition-colors">Terms of Service</Link>
              <Link href="#" className="text-sm text-black/70 hover:text-black transition-colors">Cookies</Link>
              <Link href="#" className="text-sm text-black/70 hover:text-black transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
