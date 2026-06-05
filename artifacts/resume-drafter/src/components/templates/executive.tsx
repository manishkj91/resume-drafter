import { ParsedResume } from "@workspace/api-client-react";

export function ExecutiveTemplate({ data }: { data: ParsedResume }) {
  return (
    <div className="bg-white w-full max-w-[800px] min-h-[1056px] mx-auto text-slate-800 font-sans shadow-none">
      {/* Header Accent */}
      <div className="bg-slate-900 text-white p-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4 uppercase">{data.contact.name}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300 font-medium">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>{data.contact.phone}</span>}
          {data.contact.location && <span>{data.contact.location}</span>}
          {data.contact.linkedin && <span>{data.contact.linkedin}</span>}
          {data.contact.website && <span>{data.contact.website}</span>}
        </div>
      </div>

      <div className="p-10">
        {/* Summary */}
        {data.summary && (
          <div className="mb-8 pb-8 border-b-2 border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center">
              <span className="w-6 h-0.5 bg-slate-900 mr-3"></span>
              Executive Summary
            </h2>
            <p className="text-base leading-relaxed text-slate-700 font-medium">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.workExperience && data.workExperience.length > 0 && (
          <div className="mb-8 pb-8 border-b-2 border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center">
              <span className="w-6 h-0.5 bg-slate-900 mr-3"></span>
              Professional Experience
            </h2>
            <div className="space-y-8">
              {data.workExperience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-1">
                    <h3 className="font-bold text-slate-900 text-xl">{exp.title}</h3>
                    <span className="text-slate-500 font-medium text-sm">
                      {exp.startDate} — {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-700 font-bold uppercase tracking-wide text-sm">{exp.company}</span>
                    {exp.location && <span className="text-slate-500 text-sm">{exp.location}</span>}
                  </div>
                  <ul className="list-square list-inside space-y-2 text-slate-700 text-sm">
                    {exp.bullets?.map((bullet, j) => (
                      <li key={j} className="leading-relaxed flex items-start">
                        <span className="text-slate-400 mr-2 mt-1">■</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center">
                <span className="w-6 h-0.5 bg-slate-900 mr-3"></span>
                Education
              </h2>
              <div className="space-y-5">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-slate-900">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                    <div className="text-slate-700 font-medium text-sm mt-1">{edu.institution}</div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-slate-500 text-sm">{edu.graduationDate}</span>
                      {edu.gpa && <span className="text-slate-500 text-sm font-medium">GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center">
                  <span className="w-6 h-0.5 bg-slate-900 mr-3"></span>
                  Core Competencies
                </h2>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {data.skills.map((skill, i) => (
                    <div key={i} className="text-sm font-medium text-slate-700 flex items-center">
                      <span className="w-1.5 h-1.5 bg-slate-400 mr-2 rounded-full"></span>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center">
                  <span className="w-6 h-0.5 bg-slate-900 mr-3"></span>
                  Certifications
                </h2>
                <ul className="space-y-2">
                  {data.certifications.map((cert, i) => (
                    <li key={i} className="text-sm font-medium text-slate-700 flex items-start">
                      <span className="text-slate-400 mr-2 mt-1">■</span>
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
