/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  FileText,
  Upload,
  Zap,
  Check,
  Copy,
  Download,
  Sparkles,
  AlertCircle,
  FileIcon as FileWord,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { generatePortfolio } from "@/actions/generate-portfolio"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
}

// Define a global type for the PDF.js library
declare global {
  interface Window {
    pdfjsLib: any
  }
}

export default function ResumeExtractor() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("")
  const [fileType, setFileType] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false)
  const [showFormatted, setShowFormatted] = useState(false)
  const [originalText, setOriginalText] = useState("")
  const [formattedData, setFormattedData] = useState<string>("")
  const [showExtractedSection, setShowExtractedSection] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
const router  = useRouter()
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        // First, try to load the main library
        const pdfJsScript = document.createElement("script")
        pdfJsScript.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        pdfJsScript.async = true

        // Create a promise that resolves when the script loads
        const pdfJsLoaded = new Promise<void>((resolve, reject) => {
          pdfJsScript.onload = () => resolve()
          pdfJsScript.onerror = () => reject(new Error("Failed to load PDF.js library"))
        })

        // Add the script to the document
        document.head.appendChild(pdfJsScript)

        // Wait for the script to load
        await pdfJsLoaded

        // Set the worker source
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
          setPdfJsLoaded(true)
          console.log("PDF.js library loaded successfully")
        }
      } catch (error) {
        console.error("Error loading PDF.js:", error)
        setError("Failed to load PDF processing library. Please refresh the page and try again.")
      }
    }

    loadPdfJs()
  }, [])

  const detectFileType = (file: File): string => {
    const extension = file.name.split(".").pop()?.toLowerCase() || ""

    if (file.type === "application/pdf" || extension === "pdf") {
      return "pdf"
    } else if (
      file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      extension === "doc" ||
      extension === "docx"
    ) {
      return "word"
    } else if (file.type === "text/plain" || extension === "txt") {
      return "text"
    } else {
      return "unknown"
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsUploading(true)
    setIsComplete(false)
    setError(null)
    setText("")
    setOriginalText("")
    setShowFormatted(false)
    setFormattedData("")
    setShowExtractedSection(false)

    try {
      const detectedType = detectFileType(file)
      setFileType(detectedType)

      if (detectedType === "pdf") {
        // For PDF files, check if PDF.js is loaded
        if (!pdfJsLoaded) {
          setIsUploading(false)
          setError(
            "PDF processing library is still initializing. Please wait a moment and try again, or refresh the page if this persists.",
          )
          return
        }

        const reader = new FileReader()
        reader.readAsArrayBuffer(file)

        reader.onload = async (e) => {
          setIsUploading(false)
          setIsExtracting(true)

          try {
            const result = e.target?.result
            if (!result || !(result instanceof ArrayBuffer)) {
              throw new Error("Invalid file data")
            }

            const pdfData = new Uint8Array(result)

            // Load the PDF document
            const loadingTask = window.pdfjsLib.getDocument({ data: pdfData })

            try {
              const pdf = await loadingTask.promise
              const numPages = pdf.numPages
              let extractedText = ""

              // Extract text from each page
              for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i)
                const textContent = await page.getTextContent()
                const pageText = textContent.items.map((item: { str: string }) => item.str).join(" ")
                extractedText += pageText + "\n\n"
              }

              if (extractedText.trim().length === 0) {
                setError("No readable text found in this PDF. It may be scanned or contain only images.")
                setIsExtracting(false)
                return
              }

              setText(extractedText)
              setOriginalText(extractedText)
              setShowFormatted(false)
              console.log("Extracted resume text:", extractedText)
              setIsExtracting(false)
              setIsComplete(true)
            } catch (error) {
              console.error("Error parsing PDF:", error)
              setError("This file appears to be corrupted or not a valid PDF. Please try another file.")
              setIsExtracting(false)
            }
          } catch (error) {
            console.error("Error extracting PDF text:", error)
            setError("Failed to extract text from PDF. Please try another file.")
            setIsExtracting(false)
          }
        }

        reader.onerror = (error) => {
          console.error("Error reading file:", error)
          setIsUploading(false)
          setError("Failed to read the file. Please try again.")
        }
      } else if (detectedType === "word") {
        setIsUploading(false)
        setError(
          "Word documents (.doc, .docx) cannot be processed directly in the browser. Please convert to PDF or plain text first.",
        )
      } else if (detectedType === "text") {
        // For text files, use simple text extraction
        const reader = new FileReader()
        reader.readAsText(file)

        reader.onload = (e) => {
          setIsUploading(false)
          setIsExtracting(true)

          try {
            const content = e.target?.result as string
            setText(content)
            setOriginalText(content)
            setShowFormatted(false)
            console.log("Extracted resume text:", content)

            setIsExtracting(false)
            setIsComplete(true)
          } catch (error) {
            console.error("Error extracting text:", error)
            setIsExtracting(false)
            setError("Failed to extract text. Please try another file format.")
          }
        }

        reader.onerror = (error) => {
          console.error("Error reading file:", error)
          setIsUploading(false)
          setError("Failed to read the file. Please try again.")
        }
      } else {
        setIsUploading(false)
        setError(`Unsupported file type. Please upload a PDF or text file.`)
      }
    } catch (error) {
      console.error("Error processing file:", error)
      setIsUploading(false)
      setError("Failed to process the file. Please try again.")
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      // Accept any file type
      const event = {
        target: {
          files: [file],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>

      handleFileUpload(event)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadText = () => {
    const element = document.createElement("a")
    const file = new Blob([text], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${fileName.replace(/\.[^/.]+$/, "")}_extracted.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Convert extracted text to dictionary format
  const convertToDictionaryFormat = (extractedText: string): string => {
    const lines = extractedText.split('\n').filter(line => line.trim())
    const dictionary: Record<string, any> = {
      personal_info: {
        name: '',
        email: '',
        phone: '',
        city: ''
      },
      educations: [],
      projects_experiences: [],
      achievements: [],
      interest_skills: [],
      website_links: []
    }

    // Email regex pattern
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
    // Phone regex pattern (supports various formats)
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{10}/g
    // URL regex pattern
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi
    // Location patterns
    const locationKeywords = ['location', 'address', 'city', 'state', 'country', 'based in', 'residing in']
    
    let currentSection = 'other'
    let foundPersonalInfo = false
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      const lowerLine = trimmedLine.toLowerCase()
      
      // Extract email
      const emailMatch = trimmedLine.match(emailRegex)
      if (emailMatch && !dictionary.personal_info.email) {
        dictionary.personal_info.email = emailMatch[0]
        foundPersonalInfo = true
      }
      
      // Extract phone
      const phoneMatch = trimmedLine.match(phoneRegex)
      if (phoneMatch && !dictionary.personal_info.phone) {
        dictionary.personal_info.phone = phoneMatch[0]
        foundPersonalInfo = true
      }
      
      // Extract URLs/website links
      const urlMatch = trimmedLine.match(urlRegex)
      if (urlMatch) {
        urlMatch.forEach(url => {
          const cleanUrl = url.trim()
          if (cleanUrl && !dictionary.website_links.includes(cleanUrl)) {
            dictionary.website_links.push(cleanUrl)
          }
        })
      }
      
      // Extract name (usually first line or line with "name" keyword)
      if ((index === 0 || lowerLine.includes('name')) && !dictionary.personal_info.name) {
        if (lowerLine.includes('name')) {
          const namePart = trimmedLine.split(':')[1]?.trim() || trimmedLine.replace(/name/gi, '').trim()
          if (namePart && namePart.length > 2 && !emailMatch && !phoneMatch) {
            dictionary.personal_info.name = namePart
            foundPersonalInfo = true
          }
        } else if (index === 0 && trimmedLine.length > 2 && !emailMatch && !phoneMatch && !urlMatch) {
          dictionary.personal_info.name = trimmedLine
          foundPersonalInfo = true
        }
      }
      
      // Extract city/location
      if (locationKeywords.some(keyword => lowerLine.includes(keyword)) && !dictionary.personal_info.city) {
        const locationPart = trimmedLine.split(':')[1]?.trim() || trimmedLine
        // Try to extract city name (simple heuristic)
        const cityMatch = locationPart.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/)
        if (cityMatch && locationPart.length > 2 && locationPart.length < 50) {
          dictionary.personal_info.city = locationPart
          foundPersonalInfo = true
        }
      }
      
      // Detect section headers
      if (lowerLine.includes('education') || lowerLine.includes('qualification') || lowerLine.includes('academic') || lowerLine.includes('degree')) {
        currentSection = 'education'
      } else if (lowerLine.includes('experience') || lowerLine.includes('work') || lowerLine.includes('employment') || lowerLine.includes('professional') || lowerLine.includes('project')) {
        currentSection = 'project_experience'
      } else if (lowerLine.includes('achievement') || lowerLine.includes('award') || lowerLine.includes('recognition') || lowerLine.includes('honor')) {
        currentSection = 'achievement'
      } else if (lowerLine.includes('skill') || lowerLine.includes('technical') || lowerLine.includes('competenc') || lowerLine.includes('interest') || lowerLine.includes('hobby')) {
        currentSection = 'skill_interest'
      } else if (trimmedLine && !emailMatch && !phoneMatch && !urlMatch) {
        // Add to current section if it's not already personal info
        if (currentSection !== 'other' || !foundPersonalInfo || index > 5) {
          if (currentSection === 'education') {
            if (!dictionary.educations.includes(trimmedLine)) {
              dictionary.educations.push(trimmedLine)
            }
          } else if (currentSection === 'project_experience') {
            if (!dictionary.projects_experiences.includes(trimmedLine)) {
              dictionary.projects_experiences.push(trimmedLine)
            }
          } else if (currentSection === 'achievement') {
            if (!dictionary.achievements.includes(trimmedLine)) {
              dictionary.achievements.push(trimmedLine)
            }
          } else if (currentSection === 'skill_interest') {
            if (!dictionary.interest_skills.includes(trimmedLine)) {
              dictionary.interest_skills.push(trimmedLine)
            }
          }
        }
      }
    })

    // Format output in the desired format
    let output = ''
    
    // Personal info section
    const hasPersonalInfo = dictionary.personal_info.name || dictionary.personal_info.email || 
                           dictionary.personal_info.phone || dictionary.personal_info.city
    if (hasPersonalInfo) {
      output += 'personal_info:\n\n'
      if (dictionary.personal_info.name) {
        output += `name = ${dictionary.personal_info.name}\n`
      }
      if (dictionary.personal_info.email) {
        output += `email = ${dictionary.personal_info.email}\n`
      }
      if (dictionary.personal_info.phone) {
        output += `phone = ${dictionary.personal_info.phone}\n`
      }
      if (dictionary.personal_info.city) {
        output += `city = ${dictionary.personal_info.city}\n`
      }
      output += '\n'
    }
    
    // Educations section
    if (dictionary.educations.length > 0) {
      output += 'educations:\n'
      dictionary.educations.forEach(edu => {
        output += `${edu}\n`
      })
      output += '\n'
    }
    
    // Projects/Experiences section
    if (dictionary.projects_experiences.length > 0) {
      output += 'projects/experiences:\n'
      dictionary.projects_experiences.forEach(proj => {
        output += `${proj}\n`
      })
      output += '\n'
    }
    
    // Achievements section
    if (dictionary.achievements.length > 0) {
      output += 'achievements:\n'
      dictionary.achievements.forEach(ach => {
        output += `${ach}\n`
      })
      output += '\n'
    }
    
    // Interest/Skills section
    if (dictionary.interest_skills.length > 0) {
      output += 'interest/skills:\n'
      dictionary.interest_skills.forEach(skill => {
        output += `${skill}\n`
      })
      output += '\n'
    }
    
    // Website links section
    if (dictionary.website_links.length > 0) {
      output += 'website links:\n'
      dictionary.website_links.forEach(link => {
        output += `${link}\n`
      })
      output += '\n'
    }

    return output.trim()
  }

  const showExtractedInfo = () => {
    if (!originalText) return
    
    const formattedText = convertToDictionaryFormat(originalText)
    setFormattedData(formattedText)
    setShowExtractedSection(true)
    
    // Scroll to the extracted info section
    setTimeout(() => {
      const element = document.getElementById('extracted-info-section')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
    
    toast.success("Formatted extracted information displayed!")
  }

  const downloadDictionaryFormat = () => {
    if (!originalText) return
    
    const dictText = convertToDictionaryFormat(originalText)
    const element = document.createElement("a")
    const file = new Blob([dictText], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${fileName.replace(/\.[^/.]+$/, "")}_resume_details.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success("Resume details downloaded as dictionary format!")
  }

  // Parse formatted data into structured sections
  const parseFormattedData = (data: string) => {
    const sections: Record<string, string[]> = {}
    const lines = data.split('\n')
    let currentSection = ''
    
    lines.forEach(line => {
      const trimmed = line.trim()
      if (!trimmed) return
      
      // Check if it's a section header
      if (trimmed.endsWith(':') && !trimmed.includes('=')) {
        currentSection = trimmed.replace(':', '').trim()
        sections[currentSection] = []
      } else if (currentSection && trimmed.includes('=')) {
        // Personal info fields
        const [key, ...valueParts] = trimmed.split('=')
        const value = valueParts.join('=').trim()
        if (value) {
          sections[currentSection].push(`${key.trim()} = ${value}`)
        }
      } else if (currentSection && trimmed) {
        // Regular content lines
        sections[currentSection].push(trimmed)
      }
    })
    
    return sections
  }

const handleGeneratePortfolio = async () => {
  try {
    setLoading(true)
    // Use original text for portfolio generation, not the formatted version
    const textToUse = originalText || text
    const res = await generatePortfolio(textToUse);
    console.log("response", res);

    if(res.success) {
      setLoading(false)
      toast.success("Portfolio Generated Successfully")
      localStorage.setItem("portfolioHTML", res.portfolio?.toString() || ""); // Store in localStorage with null check
      router.push("/customize"); // Navigate to portfolio page
    }
    else{
      toast.error("failed to genrate")
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Load PDF.js from CDN */}
      {/* Remove this Script component
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        onLoad={() => setPdfJsLoaded(true)}
        strategy="beforeInteractive"
      />
      */}

      {!pdfJsLoaded && (
        <div className="mb-4 w-full">
          <Alert variant="default" className="mb-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
              <AlertTitle>Loading PDF processor...</AlertTitle>
            </div>
            <AlertDescription>Please wait while we initialize the PDF processing library.</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Gradient background effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-[300px] -top-[300px] h-[600px] w-[600px] rounded-full bg-gradient-to-r from-violet-500/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-[300px] -right-[300px] h-[600px] w-[600px] rounded-full bg-gradient-to-r from-indigo-500/20 to-transparent blur-3xl" />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-screen flex-col px-4 py-12 sm:px-6">
        <motion.div className="flex flex-1 flex-col" variants={containerVariants} initial="hidden" animate="visible">
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="mx-auto mb-6 rounded-full border border-border bg-background/80 px-4 py-1.5 backdrop-blur"
          >
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <span className="text-muted-foreground">AI-powered portfolio generator</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20">
                <Sparkles className="h-3 w-3 text-violet-500" />
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="mb-6 text-center text-4xl font-extrabold tracking-tight md:text-5xl"
          >
            <span>Create your professional</span>
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent">
                portfolio website
              </span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 z-0 h-3 rounded-sm bg-gradient-to-r from-violet-500/40 to-indigo-600/40"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  delay: 1,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
              />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mb-8 max-w-2xl text-center text-xl text-muted-foreground"
          >
            Upload your resume and our AI will automatically generate a stunning portfolio website showcasing your
            skills, experience, and achievements.
          </motion.p>

          {/* Main content */}
          <motion.div variants={itemVariants} className="mx-auto mb-8 w-full max-w-5xl flex-1">
            <Tabs defaultValue="upload" className="w-full">
              {/* <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="upload">Upload Resume</TabsTrigger>
                <TabsTrigger value="extracted">Extracted Info</TabsTrigger>
              </TabsList> */}

              <TabsContent value="upload" className="mt-0">
                <div
                  className={`relative flex h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${isComplete ? "border-green-500/50 bg-green-500/5" : error ? "border-red-500/50 bg-red-500/5" : "border-border bg-background/50"}`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-4 h-16 w-16 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
                      <p className="text-lg font-medium">Uploading file...</p>
                    </div>
                  ) : isExtracting ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-4 h-16 w-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                      <p className="text-lg font-medium">Extracting information...</p>
                      <p className="mt-2 text-sm text-muted-foreground">This may take a moment for larger files</p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                        {fileType === "word" ? (
                          <FileWord className="h-8 w-8 text-red-500" />
                        ) : (
                          <AlertCircle className="h-8 w-8 text-red-500" />
                        )}
                      </div>
                      <p className="text-lg font-medium text-red-500">Error</p>
                      <p className="mt-2 text-sm text-muted-foreground max-w-md">{error}</p>
                      <Button variant="outline" onClick={triggerFileInput} className="mt-6 flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Try another file
                      </Button>
                    </div>
                  ) : isComplete ? (
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                        <Check className="h-8 w-8 text-green-500" />
                      </div>
                      <p className="text-lg font-medium">Resume information extracted!</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {fileName} • {text.length} characters extracted
                      </p>
                      <div className="mt-6 flex flex-col gap-4">
                        <Button
                          onClick={handleGeneratePortfolio}
                          className={`flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={loading || isExtracting}
                        >
                          {loading ? (
                          <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          ) : (
                          <Sparkles className="h-4 w-4" />
                          )}
                          {loading ? "Generating..." : "Generate My Portfolio"}
                        </Button>
                        <div className="flex gap-4">
                          <Button 
                            variant="outline" 
                            onClick={triggerFileInput} 
                            className="flex items-center gap-2"
                            disabled={isUploading || isExtracting || loading}
                          >
                            {isUploading || isExtracting ? (
                              <>
                                <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4" />
                                Upload another file
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={showExtractedInfo}
                            className="flex items-center gap-2"
                            variant="outline"
                            disabled={!text || isExtracting}
                          >
                            {isExtracting ? (
                              <>
                                <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                Extracting...
                              </>
                            ) : (
                              <>
                                <FileText className="h-4 w-4" />
                                Extracted Info
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20">
                        <FileText className="h-8 w-8 text-violet-500" />
                      </div>
                      <p className="text-lg font-medium">Drag & drop your resume here</p>
                      <p className="mt-2 text-sm text-muted-foreground">or click the button below to browse files</p>
                      <p className="mt-1 text-xs text-muted-foreground">Supported formats: PDF, TXT</p>
                      <Alert variant="default" className="mt-4 max-w-md">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Important Note</AlertTitle>
                        <AlertDescription>
                          Word documents (.doc, .docx) need to be converted to PDF or TXT before uploading.
                        </AlertDescription>
                      </Alert>
                      <Button
                        onClick={triggerFileInput}
                        className="mt-6 flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Resume
                      </Button>
                    </div>
                  )}
                </div>

                {/* Features list */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20">
                      <Zap className="h-4 w-4 text-violet-500" />
                    </div>
                    <h3 className="mb-1 font-medium">Instant Portfolio</h3>
                    <p className="text-sm text-muted-foreground">
                      Transform your resume into a professional portfolio website in minutes.
                    </p>
                  </div>

                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20">
                      <Sparkles className="h-4 w-4 text-violet-500" />
                    </div>
                    <h3 className="mb-1 font-medium">AI-Powered Design</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI creates a custom design that highlights your unique skills and experience.
                    </p>
                  </div>

                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20">
                      <Download className="h-4 w-4 text-violet-500" />
                    </div>
                    <h3 className="mb-1 font-medium">Easy Deployment</h3>
                    <p className="text-sm text-muted-foreground">
                      Deploy your portfolio with one click and share it with potential employers.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="extracted" className="mt-0">
                <div className="rounded-xl border bg-card p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-violet-500" />
                      <h3 className="font-medium">Extracted Information</h3>
                      {fileName && <span className="text-sm text-muted-foreground">from {fileName}</span>}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        disabled={!text || isExtracting}
                        className="flex items-center gap-1.5"
                      >
                        {isExtracting ? (
                          <>
                            <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                            Extracting...
                          </>
                        ) : copied ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={showExtractedInfo}
                        disabled={!text || isExtracting}
                        className="flex items-center gap-1.5"
                      >
                        {isExtracting ? (
                          <>
                            <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                            Extracting...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4" />
                            Extracted Info
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadDictionaryFormat}
                        disabled={!text || isExtracting}
                        className="flex items-center gap-1.5"
                      >
                        {isExtracting ? (
                          <>
                            <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                            Extracting...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="relative min-h-[400px] rounded-lg border bg-background/50">
                    {text ? (
                      <>
                        <div className="mb-2 flex items-center justify-between px-4 pt-4">
                          <div className="flex items-center gap-2">
                            {showFormatted && (
                              <span className="text-xs text-muted-foreground">Formatted View</span>
                            )}
                            {showFormatted && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setText(originalText)
                                  setShowFormatted(false)
                                }}
                                className="h-6 text-xs"
                              >
                                Show Raw Text
                              </Button>
                            )}
                          </div>
                        </div>
                        <Textarea
                          value={text}
                          onChange={(e) => {
                            setText(e.target.value)
                            if (!showFormatted) {
                              setOriginalText(e.target.value)
                            }
                          }}
                          readOnly={showFormatted}
                          className="min-h-[400px] resize-none font-mono text-sm"
                        />
                        {isComplete && (
                          <div className="mt-4 flex justify-center">
                            <Button
                              onClick={handleGeneratePortfolio}
                              className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white"
                              disabled={loading}
                            >
                              {loading ? (
                                <>
                                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4" />
                                  Generate My Portfolio
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex h-[400px] flex-col items-center justify-center p-4 text-center">
                        <FileText className="mb-2 h-8 w-8 text-muted-foreground/50" />
                        <p className="text-muted-foreground">Upload a resume to see extracted information here</p>
                        <Button
                          variant="link"
                          onClick={() => {
                            const uploadTab = document.querySelector('[data-value="upload"]') as HTMLElement | null;
                            uploadTab?.click();
                          }}
                          className="mt-2"
                        >
                          Go to upload
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Extracted Info Section */}
          {showExtractedSection && formattedData && (
            <motion.div
              id="extracted-info-section"
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 w-full"
            >
              <div className="rounded-xl border bg-card p-6 shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20">
                      <FileText className="h-5 w-5 text-violet-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Extracted Resume Information</h2>
                      <p className="text-sm text-muted-foreground">Formatted data from your resume</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowExtractedSection(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>

                <div className="space-y-6">
                  {Object.entries(parseFormattedData(formattedData)).map(([sectionName, items]) => {
                    if (items.length === 0) return null

                    return (
                      <div key={sectionName} className="rounded-lg border bg-background/50 p-4">
                        <h3 className="mb-3 text-lg font-semibold capitalize text-violet-500">
                          {sectionName.replace(/_/g, ' ')}
                        </h3>
                        <div className="space-y-2">
                          {items.map((item, index) => {
                            if (item.includes('=')) {
                              const [key, value] = item.split('=').map(s => s.trim())
                              return (
                                <div key={index} className="flex items-start gap-3 py-1">
                                  <span className="min-w-[100px] font-medium text-muted-foreground capitalize">
                                    {key}:
                                  </span>
                                  <span className="flex-1 text-foreground">{value}</span>
                                </div>
                              )
                            }
                            return (
                              <div key={index} className="py-1 text-foreground">
                                <span className="before:content-['•'] before:mr-2 before:text-violet-500">
                                  {item}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(formattedData)
                      toast.success("Copied to clipboard!")
                    }}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadDictionaryFormat}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-auto text-center text-sm text-muted-foreground">
            <p>
              Your resume is processed securely and never stored on our servers.
              <br />
              All information extraction happens directly in your browser.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

