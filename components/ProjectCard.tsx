import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Project {
  logo: string | null
  profileName: string
  profileDescription: string
  appUrls: string[],
  clientAppId: string,
  clientSecret: string
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.profileName}</CardTitle>
      </CardHeader>
      <CardContent>
        {project.logo && (
          <img
            src={project.logo || "/placeholder.svg"}
            alt={`${project.profileName} logo`}
            className="w-16 h-16 object-cover mb-4"
          />
        )}
        <p className="text-sm text-gray-500 mb-2">{project.profileDescription}</p>
        <p className="text-sm text-gray-500 mb-2">Client Id: {project.clientAppId}</p>
        <p className="text-sm text-gray-500 mb-2">Client Secret: { project.clientSecret}</p>
        <div>
          <h4 className="font-semibold">App URLs:</h4>
          <ul className="list-disc list-inside">
            {project.appUrls.map((url, index) => (
              <li key={index} className="text-sm">
                {url}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

