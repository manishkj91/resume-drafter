import { ParsedResume } from "@workspace/api-client-react";

export function MinimalTemplate({ data }: { data: ParsedResume }) {
  return (
    <div className="bg-white p-12 sm:p-16 w-full max-w-[800px] min-h-[1056px] mx-auto text-neutral-800 font-sans font-light">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-normal text-neutral-900 tracking-tight mb-4">{data.contact.name}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-500">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>{data.contact.phone}</span>}
          {data.contact.location && <span>{data.contact.location}</span>}
          {data.contact.linkedin && <span>{data.contact.linkedin}</span>}
          {data.contact.website && <span>{data.contact.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-10">
          <p className="text-sm leading-relaxed text-neutral-600 max-w-2xl">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.workExperience && data.workExperience.length > 0 && (
        <section className="mb-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-widest mt-1">Experience</h2>
            </div>
            <div className="col-span-12 md:col-span-9 space-y-10">
              {data.workExperience.map((exp, i) => (
                <div key={i}>
                  <div className="mb-2">
                    <h3 className="font-medium text-neutral-900 text-lg">{exp.title}</h3>
                    <div className="flex justify-between items-baseline mt-1 text-sm text-neutral-500">
                      <span>{exp.company} {exp.location && `— ${exp.location}`}</span>
                      <span>{exp.startDate} – {exp.endDate || 'Present'}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    {exp.bullets?.map((bullet, j) => (
                      <li key={j} className="leading-relaxed relative pl-4">
                        <span className="absolute left-0 top-[0.4rem] w-1 h-1 bg-neutral-300 rounded-full"></span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-widest mt-1">Education</h2>
            </div>
            <div className="col-span-12 md:col-span-9 space-y-6">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-medium text-neutral-900">{edu.institution}</h3>
                    <span className="text-sm text-neutral-500">{edu.graduationDate}</span>
                  </div>
                  <div className="text-sm text-neutral-600">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                    {edu.gpa && <span className="ml-2">— GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-widest mt-1">Skills</h2>
            </div>
            <div className="col-span-12 md:col-span-9">
              <p className="text-sm leading-relaxed text-neutral-600">
                {data.skills.join(", ")}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-widest mt-1">Certifications</h2>
            </div>
            <div className="col-span-12 md:col-span-9">
              <ul className="space-y-2 text-sm text-neutral-600">
                {data.certifications.map((cert, i) => (
                  <li key={i} className="leading-relaxed relative pl-4">
                    <span className="absolute left-0 top-[0.4rem] w-1 h-1 bg-neutral-300 rounded-full"></span>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
