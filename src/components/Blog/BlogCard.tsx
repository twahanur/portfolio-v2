/* eslint-disable react/prop-types */
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { BookText } from 'lucide-react';
import { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

const BlogCard = ({ Img, Title, Description, id }: any) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { setPageTransitionLoading } = usePortfolio();

  const handleDetails = (e) => {
    if (!id) {
      e.preventDefault();
      alert("Project details are not available");
    } else {
      setPageTransitionLoading("blog");
    }
  };
  

  return (
    <div className="group relative w-full h-full flex flex-col">
            
      <div className="relative flex flex-col flex-grow overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-lg border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl transition-all duration-300 hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
    
        <div className="relative p-5 z-10 flex flex-col flex-grow">
          <div className="relative w-full h-44 md:h-64 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={Img}
                  alt={Title}
                  className={`w-full h-full object-cover rounded-2xl transition-opacity duration-500 ${
                    isImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setIsImageLoaded(true)}
                />
                {!isImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-2xl">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  </div>
                )}
              </div>
          
          <div className="mt-4 flex flex-col flex-grow justify-between">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-200 dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                {Title}
              </h3>
              
              <p className="text-slate-600 dark:text-gray-300/80 text-sm leading-relaxed line-clamp-2">
                {Description}
              </p>
            </div>
            
            <div className="pt-4 flex items-center justify-between">

              {id ? (
                <Link
                  href={`/blog/${id}`}
                  onClick={handleDetails}
                  aria-label={`Read full article: ${Title}`}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white/90 border border-slate-200 dark:border-white/10 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <span className="text-sm font-medium">Read More</span>
                  <span className="sr-only"> about {Title}</span>
                  <BookText className="w-4 h-4" aria-hidden="true" />
                </Link>
              ) : (
                <span className="text-slate-500 dark:text-gray-500 text-sm">Details Not Available</span>
              )}
            </div>
          </div>
          
          <div className="absolute inset-0 border border-white/0 group-hover:border-purple-500/50 rounded-xl transition-colors duration-300 -z-50"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;