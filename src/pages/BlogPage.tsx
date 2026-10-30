import React, { useEffect } from 'react';
import { FileText, ArrowRight, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { BLOG_POSTS, EXAM_BODIES } from '../data/examBodies';
import { updatePageSeo } from '../utils/seo';

interface BlogPageProps {
  onNavigate: (path: string) => void;
  postSlug?: string;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, postSlug }) => {
  const currentPost = postSlug ? BLOG_POSTS.find((p) => p.slug === postSlug) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (currentPost) {
      updatePageSeo({
        title: `${currentPost.title} | Exam Guides`,
        description: currentPost.description,
        canonicalPath: `/blog/${currentPost.slug}`,
        structuredData: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Article',
              headline: currentPost.title,
              description: currentPost.description,
              image: ['https://image-compress.cloud/og-banner.png'],
              datePublished: '2026-10-29T10:00:00+05:30',
              dateModified: '2026-10-30T05:30:00+05:30',
              author: {
                '@type': 'Person',
                name: 'Sumit Dal',
                url: 'https://image-compress.cloud/about',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Image Compress Cloud',
                url: 'https://image-compress.cloud',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://image-compress.cloud/og-banner.png',
                },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://image-compress.cloud/blog/${currentPost.slug}`,
              },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://image-compress.cloud',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Blog',
                  item: 'https://image-compress.cloud/blog',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: currentPost.title,
                  item: `https://image-compress.cloud/blog/${currentPost.slug}`,
                },
              ],
            },
          ],
        },
      });
    } else {
      updatePageSeo({
        title: 'Exam Photo & Signature Guides 2026 - Image Compress Cloud',
        description: 'Read detailed guides on UPSC, SSC, IBPS, and State PSC photo, signature, and thumb impression requirements to avoid application form rejection.',
        canonicalPath: '/blog',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://image-compress.cloud',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Blog',
              item: 'https://image-compress.cloud/blog',
            },
          ],
        },
      });
    }
  }, [currentPost, postSlug]);

  if (currentPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-150">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <a
            href="/blog"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/blog');
            }}
            className="hover:text-stone-800 flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Guides
          </a>
          <span>/</span>
          <span className="text-stone-400">{currentPost.category}</span>
          <span>/</span>
          <span className="text-stone-800 font-semibold line-clamp-1">{currentPost.title}</span>
        </div>

        <article className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-3 border-b border-[#EAE3D6] pb-6">
            <div className="flex items-center gap-3 text-xs text-stone-500">
              <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold">
                {currentPost.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {currentPost.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {currentPost.date}
              </span>
            </div>

            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 leading-tight">
              {currentPost.title}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {currentPost.description}
            </p>
          </div>

          <div className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4">
            {currentPost.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="font-serif font-bold text-lg text-stone-900 pt-4">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter((l) => l.trim().startsWith('- '));
                return (
                  <ul key={index} className="list-disc pl-5 space-y-1.5 text-stone-700">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.match(/^\d\./)) {
                const items = paragraph.split('\n').filter((l) => l.trim().match(/^\d\./));
                return (
                  <ol key={index} className="list-decimal pl-5 space-y-1.5 text-stone-700">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item.replace(/^\d\.\s*/, '')}</li>
                    ))}
                  </ol>
                );
              }
              return <p key={index}>{paragraph}</p>;
            })}
          </div>

          {/* Embedded CTA to Launch Resizer */}
          <div className="bg-[#F4EFE6] border border-[#E3DACD] rounded-xl p-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-serif font-bold text-base text-stone-900">
                Ready to resize your photo & signature?
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Use our pre-calibrated tools to fit exact KB specifications in under 0.5 second.
              </p>
            </div>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="py-2.5 px-5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors whitespace-nowrap cursor-pointer inline-block"
            >
              Open Tool Now →
            </a>
          </div>
        </article>
      </div>
    );
  }

  // Blog Index Page
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-150">
      <div className="bg-[#FAF8F5] border border-[#E5DFD3] rounded-2xl p-6 sm:p-8 mb-10 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-amber-600" />
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Guides & Technical Specifications
          </span>
        </div>
        <h1 className="font-serif font-bold text-3xl text-stone-900">
          Indian Exam Photo & Signature Rules Blog
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl">
          Detailed explanations, official notification rules, and expert tips to guarantee your documents pass automated scrutiny on UPSC, SSC, IBPS, and State PSC servers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.id}
            className="bg-[#FAF8F5] border border-[#E6DFCD] hover:border-amber-600/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-3 text-xs text-stone-500 mb-2">
                <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold">
                  {post.category}
                </span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="font-serif font-bold text-xl text-stone-900 group-hover:text-amber-800 transition-colors leading-snug mb-2">
                {post.title}
              </h2>
              <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-6">
                {post.description}
              </p>
            </div>

            <a
              href={`/blog/${post.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/blog/${post.slug}`);
              }}
              className="text-xs font-semibold text-amber-800 group-hover:text-amber-900 flex items-center gap-1.5 transition-colors self-start cursor-pointer"
            >
              <span>Read Full Guide</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};
