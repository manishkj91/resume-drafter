import { ParsedResume } from "@workspace/api-client-react";

export function ClassicTemplate({ data }: { data: ParsedResume }) {
  return (
    <div className="bg-white p-8 sm:p-12 w-full max-w-[800px] min-h-[1056px] mx-auto text-black font-serif text-sm">
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-6 mb-6">
        <h1 className="text-4xl font-normal tracking-wide mb-2 uppercase">{data.contact.name}</h1>
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-sm font-sans text-gray-600">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>•</span>}
          {data.contact.phone && <span>{data.contact.phone}</span>}
          {data.contact.location && <span>•</span>}
          {data.contact.location && <span>{data.contact.location}</span>}
          {data.contact.linkedin && <span>•</span>}
          {data.contact.linkedin && <span>{data.contact.linkedin}</span>}
          {data.contact.website && <span>•</span>}
          {data.contact.website && <span>{data.contact.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-2 font-sans text-gray-800">Professional Summary</h2>
          <p className="leading-relaxed text-gray-800">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.workExperience && data.workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 font-sans text-gray-800 border-b border-gray-300 pb-1">Experience</h2>
          <div className="space-y-5">
            {data.workExperience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base font-sans">{exp.title}</h3>
                  <span className="text-gray-600 font-sans text-xs uppercase tracking-wide">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <div className="text-gray-800 italic">{exp.company}</div>
                  <div className="text-gray-600 font-sans text-xs">{exp.location}</div>
                </div>
                <ul className="list-disc list-inside space-y-1 pl-4 text-gray-800">
                  {exp.bullets?.map((bullet, j) => (
                    <li key={j} className="leading-relaxed pl-1">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 font-sans text-gray-800 border-b border-gray-300 pb-1">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-base font-sans">{edu.institution}</h3>
                  <span className="text-gray-600 font-sans text-xs uppercase tracking-wide">{edu.graduationDate}</span>
                </div>
                <div className="flex justify-between items-baseline mt-1 text-gray-800">
                  <div>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </div>
                  {edu.gpa && <div className="text-sm font-sans">GPA: {edu.gpa}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 font-sans text-gray-800 border-b border-gray-300 pb-1">Skills</h2>
          <p className="leading-relaxed text-gray-800">
            {data.skills.join(" • ")}
          </p>
        </div>
      )}
      
      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-3 font-sans text-gray-800 border-b border-gray-300 pb-1">Certifications</h2>
          <ul className="list-disc list-inside space-y-1 pl-4 text-gray-800">
            {data.certifications.map((cert, i) => (
              <li key={i} className="leading-relaxed pl-1">{cert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
