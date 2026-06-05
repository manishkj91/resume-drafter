import { ParsedResume } from "@workspace/api-client-react";

export function ModernTemplate({ data }: { data: ParsedResume }) {
  return (
    <div className="bg-white p-0 w-full max-w-[800px] min-h-[1056px] mx-auto text-gray-800 font-sans flex flex-col relative overflow-hidden">
      {/* Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-4 bg-teal-600"></div>
      
      <div className="p-8 sm:p-12 pt-12 flex-grow">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-3">{data.contact.name}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-teal-700 font-medium">
            {data.contact.email && <span>{data.contact.email}</span>}
            {data.contact.phone && <span>{data.contact.phone}</span>}
            {data.contact.location && <span>{data.contact.location}</span>}
            {data.contact.linkedin && <span>{data.contact.linkedin}</span>}
            {data.contact.website && <span>{data.contact.website}</span>}
          </div>
        </div>

        {/* Summary */}
        {data.summary && (
          <div className="mb-8">
            <p className="text-base leading-relaxed text-gray-700">{data.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Experience */}
            {data.workExperience && data.workExperience.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-teal-700 uppercase tracking-wide mb-4">Experience</h2>
                <div className="space-y-6">
                  {data.workExperience.map((exp, i) => (
                    <div key={i} className="relative pl-4 border-l-2 border-teal-200">
                      <div className="absolute w-2 h-2 bg-teal-600 rounded-full -left-[5px] top-2"></div>
                      <h3 className="font-semibold text-gray-900 text-lg">{exp.title}</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-teal-600 font-medium">{exp.company}</span>
                        <span className="text-gray-500 text-sm">{exp.startDate} - {exp.endDate || 'Present'}</span>
                      </div>
                      {exp.location && <div className="text-gray-500 text-sm mb-2">{exp.location}</div>}
                      <ul className="list-disc list-outside ml-4 space-y-1 text-gray-700 text-sm">
                        {exp.bullets?.map((bullet, j) => (
                          <li key={j} className="leading-relaxed">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-teal-700 uppercase tracking-wide mb-4">Education</h2>
                <div className="space-y-4">
                  {data.education.map((edu, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-gray-900">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-teal-600 font-medium">{edu.institution}</span>
                        <span className="text-gray-500 text-sm">{edu.graduationDate}</span>
                      </div>
                      {edu.gpa && <div className="text-gray-500 text-sm mt-1">GPA: {edu.gpa}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-teal-700 uppercase tracking-wide mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <span key={i} className="bg-teal-50 text-teal-700 px-3 py-1 rounded text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-teal-700 uppercase tracking-wide mb-4">Certifications</h2>
                <ul className="space-y-2">
                  {data.certifications.map((cert, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start">
                      <span className="text-teal-500 mr-2 mt-1">✓</span>
                      {cert}
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
