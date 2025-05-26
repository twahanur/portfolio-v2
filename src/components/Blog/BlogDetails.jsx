/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Code2, Star, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDate } from "../common/dateFormater";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [suggestedBlogs, setSuggestedBlogs] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    const selectedBlog = storedBlogs.find((p) => String(p.id) === id);
    // Ensure selectedBlog exists and has a valid Keywords array
    if (selectedBlog && Array.isArray(selectedBlog.Keywords)) {
      const suggested = storedBlogs.filter(
        (blog) =>
          blog.id !== selectedBlog.id &&
          Array.isArray(blog.Keywords) &&
          blog.Keywords.some((keyword) =>
            selectedBlog.Keywords.includes(keyword)
          )
      );
      setSuggestedBlogs(suggested);
      console.log(suggested);
    } else {
      console.log("Selected blog not found or has no valid keywords.");
    }
    // console.log(storedBlogs);
    // console.log(id);
    // console.log(selectedBlog);

    if (selectedBlog) {
      const enhancedProject = {
        ...selectedBlog,
        Features: selectedBlog.Features || [],
        TechStack: selectedBlog.TechStack || [],
        Github: selectedBlog.Github || "https://github.com/Twahanur",
      };
      setBlog(enhancedProject);
    }
  }, [id]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-white">
            Loading blog...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] px-[2%] sm:px-0 relative overflow-hidden">
      {/* Background animations remain unchanged */}
      <div className="fixed inset-0">
        <div className="absolute -inset-[10px] opacity-20">
          <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12 animate-fadeIn">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-5 py-2 md:py-2.5 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-white/50">
              <span>BLogs</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-white/90 truncate">{blog.Title}</span>
            </div>
          </div>

          {/* <div className="grid lg:grid-cols-3 gap-8 md:gap-16"> */}
          <div className="flex flex-col md:flex-row items-start justify-between space-y-6 md:space-y-0 md:space-x-8">
            {/* Left Section with Title, Meta Info, and Description */}
            <div className="space-y-6 w-full md:w-2/3 md:space-y-10 animate-slideInLeft">
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                  {blog.Title}
                </h2>
                {/* Meta Info (can be expanded later) */}
                <div className="text-sm text-gray-400 mb-8">
                  <span>Published: {blog.PublishedAt || "Unknown Date"}</span>{" "}
                  &nbsp;&bull;&nbsp;
                  <span>Author: {blog.Author || "Admin"}</span>
                </div>
                <div className="relative h-1 w-full md:w-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm" />
                </div>
              </div>
              <div className="relative w-full h-32 md:h-64 rounded-2xl overflow-hidden">
                <img
                  src={blog.Image}
                  alt={blog.Title}
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

              <div className="prose prose-invert max-w-full">
                <span className="text-base md:text-lg text-gray-300/90 leading-relaxed">
                  <div className="dark:prose-invert prose-img:rounded-lg prose-code:text-sm prose-code:text-[#3CBFEE] prose-headings:text-green-500">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {blog.Description}
                    </ReactMarkdown>
                  </div>
                </span>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-white/90 mt-[3rem] md:mt-0 flex items-center gap-2 md:gap-3">
                  <Code2 className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  keywords
                </h3>
                {blog.Keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {blog.Keywords.map((tech, index) => (
                      //   <TechBadge key={index} tech={tech} />
                      <span key={index}>
                        <span className="bg-blue-500/10 text-blue-400 py-1 rounded-xl px-3 text-sm md:text-base">
                          #{tech}
                        </span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-gray-400 opacity-50">
                    No technologies added.
                  </p>
                )}
              </div>
            </div>

            {/* Right Section with Image and Features */}
            <div className="space-y-6 w-full md:w-1/3 md:space-y-10 animate-slideInRight">
              <div className="relative hidden md:block w-full h-64 md:h-96 rounded-2xl overflow-hidden">
                <img
                  src={blog.Image}
                  alt={blog.Title}
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
              <div>
                {suggestedBlogs.length > 0 && (
                  <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 space-y-6 hover:border-white/20 transition-colors duration-300 group">
                    <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                      <Star className="w-6 h-6 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
                      Suggested Blogs
                    </h3>

                    <ul className="grid gap-6">
                      {suggestedBlogs.map((blog) => (
                        <li
                          key={blog.id}
                          className="gap-4 bg-white/[0.05] p-4 rounded-xl hover:bg-white/[0.1] transition-colors duration-300"
                        >
                          <div className="flex flex-col justify-between flex-grow">
                            <div>
                              <h4 className="text-lg font-semibold text-white mb-1">
                                {blog.Title}
                              </h4>
                              <p className="text-sm text-white/60">
                                By {blog.Author} •{" "}
                                {formatDate(blog.PublishedAt)}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {blog.Keywords?.slice(0, 3).map((kw, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 text-xs bg-white/10 text-white rounded-full"
                                  >
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => navigate(`/blog/${blog.id}`)}
                              className="text-sm text-blue-400 mt-3 hover:underline self-start"
                            >
                              Read More →
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.7s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.7s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default BlogDetails;
