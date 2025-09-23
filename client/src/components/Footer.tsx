import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Footer() {
  const supportEmail = "support@sparta-transport.com";
  const supportPhone = "+91-9876543210";

  return (
    <footer className="w-full border-t border-border bg-card mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                S<span className="text-primary">P</span>ARTA
              </h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Real-time public transport tracking for small cities across Punjab. 
              Making your daily commute smarter and more reliable.
            </p>
            <div className="text-xs text-muted-foreground">
              © 2024 Sparta Transport. All rights reserved.
            </div>
          </div>

          {/* Contact Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Customer Support</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email Support</p>
                  <a 
                    href={`mailto:${supportEmail}`}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                    data-testid="link-support-email"
                  >
                    {supportEmail}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Phone Support</p>
                  <a 
                    href={`tel:${supportPhone}`}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                    data-testid="link-support-phone"
                  >
                    {supportPhone}
                  </a>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  Support Hours: Mon-Sat, 9:00 AM - 7:00 PM IST
                </p>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Share Your Feedback</h4>
            <Card className="hover-elevate">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Help Us Improve</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your feedback helps us make Sparta better for everyone.
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => window.open(`mailto:${supportEmail}?subject=Feedback%20for%20Sparta%20Transport`, '_blank')}
                    data-testid="button-feedback-email"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Send Feedback
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => window.open(`tel:${supportPhone}`, '_blank')}
                    data-testid="button-feedback-call"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-muted-foreground text-center sm:text-left">
              Made with ❤️ for better public transport in Punjab
            </div>
            <div className="flex gap-4 text-xs">
              <button 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => console.log('Privacy policy clicked')}
              >
                Privacy Policy
              </button>
              <button 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => console.log('Terms of service clicked')}
              >
                Terms of Service
              </button>
              <button 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => console.log('Report issue clicked')}
              >
                Report Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}