import  { useEffect, useState } from "react";
import axios from "axios";

type ProblemMetaAccordionProps = {
  tags?: string[];
  companies?: string[]; // Now it's an array of strings
};

const fetchCompanyLogo = async (companyName: string) => {
  try {
    // Use Clearbit's logo API to fetch the company logo by domain
    const response = await axios.get(
      `https://logo.clearbit.com/${companyName.toLowerCase()}.com`
    );
    return response.request.responseURL; // The logo URL is in the response URL
  } catch (error) {
    return "/logos/default-logo.png"; // Default logo if the company logo is not found
  }
};

export default function ProblemMetaAccordion({ tags, companies }: ProblemMetaAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [logos, setLogos] = useState<{ [key: string]: string }>({}); // Store logos by company name

  useEffect(() => {
    // Fetch logos for each company on initial load
    if (companies && companies.length > 0) {
      companies.forEach(async (company) => {
        const logoUrl = await fetchCompanyLogo(company);
        setLogos((prevLogos) => ({
          ...prevLogos,
          [company]: logoUrl,
        }));
      });
    }
  }, [companies]);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const data = [
    {
      title: "🏷️ Tags",
      content: tags && tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-400/10 dark:text-orange-400"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-xs text-base-content/50 italic">No tags available</div>
      ),
    },
    {
      title: "🏢 Companies",
      content: companies && companies.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {companies.map((company, idx) => {
            const logoUrl = logos[company] || "/logos/default-logo.png"; // Fallback to default logo
            return (
              <div key={idx} className="flex items-center space-x-2">
                <span className="flex items-center space-x-1 px-3 py-1 rounded-full border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <img
                    src={logoUrl}
                    alt={`${company} logo`}
                    className="w-4 h-4 rounded-full object-contain"
                  />
                  <span className="text-xs text-base-content">{company}</span>
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-xs text-base-content/50 italic">No companies listed</div>
      ),
    },
  ];

  return (
    <div className="max-w-xl mx-auto p-2 space-y-2">
      {data.map((section, i) => (
        <div key={i} className="rounded-md bg-transparent border border-transparent">
          <button
            className="w-full flex justify-between items-center px-2 py-2 text-sm font-medium text-base-content hover:bg-base-200/50 rounded-md transition"
            onClick={() => toggle(i)}
            aria-expanded={openIndex === i}
            aria-controls={`meta-panel-${i}`}
          >
            <span>{section.title}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                openIndex === i ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === i && (
            <div
              id={`meta-panel-${i}`}
              className="px-2 pb-2 pt-1 text-sm text-base-content/80"
            >
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
