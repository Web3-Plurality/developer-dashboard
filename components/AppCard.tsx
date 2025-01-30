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
    else if(field == "appId"){
      setCopiedClientAppId(true);
      setTimeout(() => setCopiedClientAppId(false), 1500); // Hide message after 1.5s
    }

  };

  const rotateSecret = async (clientAppId: string) =>{
    try {
      
    
    const url = `https://app.plurality.local:443/crm/client-app/rotate-secret/${clientAppId}`
    const stytchToken = localStorage.getItem("stytchToken");
     setIsLoading(true);
      const response = await axios.put(url,{},{
        headers:{
          Authorization: `Bearer ${stytchToken}`
        }
      });

      if (response?.data?.success) {
        addProject({
          clientAppId: clientAppId,
          clientSecret:response?.data?.clientSecret
        })
      
      }
      setIsLoading(false);
  
    } catch (error) {
    console.log(error);
    setIsLoading(false);
    }

    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{app.profileName}</CardTitle>
      </CardHeader>
      <CardContent>
        {app.logo && (
          <img
            src={app.logo || "/placeholder.svg"}
            alt={`${app.profileName} logo`}
            className="w-16 h-16 object-cover mb-4"
          />
        )}
            <p onClick={()=>{copyToClipboard(app.streamId, "stream")}}  className="text-sm text-gray-500 mb-2">Stream Id: {app.streamId} <IoCopyOutline/>
        {copiedStreamId && <span className="text-green-500 text-xs">Copied!</span>}
        </p>
        <p onClick={()=>{copyToClipboard(app.id, "appId")}}  className="text-sm text-gray-500 mb-2">Client App Id: {app.id} <IoCopyOutline/>
        {copiedClientAppId && <span className="text-green-500 text-xs">Copied!</span>}
        </p>
        <p className="text-sm text-gray-500 mb-2">Client APP Secret: { project?.clientAppId === app.id ? project.clientSecret : '********************'}
        { project?.clientAppId === app.id && <IoCopyOutline onClick={()=>{copyToClipboard(project.clientSecret, "secret")}}/>}
        {copiedSecret && <span className="text-green-500 text-xs">Copied!</span>}
        </p>
        { project?.clientAppId === app.id &&<p>Please Copy the secret it will not visible next time</p>}
        <div>
          <h4 className="font-semibold">App URLs:</h4>
          <ul className="list-disc list-inside">
            {JSON.parse(app.domains).map((url, index) => (
              <li key={index} className="text-sm">
                {url}
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={()=>{rotateSecret(app.id)}}>{isLoading? "Rotating Secret...": "Rotate Secret"}</Button>
      </CardContent>
    </Card>
  )
}

