'use client'
import { getPortfolio } from "@/actions/get-portfolio";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Code, Copy, Check } from "lucide-react";

function cleanHtmlString(input: string): string {
  return input
    .replace(/```html\s*/g, "")  // removes ```html with optional whitespace
    .replace(/```/g, "");        // removes any remaining ```
}

const PortfolioPage =  () => {
const [portfolioHTML, setPortfolioHTML] = useState<string | null>(null);
const [loading, setLoading] = useState<boolean>(true);
const [showCodeDialog, setShowCodeDialog] = useState<boolean>(false);
const [copied, setCopied] = useState<boolean>(false);
const router = useRouter();

  useEffect(() => {
    setLoading(true)
    const fetchProjects = async () => {
      try {
        const response = await getPortfolio();
        console.log(response)
        if (response.success && response.portfolioHTML) {
          const cleanedHTML = cleanHtmlString(response.portfolioHTML);
          setPortfolioHTML(cleanedHTML);
          toast.success('Portfolio fetched successfully')
        } else {
          router.push('/generate-portfolio')
          toast.error('Failed to fetch portfolio')
        }
      } catch (err) {
        console.error('Error fetching projects:', err)
        toast.error('An error occurred while fetching projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const copyCodeToClipboard = () => {
    if (!portfolioHTML) return;
    navigator.clipboard.writeText(portfolioHTML).then(() => {
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('Failed to copy code');
    });
  };

  return (
    <div className="p-5">
      {portfolioHTML && !loading ? (
        <>
          <div className="mb-4 flex justify-end">
            <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                  <Code className="mr-2 h-4 w-4" />
                  View Code
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>Portfolio HTML Code</DialogTitle>
                  <DialogDescription>
                    Copy this code to use in your local application. Save it as an HTML file and open it in your browser.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-auto relative">
                  <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
                    <code>{portfolioHTML}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyCodeToClipboard}
                    className="absolute top-4 right-4 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div dangerouslySetInnerHTML={{ __html: portfolioHTML }} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PortfolioPage;
