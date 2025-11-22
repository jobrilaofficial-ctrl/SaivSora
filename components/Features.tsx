import React from 'react';
import { Copy, Check, Download } from 'lucide-react';

const Features: React.FC = () => {
  const steps = [
    {
      icon: <Copy className="w-6 h-6" />,
      title: "Copy the URL",
      desc: "Find the Sora video you want to download and copy its link from the address bar or share menu."
    },
    {
      icon: <Check className="w-6 h-6" />,
      title: "Paste the Link",
      desc: "Return to SaveSora and paste the copied link into the input field at the top of the page."
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Download MP4",
      desc: "Click the download button, choose your preferred quality (HD or 4K), and save the file."
    }
  ];

  return (
    <section className="bg-slate-900 py-24 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How to Use SaveSora</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Our tool is designed for simplicity. Follow these three easy steps to get your video in seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-500 to-slate-900 rounded-2xl opacity-0 group-hover:opacity-10 transition duration-300"></div>
              <div className="relative h-full bg-slate-950 border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors">
                <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;