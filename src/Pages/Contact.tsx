"use client";

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Share2, User, Mail, MessageSquare, Send, UploadCloud, FileText, Trash2, MessageCircle, MapPin } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import Komentar from "../components/Commentar";
import Swal from "sweetalert2";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("message");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
          title: "File Too Large",
          text: "Please select a file smaller than 10MB.",
          icon: "warning",
          confirmButtonColor: "#6366f1",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Swal.fire({
      title: "Sending Message...",
      html: "Please wait while we send your message",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const form = e.target;
      const formDataToSend = new FormData(form);
      if (selectedFile) {
        formDataToSend.set("attachment", selectedFile);
      }

      // AJAX form submission to FormSubmit.co
      const response = await fetch("https://formsubmit.co/ajax/405d8dc9b6485be63ea3015bd6dace05", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (result.success === "true" || result.success === true) {
        Swal.fire({
          title: "Success!",
          text: "Your message has been sent successfully!",
          icon: "success",
          confirmButtonColor: "#6366f1",
          timer: 2200,
          timerProgressBar: true,
        });

        // Reset form state
        setFormData({
          name: "",
          email: "",
          message: "",
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error) {
      console.error("AJAX submission error:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="text-center lg:mt-[5%] mt-10 mb-2 sm:px-0 px-[5%]">
        <h2
          data-aos="fade-down"
          data-aos-duration="1000"
          className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
        >
          <span
            style={{
              color: "#6366f1",
              backgroundImage:
                "linear-gradient(45deg, #6366f1 10%, #a855f7 93%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Contact & Guestbook
          </span>
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration="1100"
          className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2"
        >
          Get in touch directly or leave a public comment for the community.
        </p>
      </div>

      <div
        className="h-auto py-10 flex items-center justify-center px-[5%] md:px-0"
        id="Contact"
      >
        <div className="container px-[1%] grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Left Column: Let's Connect & SocialLinks */}
          <div className="flex flex-col gap-6 w-full lg:col-span-5" data-aos="fade-right" data-aos-duration="1200">
            {/* Let's Connect Card */}
            <div className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-3xl shadow-xl dark:shadow-2xl p-6 sm:p-8 transform transition-all duration-300 hover:shadow-[#6366f1]/10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                    Let's Connect
                  </h2>
                  <p className="text-slate-500 dark:text-gray-400 text-sm">
                    Have an exciting project, a job opportunity, or just want to chat? Reach out through any of these platforms!
                  </p>
                </div>
                <Share2 className="w-8 h-8 text-[#6366f1] opacity-50 animate-pulse flex-shrink-0" />
              </div>

              <div className="space-y-4">
                {/* Email Row */}
                <a 
                  href="mailto:twahanur.rahman@gmail.com" 
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-[#6366f1]/50 hover:bg-[#6366f1]/5 transition-all duration-300 group"
                >
                  <div className="p-3 rounded-lg bg-[#6366f1]/10 text-[#6366f1] group-hover:bg-[#6366f1]/20 group-hover:scale-110 transition-all duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-400 dark:text-gray-500 font-medium uppercase tracking-wider">Email Me</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">twahanur.rahman@gmail.com</p>
                  </div>
                </a>

                {/* WhatsApp Row */}
                <a 
                  href="https://wa.me/8801708902648" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300 group"
                >
                  <div className="p-3 rounded-lg bg-green-500/10 text-green-400 group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-400 dark:text-gray-500 font-medium uppercase tracking-wider">WhatsApp / Chat</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">+880 1708 902648</p>
                  </div>
                </a>

                {/* Location Row */}
                <div 
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-all duration-300"
                >
                  <div className="p-3 rounded-lg bg-[#a855f7]/10 text-[#a855f7]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-400 dark:text-gray-500 font-medium uppercase tracking-wider">Location</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links below */}
            <div className="w-full">
              <SocialLinks />
            </div>
          </div>

          {/* Right Column: Message/Guestbook Tabs Card */}
          <div className="lg:col-span-7 w-full h-full flex flex-col justify-start" data-aos="fade-left" data-aos-duration="1200">
            <div className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-3xl shadow-xl dark:shadow-2xl p-5 py-8 sm:p-10 transform transition-all duration-300 hover:shadow-[#6366f1]/10 flex flex-col h-full">
              {/* Tabs Selector */}
              <div className="flex border-b border-slate-200 dark:border-white/10 mb-8 pb-3">
                <button
                  onClick={() => setActiveTab("message")}
                  className={`flex items-center gap-2 pb-3 px-4 font-bold text-base md:text-lg border-b-2 transition-all duration-300 ${
                    activeTab === "message"
                      ? "border-[#6366f1] text-[#6366f1]"
                      : "border-transparent text-slate-400 hover:text-slate-300"
                  }`}
                >
                  <Mail className="w-4 h-4 md:w-5 md:h-5" />
                  Send Message
                </button>
                <button
                  onClick={() => setActiveTab("guestbook")}
                  className={`flex items-center gap-2 pb-3 px-4 font-bold text-base md:text-lg border-b-2 transition-all duration-300 ${
                    activeTab === "guestbook"
                      ? "border-[#6366f1] text-[#6366f1]"
                      : "border-transparent text-slate-400 hover:text-slate-300"
                  }`}
                >
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                  Guestbook
                </button>
              </div>

              {/* Tab Contents */}
              <div className="flex-grow">
                {activeTab === "message" ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* FormSubmit Configuration */}
                    <input type="hidden" name="_template" value="table" />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_next" value="/" />
                    <input type="hidden" name="_subject" value="New Submission" />
                    <input
                      type="hidden"
                      name="_autoresponse"
                      value="Assalamuoyaliacum, i got your message. i will get back to you as soon as possible. but if there any argency you can knock me on whatsapp: +8801708902648"
                    />

                    {/* Name Input */}
                    <div data-aos="fade-up" data-aos-delay="100" className="relative group">
                      <User className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-gray-400 group-focus-within:text-[#6366f1] group-focus-within:scale-110 transition-all duration-300" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full p-4 pl-12 bg-slate-100/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 placeholder-slate-400 dark:placeholder-gray-500 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1]/50 focus:bg-white/10 dark:focus:bg-white/10 transition-all duration-300 disabled:opacity-50"
                        required
                      />
                    </div>

                    {/* Email Input */}
                    <div data-aos="fade-up" data-aos-delay="200" className="relative group">
                      <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-gray-400 group-focus-within:text-[#6366f1] group-focus-within:scale-110 transition-all duration-300" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full p-4 pl-12 bg-slate-100/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 placeholder-slate-400 dark:placeholder-gray-500 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1]/50 focus:bg-white/10 dark:focus:bg-white/10 transition-all duration-300 disabled:opacity-50"
                        required
                      />
                    </div>

                    {/* Message Input */}
                    <div data-aos="fade-up" data-aos-delay="300" className="relative group">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-gray-400 group-focus-within:text-[#6366f1] group-focus-within:scale-110 transition-all duration-300" />
                      <textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full resize-none p-4 pl-12 bg-slate-100/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 placeholder-slate-400 dark:placeholder-gray-500 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1]/50 focus:bg-white/10 dark:focus:bg-white/10 transition-all duration-300 h-[8.5rem] disabled:opacity-50"
                        required
                      />
                    </div>

                    {/* Custom File Attachment */}
                    <div data-aos="fade-up" data-aos-delay="400" className="relative">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, .pdf, .doc, .docx"
                        className="hidden"
                      />
                      {!selectedFile ? (
                        <div
                          onClick={() => !isSubmitting && fileInputRef.current?.click()}
                          className={`group cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl hover:border-[#6366f1]/50 hover:bg-[#6366f1]/5 transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <UploadCloud className="w-7 h-7 text-slate-400 dark:text-gray-400 group-hover:text-[#6366f1] group-hover:scale-110 transition-all duration-300 mb-1.5" />
                          <span className="text-sm font-medium text-slate-600 dark:text-gray-300 group-hover:text-white transition-colors">
                            Add Attachment (Optional)
                          </span>
                          <span className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">
                            PDF, DOC, PNG, JPG (Max 10MB)
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-4 bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-xl">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-[#6366f1]/20 text-[#6366f1]">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium text-slate-800 dark:text-white truncate">
                                {selectedFile.name}
                              </span>
                              <span className="text-xs text-slate-400 dark:text-gray-400">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            disabled={isSubmitting}
                            className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-500 rounded-lg transition-all duration-200 disabled:opacity-50"
                            title="Remove file"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      data-aos="fade-up"
                      data-aos-delay="500"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white py-3.5 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6366f1]/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Send className="w-5 h-5" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                ) : (
                  <Komentar isTabbed={true} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;