import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProjects } from "@/contexts/ProjectContext";
import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { Button } from "./ui/button";
import axios from "axios";

interface ClientApp {
  logo: string | null
  profileName: string
  profileDescription: string
  domains: string,
  id: string,
  clientSecret: string,
  streamId: string
}


export default function AppCard({ app }: { app: ClientApp }) {
  const [copiedStreamId, setCopiedStreamId] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [isLoading, setIsLoading] = useState(false) // Added loading state
  const [copiedClientAppId, setCopiedClientAppId] = useState(false);
  const { addProject } = useProjects()
  const { project } = useProjects();

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    if (field == "stream") {
      setCopiedStreamId(true);
      setTimeout(() => setCopiedStreamId(false), 1500); // Hide message after 1.5s
    }
    else if (field == "secret") {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 1500); // Hide message after 1.5s
    }
    else if (field == "appId") {
      setCopiedClientAppId(true);
      setTimeout(() => setCopiedClientAppId(false), 1500); // Hide message after 1.5s
    }

  };

  const rotateSecret = async (clientAppId: string) => {
    try {


      const url = `https://app.plurality.local:443/crm/client-app/rotate-secret/${clientAppId}`
      const stytchToken = localStorage.getItem("stytchToken");
      setIsLoading(true);
      const response = await axios.put(url, {}, {
        headers: {
          Authorization: `Bearer ${stytchToken}`
        }
      });

      if (response?.data?.success) {
        addProject({
          clientAppId: clientAppId,
          clientSecret: response?.data?.clientSecret
        })

      }
      setIsLoading(false);

    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

  }

  const ShortenId = ( id: string,  startLength = 6, endLength = 6 ) => {
    if (id.length <= startLength + endLength) return id;
    return (`${id.slice(0, startLength)}******${id.slice(-endLength)}`);
  };


  
  return (
    <Card className="transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl shadow-md rounded-lg border border-gray-200">
  <CardHeader>
    <CardTitle className="text-lg font-bold">{app.profileName}</CardTitle>
  </CardHeader>
  <CardContent>
    {app.logo && (
      <img
        src={app.logo || "/placeholder.svg"}
        alt={`${app.profileName} logo`}
        className="w-16 h-16 object-cover mb-4 rounded-lg shadow-sm"
      />
    )}
    
    {/* Stream ID */}
    <p 
      onClick={() => copyToClipboard(app.streamId, "stream")} 
      className="text-sm text-gray-500 mb-2 flex items-center gap-2 cursor-pointer hover:text-gray-700 transition-colors"
    >
      Stream Id: {ShortenId(app.streamId)} 
      <IoCopyOutline className="ml-auto" />
      {copiedStreamId && <span className="text-green-500 text-xs">Copied!</span>}
    </p>

    {/* Client App ID */}
    <p 
      onClick={() => copyToClipboard(app.id, "appId")} 
      className="text-sm text-gray-500 mb-2 flex items-center gap-2 cursor-pointer hover:text-gray-700 transition-colors"
    >
      Client App Id: {ShortenId(app.id)} 
      <IoCopyOutline className="ml-auto" />
      {copiedClientAppId && <span className="text-green-500 text-xs">Copied!</span>}
    </p>

    {/* Client App Secret */}
    <p className="text-sm text-gray-500 mb-2 flex items-center gap-2 cursor-pointer">
      Client APP Secret: {project?.clientAppId === app.id ? ShortenId(project.clientSecret) : '********************'}
      {project?.clientAppId === app.id && (
        <IoCopyOutline 
          className="ml-auto cursor-pointer hover:text-gray-700 transition-colors"  
          onClick={() => copyToClipboard(project.clientSecret, "secret")} 
        />
      )}
      {copiedSecret && <span className="text-green-500 text-xs">Copied!</span>}
    </p>

    {project?.clientAppId === app.id && (
      <p className="text-red-500 text-xs font-semibold">Please copy the secret, it will not be visible next time.</p>
    )}

    {/* App URLs */}
    <div className="mt-3">
      <h4 className="font-semibold">App URLs:</h4>
      <ul className="list-disc list-inside text-sm text-gray-600">
        {JSON.parse(app.domains).map((url, index) => (
          <li key={index} className="hover:text-gray-800 transition-colors">{url}</li>
        ))}
      </ul>
    </div>

    {/* Rotate Secret Button */}
    <Button 
      onClick={() => rotateSecret(app.id)} 
      className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
    >
      {isLoading ? "Rotating Secret..." : "Rotate Secret"}
    </Button>
  </CardContent>
</Card>
  )
}

