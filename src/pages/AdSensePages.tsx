import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  FileText, 
  HelpCircle, 
  Send, 
  CheckCircle, 
  ArrowLeft,
  Download,
  Copy,
  ExternalLink,
  Code
} from 'lucide-react';
import { updatePageSeo } from '../utils/seo';
import { EXAM_BODIES, BLOG_POSTS } from '../data/examBodies';
import { DEDICATED_TOOLS } from '../data/dedicatedTools';
import { generateXmlSitemap, getAllSitemapEntries } from '../utils/sitemapGenerator';

interface AdSensePageProps {
  pageType: 'about' | 'privacy' | 'terms' | 'contact' | 'disclaimer' | 'cookie' | 'sitemap' | 'xml-sitemap';
  onNavigate: (path: string) => void;
}

export const AdSensePages: React.FC<AdSensePageProps> = ({ pageType, onNavigate }) => {
  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [copiedXml, setCopiedXml] = useState(false);
  const [sitemapTab, setSitemapTab] = useState<'html' | 'xml'>(pageType === 'xml-sitemap' ? 'xml' : 'html');

  // Helper for crawlable SPA links inside AdSensePages.tsx
  const SeoLink = ({ to, children, className = 'hover:underline' }: { to: string; children: React.ReactNode; className?: string }) => (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(to);
      }}
      className={className}
    >
      {children}
    </a>
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    const titles = {
      about: 'About Us - Image Compress Cloud',
      privacy: 'Privacy Policy - Image Compress Cloud',
      terms: 'Terms of Service - Image Compress Cloud',
      contact: 'Contact Us - Image Compress Cloud',
      disclaimer: 'Disclaimer & Examination Notice - Image Compress Cloud',
      cookie: 'Cookie Policy - Image Compress Cloud',
      sitemap: 'HTML & XML Sitemap Index - Image Compress Cloud',
      'xml-sitemap': 'XML Sitemap (sitemap.xml) - Google Search Console Friendly',
    };
    const descriptions = {
      about: 'Learn about Image Compress Cloud: India’s fastest client-side photo, signature, and thumb impression compressor for government exam applicants.',
      privacy: 'Privacy policy for image-compress.cloud with verified contact details (Odisha, India, Mob: 7789090050, Email: sumitdal125@gmail.com). Zero server uploads.',
      terms: 'Read the terms of service and usage conditions for using Image Compress Cloud tools.',
      contact: 'Contact Sumit Dal and Image Compress Cloud team in Odisha, India. Phone: 7789090050, Email: sumitdal125@gmail.com.',
      disclaimer: 'Official legal disclaimer regarding government recruitment agencies and accuracy of photo dimensions.',
      cookie: 'Information on how Image Compress Cloud and third-party advertising partners use cookies.',
      sitemap: 'Full indexable HTML and XML sitemap with all central and state examination photo & signature tools.',
      'xml-sitemap': 'Google Search Console friendly XML sitemap containing all URLs, priorities, and change frequencies.',
    };

    updatePageSeo({
      title: titles[pageType],
      description: descriptions[pageType],
      canonicalPath: `/${pageType === 'privacy' ? 'privacy-policy' : pageType === 'terms' ? 'terms-of-service' : pageType === 'cookie' ? 'cookie-policy' : pageType === 'xml-sitemap' ? 'sitemap.xml' : pageType}`,
    });
  }, [pageType]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    const subject = encodeURIComponent(`Image Compress Cloud Inquiry from ${contactForm.name}`);
    const body = encodeURIComponent(
      `Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\nMessage:\n${contactForm.message}`
    );
    window.location.href = `mailto:sumitdal125@gmail.com?subject=${subject}&body=${body}`;
  };

  const xmlContent = generateXmlSitemap();
  const sitemapEntries = getAllSitemapEntries();

  const handleDownloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-150">
      <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="hover:text-stone-800 flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Home
        </a>
        <span>/</span>
        <span className="text-stone-800 font-semibold capitalize">
          {pageType === 'xml-sitemap' ? 'sitemap.xml' : pageType}
        </span>
      </div>

      <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-6 sm:p-10 shadow-sm leading-relaxed text-stone-800 space-y-6">
        {pageType === 'about' && (
          <article className="space-y-5">
            <h1 className="font-serif font-bold text-3xl text-stone-900">About Image Compress Cloud</h1>
            <p className="text-base text-stone-600">
              Welcome to <strong>Image Compress Cloud</strong> (<a href="https://image-compress.cloud" className="text-amber-800 underline">https://image-compress.cloud</a>), a dedicated, high-speed image optimization platform engineered specifically for students and aspirants preparing for competitive examinations across India.
            </p>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-3">Website Ownership & Development</h2>
            <div className="bg-[#F5EFE6] border border-[#E2DAD0] rounded-xl p-5 text-sm space-y-2">
              <p><strong>Founder & Lead Developer:</strong> Sumit Dal</p>
              <p><strong>Address:</strong> Odisha, India</p>
              <p><strong>Contact Mobile / WhatsApp:</strong> +91 7789090050</p>
              <p><strong>Official Inquiries:</strong> <a href="mailto:sumitdal125@gmail.com" className="text-amber-800 underline">sumitdal125@gmail.com</a></p>
            </div>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-3">Our Mission</h2>
            <p className="text-sm text-stone-700">
              Every recruitment cycle, hundreds of thousands of candidates face rejection or form submission errors simply because their passport photographs, signatures, or thumb impressions exceed strict portal limits (e.g., 20 KB to 50 KB, 10 KB to 20 KB, or exact 200x230 pixel dimensions). Traditional desktop software like Photoshop or MS Paint is inaccessible to many candidates operating from mobile phones, and generic cloud compressors often upload sensitive biometrics to remote servers or reduce images until they become blurry and unreadable.
            </p>
            <p className="text-sm text-stone-700">
              Our mission is to eliminate portal rejection anxiety with an instant, 100% private, zero-upload tool that pre-calibrates the exact requirements of every central and state exam body in India.
            </p>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-3">Why 0.5-Second Load & Client-Side Execution?</h2>
            <p className="text-sm text-stone-700">
              Unlike traditional websites that upload your image to a backend server, queue it, compress it via Python/Node, and send it back, <strong>Image Compress Cloud runs 100% inside your browser</strong> using the HTML5 Offscreen Canvas API and binary-search quantization. This delivers three distinct benefits:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-2 text-stone-700">
              <li><strong>Blazing Speed:</strong> Processing takes less than 50 milliseconds directly on your CPU/GPU.</li>
              <li><strong>Complete Privacy:</strong> Your personal photo, signature, and biometrics never leave your device.</li>
              <li><strong>Zero Data Usage:</strong> No megabytes wasted uploading and downloading high-resolution camera photos over slow mobile connections.</li>
            </ul>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-3">Coverage of All Indian States</h2>
            <p className="text-sm text-stone-700">
              From National bodies (UPSC, SSC, IBPS, SBI, NTA, RRB) to State Public Service Commissions across Uttar Pradesh, Bihar, Rajasthan, Madhya Pradesh, Maharashtra, West Bengal, Tamil Nadu, Karnataka, Gujarat, Kerala, Odisha, and beyond, our team constantly tracks official recruitment gazettes to update dimensional limits, DPI markers, and date-stamp guidelines.
            </p>
          </article>
        )}

        {pageType === 'privacy' && (
          <article className="space-y-5">
            <h1 className="font-serif font-bold text-3xl text-stone-900">Privacy Policy</h1>
            <p className="text-xs text-stone-500">Last updated: October 29, 2026</p>

            <p className="text-sm text-stone-700">
              At <strong>image-compress.cloud</strong>, candidate privacy is our utmost priority. This Privacy Policy outlines how your personal data is handled when you access and use our website.
            </p>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-2">1. Client-Side Image Processing (Zero Server Uploads)</h2>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-950 text-sm">
              <strong className="flex items-center gap-1.5 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Guaranteed Local Execution
              </strong>
              Any image, photograph, signature, or left thumb impression you select or drop into our tool is processed exclusively within your device’s local browser memory (RAM) via HTML5 Canvas. We do not transmit, collect, preview, store, or log any candidate images on our servers.
            </div>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-2">2. Information We Do Not Collect</h2>
            <p className="text-sm text-stone-700">
              We do not ask for registration, login, phone numbers, Aadhaar numbers, or exam roll numbers. You can freely use all tools without creating an account.
            </p>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-2">3. Google AdSense & Third-Party Advertising</h2>
            <p className="text-sm text-stone-700">
              We may partner with third-party advertising vendors, including Google AdSense, to display ads when you visit our website. These vendors use cookies (including the DoubleClick DART cookie) to serve ads based on your prior visits to this or other websites on the Internet.
            </p>
            <p className="text-sm text-stone-700">
              Users may opt out of personalized advertising by visiting Google Ad Settings (<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline text-amber-800">https://www.google.com/settings/ads</a>) or opt out of third-party vendor use of cookies by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="underline text-amber-800">www.aboutads.info</a>.
            </p>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-2">4. Standard Log Files</h2>
            <p className="text-sm text-stone-700">
              Like most standard websites, image-compress.cloud makes use of basic hosting log files. These files merely log visitors to the site (IP addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages). This information is not linked to any personally identifiable information and is used solely for analyzing traffic trends and maintaining server uptime.
            </p>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-2">5. Data Protection Officer & Grievance Contact</h2>
            <div className="bg-[#F5EFE6] border border-[#E2DAD0] rounded-xl p-5 text-sm space-y-2">
              <p>In accordance with the Information Technology Act 2000 and the Digital Personal Data Protection (DPDP) Act of India, the contact details of the Grievance Officer and Website Administrator are provided below:</p>
              <ul className="space-y-1 pt-1 font-medium text-stone-800">
                <li className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-700" />
                  <span><strong>Officer Name:</strong> Sumit Dal</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span><strong>Physical Address:</strong> Odisha, India</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-700" />
                  <span><strong>Mobile / Telephone:</strong> +91 7789090050</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-700" />
                  <span><strong>Email Address:</strong> <a href="mailto:sumitdal125@gmail.com" className="underline text-amber-800">sumitdal125@gmail.com</a></span>
                </li>
              </ul>
            </div>
          </article>
        )}

        {pageType === 'terms' && (
          <article className="space-y-5">
            <h1 className="font-serif font-bold text-3xl text-stone-900">Terms of Service</h1>
            <p className="text-xs text-stone-500">Effective Date: October 29, 2026</p>

            <p className="text-sm text-stone-700">
              By accessing and using <strong>image-compress.cloud</strong>, you agree to comply with and be bound by the following terms and conditions of use.
            </p>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-2">1. Permitted Use</h2>
            <p className="text-sm text-stone-700">
              Image Compress Cloud provides free, client-side digital utility tools for individuals preparing digital documents for educational, recruitment, and admission portals. You agree to use the service only for lawful purposes.
            </p>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-2">2. Accuracy & Candidate Responsibility</h2>
            <p className="text-sm text-stone-700">
              While we make every effort to ensure the pre-set KB bounds, aspect ratios, and dimension guidelines align with the latest published government examination notices, recruiting commissions periodically alter their software configurations without advance notice. <strong>Candidates are solely responsible for verifying their final generated files against their official exam notification before submitting.</strong>
            </p>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-2">3. Intellectual Property</h2>
            <p className="text-sm text-stone-700">
              All website source code, algorithms, visual designs, brand assets, and editorial guides are the intellectual property of image-compress.cloud. All examination names and agency acronyms (e.g., UPSC, SSC, IBPS, NTA) are the trademarks of their respective authorities.
            </p>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-2">4. Contact & Inquiries</h2>
            <p className="text-sm text-stone-700">
              For any questions regarding these Terms, contact Sumit Dal (Odisha, India, Mob: 7789090050, Email: sumitdal125@gmail.com).
            </p>
          </article>
        )}

        {pageType === 'disclaimer' && (
          <article className="space-y-5">
            <h1 className="font-serif font-bold text-3xl text-stone-900">Government Examination Disclaimer</h1>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-950 text-sm">
              <strong className="block font-semibold mb-1">Non-Affiliation Notice</strong>
              <strong>image-compress.cloud</strong> is an independent digital tool and web service operated by Sumit Dal (Odisha, India). We are NOT associated, affiliated, authorized, endorsed by, or in any way officially connected with the Union Public Service Commission (UPSC), Staff Selection Commission (SSC), National Testing Agency (NTA), Institute of Banking Personnel Selection (IBPS), State Bank of India (SBI), Railway Recruitment Control Board (RRB), Central Board of Secondary Education (CBSE), or any Central Government or State Government department, ministry, or commission.
            </div>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-2">Trademarks & Reference Names</h2>
            <p className="text-sm text-stone-700">
              All acronyms, trademarks, agency logos, and examination names (such as UPSC CSE, SSC CGL, NEET UG, JEE Main, IBPS PO, UPPSC, BPSC, RPSC, etc.) displayed on this website are registered trademarks of their respective government and statutory bodies. Their usage on this platform is purely nominative and educational, intended to help applicants match their files to published technical requirements.
            </p>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-2">Official Portal Notification Rule</h2>
            <p className="text-sm text-stone-700">
              Exam notifications and online application guidelines can change from year to year. While our database is continuously updated, applicants must always refer to the official advertisement/information bulletin published on the official recruiting agency website for authoritative instructions.
            </p>
          </article>
        )}

        {pageType === 'cookie' && (
          <article className="space-y-5">
            <h1 className="font-serif font-bold text-3xl text-stone-900">Cookie Policy</h1>
            <p className="text-sm text-stone-700">
              This Cookie Policy explains what cookies are, how image-compress.cloud uses them, and your choices regarding cookies.
            </p>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-2">What Are Cookies?</h2>
            <p className="text-sm text-stone-700">
              Cookies are small text files placed on your device to store data that can be recalled by a web server. We prioritize a lightweight experience and do not use heavy tracking cookies.
            </p>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-2">Types of Cookies We Use</h2>
            <ul className="list-disc pl-5 text-sm space-y-2 text-stone-700">
              <li><strong>Essential / Functional Local Storage:</strong> Used to temporarily remember your preferred settings (such as Candidate Name or Date of Photo) across tools during your session.</li>
              <li><strong>Advertising Cookies (Google AdSense):</strong> Third-party advertising cookies help serve relevant advertisements and cap the frequency with which an ad is shown to you.</li>
            </ul>

            <h2 className="font-serif font-bold text-xl text-stone-900 pt-2">Managing Cookies</h2>
            <p className="text-sm text-stone-700">
              You can control or disable cookies via your browser settings. Please note that disabling cookies will not affect the core image resizing or compression algorithms.
            </p>
          </article>
        )}

        {pageType === 'contact' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-serif font-bold text-3xl text-stone-900">Contact Us</h1>
              <p className="text-sm text-stone-600 mt-1">
                Have a question, feedback, or noticed a change in an exam portal specification? We would love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4">
                <div className="bg-[#F5EFE6] border border-[#E2DAD0] rounded-xl p-5 space-y-3">
                  <h3 className="font-semibold text-stone-900 text-sm border-b border-[#E7DFD3] pb-2">
                    Official Contact Information
                  </h3>
                  <div className="space-y-2.5 text-xs text-stone-700">
                    <div className="flex items-start gap-2.5">
                      <User className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Site Administrator:</strong> Sumit Dal
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Address:</strong> Odisha, India
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Mobile / WhatsApp:</strong> +91 7789090050 (7789090050)
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Official Email:</strong>{' '}
                        <a href="mailto:sumitdal125@gmail.com" className="underline font-semibold text-amber-800">
                          sumitdal125@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900">
                  <strong>Fast Support Response:</strong> We review candidate queries, state portal requirement updates, and technical feedback daily.
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white border border-[#DDD5C7] rounded-xl p-5 shadow-sm">
                {contactSent ? (
                  <div className="text-center py-8 space-y-2">
                    <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h3 className="font-serif font-bold text-lg text-stone-900">Message Received!</h3>
                    <p className="text-xs text-stone-600">
                      Thank you for contacting Sumit Dal and Image Compress Cloud team. We will respond to your email at {contactForm.email} shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Priyanshu Sharma"
                        className="w-full text-xs bg-[#FAF8F5] border border-[#DDD5C7] rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="you@gmail.com"
                        className="w-full text-xs bg-[#FAF8F5] border border-[#DDD5C7] rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">Message or Portal Feedback</label>
                      <textarea
                        required
                        rows={3}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Describe the issue or suggest an exam body..."
                        className="w-full text-xs bg-[#FAF8F5] border border-[#DDD5C7] rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {(pageType === 'sitemap' || pageType === 'xml-sitemap') && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DFD3] pb-5">
              <div>
                <h1 className="font-serif font-bold text-3xl text-stone-900">
                  {sitemapTab === 'xml' ? 'XML Sitemap (sitemap.xml)' : 'Complete Website Sitemap'}
                </h1>
                <p className="text-sm text-stone-600 mt-1">
                  Google Search Console & crawler index for all {sitemapEntries.length} tools and pages on <strong>https://image-compress.cloud</strong>.
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-2 bg-[#F2ECE1] p-1 rounded-xl border border-[#DDD5C7] self-start sm:self-auto">
                <button
                  onClick={() => setSitemapTab('html')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    sitemapTab === 'html' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  HTML Index
                </button>
                <button
                  onClick={() => setSitemapTab('xml')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    sitemapTab === 'xml' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  XML Sitemap
                </button>
              </div>
            </div>

            {sitemapTab === 'xml' ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F4EFE6] p-4 rounded-xl border border-[#E0D7C9]">
                  <div className="text-xs text-stone-700">
                    <strong>Standard XML Protocol 0.9:</strong> Ready for Google Search Console, Bing Webmaster, and Yandex verification.
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyXml}
                      className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-800 border border-[#DDD5C7] rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-stone-600" />
                      {copiedXml ? 'Copied XML!' : 'Copy XML'}
                    </button>
                    <button
                      onClick={handleDownloadXml}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download sitemap.xml
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <pre className="bg-[#1C1917] text-[#E7E5E4] p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[500px] leading-relaxed border border-stone-800">
                    {xmlContent}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <h3 className="font-semibold text-sm text-stone-900 uppercase tracking-wider mb-3">
                    Universal Image Tools
                  </h3>
                  <ul className="space-y-2 text-xs text-amber-900">
                    <li>
                      <SeoLink to="/">
                        Home - Indian Exam Photo & Signature Resizer
                      </SeoLink>
                    </li>
                    <li>
                      <SeoLink to="/tools/photo-compressor">
                        Universal Photo Resizer in KB & Pixels
                      </SeoLink>
                    </li>
                    <li>
                      <SeoLink to="/tools/signature-resize">
                        Signature Resizer (10KB - 20KB) & Ink Enhancer
                      </SeoLink>
                    </li>
                    <li>
                      <SeoLink to="/tools/thumb-impression">
                        Left Thumb Impression (LTI) Cleaner & Resizer
                      </SeoLink>
                    </li>
                    <li>
                      <SeoLink to="/tools/name-date-on-photo">
                        Add Name & Date of Photo (DOP) Stamp Generator
                      </SeoLink>
                    </li>
                  </ul>

                  <h3 className="font-semibold text-sm text-stone-900 uppercase tracking-wider mt-6 mb-3">
                    Dedicated Exam Tools ({DEDICATED_TOOLS.length} Individual Tools)
                  </h3>
                  <ul className="space-y-2 text-xs text-stone-700 max-h-[350px] overflow-y-auto pr-2">
                    {DEDICATED_TOOLS.map((tool) => (
                      <li key={tool.id} className="flex items-center justify-between">
                        <SeoLink
                          to={`/tool/${tool.slug}`}
                          className="hover:underline text-amber-900 text-left font-medium"
                        >
                          {tool.title}
                        </SeoLink>
                        <span className="text-[10px] text-stone-400">{tool.badge}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-stone-900 uppercase tracking-wider mb-3">
                    Exam Hubs & Hub Directories ({EXAM_BODIES.length} Boards)
                  </h3>
                  <ul className="space-y-2 text-xs text-stone-700 max-h-[300px] overflow-y-auto pr-2">
                    {EXAM_BODIES.map((exam) => (
                      <li key={exam.id} className="flex items-center justify-between">
                        <SeoLink
                          to={`/exam/${exam.slug}`}
                          className="hover:underline text-amber-900 text-left font-medium"
                        >
                          {exam.name}
                        </SeoLink>
                        <span className="text-[10px] text-stone-400">{exam.state}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="font-semibold text-sm text-stone-900 uppercase tracking-wider mt-6 mb-3">
                    Informative Guides & Blog
                  </h3>
                  <ul className="space-y-2 text-xs text-amber-900">
                    {BLOG_POSTS.map((post) => (
                      <li key={post.id}>
                        <SeoLink to={`/blog/${post.slug}`} className="hover:underline text-left">
                          {post.title}
                        </SeoLink>
                      </li>
                    ))}
                  </ul>

                  <h3 className="font-semibold text-sm text-stone-900 uppercase tracking-wider mt-6 mb-3">
                    AdSense & Mandatory Policies
                  </h3>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    <li><SeoLink to="/about">About Us</SeoLink></li>
                    <li><SeoLink to="/privacy-policy">Privacy Policy (Odisha, India)</SeoLink></li>
                    <li><SeoLink to="/terms-of-service">Terms & Conditions</SeoLink></li>
                    <li><SeoLink to="/contact">Contact Us (7789090050)</SeoLink></li>
                    <li><SeoLink to="/disclaimer">Government Disclaimer</SeoLink></li>
                    <li><SeoLink to="/cookie-policy">Cookie Policy</SeoLink></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
